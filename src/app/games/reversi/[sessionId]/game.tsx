import React from 'react';
import useLocalStorageState from 'use-local-storage-state';





export default function Game({ sessionId }: { sessionId: string; }) {
  const [session, setSession, { removeItem: removeSession }] = useLocalStorageState(`session:${sessionId}`, {
    defaultValue: { cells: Array(9).fill(''), current: 'X', users: [] }
  });


  return (

    <div>

    </div>
  );
}
