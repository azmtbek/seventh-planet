'use client';
import { Button } from '@/components/ui/button';
import React, { ButtonHTMLAttributes, MouseEventHandler, useEffect, useState } from 'react';
import { Cell } from './cell';
import useLocalStorageState from 'use-local-storage-state';

import { AblyProvider, useChannel } from "ably/react";
import * as Ably from 'ably';
import { redirect, useRouter } from 'next/navigation';
import { SymbolIcon } from '@radix-ui/react-icons';

export default function PubSubClient({ sessionId }: { sessionId: string; }) {
  const client = new Ably.Realtime.Promise({ authUrl: '/token', authMethod: 'POST' });
  return (
    <AblyProvider client={client}>
      <Game sessionId={sessionId} />
    </AblyProvider>
  );
};

export function Game({ sessionId }: { sessionId: string; }) {
  const [session, setSession, { removeItem: removeSession }] = useLocalStorageState(`session:${sessionId}`, {
    defaultValue: { cells: Array(9).fill(''), current: 'X', users: [] as { id: string, name: string; }[] }
  });
  const [user] = useLocalStorageState<{ id: string, name: string; }>('user');
  const [userSessions, setUserSessions] = useLocalStorageState<string[]>('userSessions', { defaultValue: [] });
  const { channel } = useChannel(`tictactoe:${sessionId}`, (message: Ably.Types.Message) => {
    // setLogs(prev => [...prev, message.data]);
    setSession((prev) => (JSON.parse(message.data)));
  });
  const router = useRouter();

  useEffect(() => {
    if (user && session.users.findIndex(u => u.id === user.id) === -1 && session.users.length < 2)
      setSession((prev) => ({ ...prev, users: [...prev.users, user] }));
  }, [user, session]);
  useEffect(() => {
    if (user && session.users.findIndex(u => u.id === user.id) === -1 && session.users.length >= 2)
      router.push('/sessions/tictactoe');
  }, [user, session]);
  useEffect(() => {
    if (sessionId && !userSessions.includes(`tictactoe:${sessionId}`))
      setUserSessions((prev) => [...prev, `tictactoe:${sessionId}`]);
  }, [sessionId]);

  const winner = calculateWinner(session.cells);
  // const [logs, setLogs] = useState<string[]>([]);

  const publicFromClientHandler = (newSession: string) => {
    if (channel === null) return;
    channel.publish(`user:${user?.id}`, newSession);
  };

  const handleClick = (index: number) => {
    if (session.cells[index] || winner) return;
    if (session.users[0].id === user?.id && session.current === 'X') return;
    if (session.users[1].id === user?.id && session.current === 'O') return;
    const newCells = [...session.cells];
    newCells[index] = session.current;

    const newPlayer = session.current === 'X' ? 'O' : 'X';
    setSession((prev) => ({ ...prev, current: newPlayer, cells: newCells }));
    publicFromClientHandler(JSON.stringify({ ...session, current: newPlayer, cells: newCells }));
  };
  const handleRestart = () => {
    setSession(prev => ({ ...prev, cells: Array(9).fill(''), current: 'X' }));
    if (channel === null) return;
    channel.publish(`user:${user?.id}`, JSON.stringify({ ...session, cells: Array(9).fill(''), current: 'X' }));
  };
  const handleLeave = () => {
    setSession(prev => ({ ...prev, cells: Array(9).fill(''), current: 'X' }));
    if (channel === null) return;

    channel.publish(`user:${user?.id}`,
      JSON.stringify(
        {
          ...session,
          cells: Array(9).fill(''),
          current: 'X',
          users: session.users.filter(u => u.id !== user?.id)
        }
      )
    );
    router.push('/');
  };

  return <div className='flex flex-col  justify-center items-center gap-10 py-10'>
    <div>{session.users.length < 2 && <span className='animate-pulse flex items-center gap-2'>waiting for a player to connect <SymbolIcon className='animate-spin-slow' /></span>}</div>
    <div className='text-2xl'>{getStatus(winner, session.current, session.cells)}</div>
    <div className='text-lg'>You are: {session.users.length > 0 && session.users[0].id === user?.id ? 'O' : 'X'}</div>
    <div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '10px',
        width: 'fit-content'
      }}>{Object.keys(session.cells).map((i) =>
        <Cell
          key={i}
          index={+i}
          currCell={session.cells[+i]}
          onClick={handleClick}
        />
      )}</div>
    </div>
    <div className='flex gap-2'>
      <Button onClick={handleRestart}>
        Restart
      </Button>
      <Button onClick={handleLeave} variant={'destructive'}>
        Leave
      </Button>
    </div>
    {/* <div>{logs.map((l, i) => <p key={i}>{l}</p>)}</div> */}
  </div>;
}


const calculateWinner = (cells: string[]) => {
  const WINS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < WINS.length; i++) {
    const [a, b, c] = WINS[i];
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
      return cells[a];
    }
  }
  return null;
};


const getStatus = (winner: string | null, player: string, cells: string[]) => {
  const isDraw = !cells.includes('');

  return winner
    ? 'Winner: ' + winner
    : isDraw
      ? "Draw"
      : "Next Player: " + player;
};