'use client';
import { Button } from '@/components/ui/button';
import React, { MouseEvent, MouseEventHandler, useEffect, useState } from 'react';
import { Cell } from './cell';
import useLocalStorageState from 'use-local-storage-state';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { AblyProvider, useChannel } from "ably/react";
import * as Ably from 'ably';

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
    defaultValue: { cells: Array(9).fill(''), current: 'X', users: [] }
  });
  // const [player, setPlayer] = useState(session.current);

  // const [cells, setCells] = useState([...session.cells]);

  const winner = calculateWinner(session.cells);
  const [logs, setLogs] = useState<string[]>([]);
  const { channel } = useChannel("tictactoe", (message: Ably.Types.Message) => {
    setLogs(prev => [...prev, message.data.text]);
  });

  const publicFromClientHandler = () => {
    if (channel === null) return;
    channel.publish('user', { text: `message` });
  };

  const handleClick = (index: number) => {
    if (session.cells[index] || winner) return;
    const newCells = [...session.cells];
    newCells[index] = session.current;

    const newPlayer = session.current === 'X' ? 'O' : 'X';
    setSession((prev) => ({ ...prev, current: newPlayer, cells: newCells }));
    publicFromClientHandler();
  };
  const handleRestart = () => {

    setSession(prev => ({ ...prev, cells: Array(9).fill(''), current: 'X' }));
  };

  return <div className='flex flex-col  justify-center items-center gap-10'>
    <div className='text-2xl'>{getStatus(winner, session.current, session.cells)}</div>
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
    <div>
      <Button onClick={handleRestart}>
        Restart
      </Button>
    </div>
    <div>{logs.map((l, i) => <p key={i}>{l}</p>)}</div>
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