'use client';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import useLocalStorageState from 'use-local-storage-state';





export default function Game({ sessionId }: { sessionId: string; }) {
  // const [session, setSession, { removeItem: removeSession }] = useLocalStorageState(`session:${sessionId}`, {
  // defaultValue: { cells: Array.from({ length: 8 }, _ => Array(8).fill('')), current: 'black', users: [] }
  // });
  const [session, setSession] = useState({ cells: Array(8).fill(null).map(_ => Array(8).fill('')), current: 'black', users: [] });
  useEffect(() => {
    const initCels = copyCells;
    initCels[3][3] = 'black';
    initCels[3][4] = 'white';
    initCels[4][3] = 'white';
    initCels[4][4] = 'black';
    setSession((prev) => ({ ...prev, cells: initCels }));
  }, []);


  const isValidMove = useCallback((row: number, col: number) => {
    if (session.cells[row][col] === 'black' || session.cells[row][col] === 'white') {
      return false;
    }

    let hasAdjacentOpponent = false;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (isInBoundries(row, col, i, j)) {
          if (session.cells[row + i][col + j] === getOpponentColor) {
            hasAdjacentOpponent = true;
          }
        }
      }
    }
    if (!hasAdjacentOpponent) {
      return false;
    }

    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (isInBoundries(row, col, i, j)) {
          if (checkDirection(row, col, i, j)) {
            return true;
          }
        }
      }
    }
    return false;
  }, [session]);

  const checkDirection = useCallback((row: number, col: number, dirRow: number, dirCol: number) => {
    let x = row + dirRow;
    let y = col + dirCol;
    while (x >= 0 && x < 8 && y >= 0 && y < 8) {
      if (session.cells[x][y] !== getOpponentColor) {
        return false;
      }
      x += dirRow;
      y += dirCol;
      if (x < 8 && y < 8 && session.cells[x][y] === session.current) {
        return true;
      }
    }
    return false;
  }, [session]);
  const flipPieces = useCallback((row: number, col: number) => {
    let cells = copyCells;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (isInBoundries(row, col, i, j)) {
          cells = flipDirection(row, col, i, j, cells);
        }
      }
    }
    return cells;
  }, [session]);
  const isInBoundries = useCallback(
    (r: number, c: number, i: number, j: number) => r + i >= 0 && r + i < 8 && c + j >= 0 && c + j < 8 && (i !== 0 || j !== 0),
    []);
  const flipDirection = useCallback((row: number, col: number, dirRow: number, dirCol: number, cells: string[][]) => {
    let x = row + dirRow;
    let y = col + dirCol;
    while (x >= 0 && x < 8 && y >= 0 && y < 8) {
      if (cells[x][y] !== getOpponentColor) {
        return cells;
      }
      cells[x][y] = session.current;
      x += dirRow;
      y += dirCol;
      if (x < 8 && y < 8 && cells[x][y] == session.current) {
        return cells;
      }
    }
    return cells;
  }, [session]);
  const getOpponentColor = useMemo(() => {
    return session.current === 'black' ? 'white' : 'black';
  }, [session]);

  const copyCells = useMemo(() => {
    return [...session.cells.map(row => [...row])];
  }, [session]);
  function handleClick(row: number, col: number) {
    console.log('cells', session.cells);
    console.log('row call', row, col);
    console.log('isValid', session.cells[row][col]);
    if (isValidMove(row, col)) {

      let newCells = copyCells;
      newCells[row][col] = session.current;
      newCells = flipPieces(row, col);
      const newPlayer = session.current === 'black' ? 'white' : 'black';
      setSession((prev) => ({ ...prev, current: newPlayer, cells: newCells }));
    }
  }
  return (
    <div className='flex flex-col gap-3'>
      {session.cells.map((row, rid) =>
        <div key={rid} className='flex gap-3'>
          {row.map((col, cid) =>
            <Button variant={'outline'}
              key={cid}
              className={
                cn('p-10 bg-contain bg-green-800 hover:bg-green-600',
                  col === 'black' && 'bg-[url("/black.png")]',
                  col === 'white' && 'bg-[url("/white.png")]'
                )}
              onClick={() => handleClick(rid, cid)}>
            </Button>)}
        </div>
      )}
    </div >
  );
}
