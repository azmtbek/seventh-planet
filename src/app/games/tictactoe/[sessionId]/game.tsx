'use client';
import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import { Cell } from './cell';
import useLocalStorageState from 'use-local-storage-state';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function Game({ sessionId }: { sessionId: string; }) {
  const [session, setSession, { removeItem: removeSession }] = useLocalStorageState(`session:${sessionId}`, {
    defaultValue: { cells: Array(9).fill(''), current: 'X', users: [] }
  });
  // const [player, setPlayer] = useState(session.current);

  // const [cells, setCells] = useState([...session.cells]);

  const winner = calculateWinner(session.cells);


  const handleClick = (index: number) => {
    if (session.cells[index] || winner) return;
    const newCells = [...session.cells];
    newCells[index] = session.current;

    // setCells(newCells);
    const newPlayer = session.current === 'X' ? 'O' : 'X';
    // setPlayer(newPlayer);
    setSession((prev) => ({ ...prev, current: newPlayer, cells: newCells }));
  };
  const handleRestart = () => {
    // setCells(Array(9).fill(''));
    // setPlayer('X');
    setSession(prev => ({ ...prev, cells: Array(9).fill(''), current: 'X' }));
  };


  const pathname = usePathname();
  const searchParams = useSearchParams();

  // useEffect(() => {
  //   const url = `${pathname}`;
  //   console.log(url);
  //   // You can now use the current URL
  //   // ...
  //   return () => {
  //     console.log('exit', url);
  //   };
  // }, [pathname, searchParams]);

  // useEffect(() => {
  //   const handleRouteChange = (url: any, { shallow }: any) => {
  //     console.log(
  //       `App is changing to ${url} ${shallow ? 'with' : 'without'
  //       } shallow routing`
  //     );
  //   };

  //   router.events.on('routeChangeStart', handleRouteChange);

  //   // If the component is unmounted, unsubscribe
  //   // from the event with the `off` method:
  //   return () => {
  //     router.events.off('routeChangeStart', handleRouteChange);
  //   };
  // }, [router]);

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