import React from 'react';
// import Game from './game';
import { SymbolIcon } from '@radix-ui/react-icons';
import dynamic from 'next/dynamic';

const Game = dynamic(() => import('./game'), {
  ssr: false,
});

export default function Page({ params: { sessionId } }: { params: { sessionId: string; }; }) {

  return (<>
    <div className='flex flex-col items-center h-screen'>
      <div className='py-10 animate-pulse flex items-center gap-2'>waiting for a player to connect <SymbolIcon className='animate-spin-slow' /></div>
      <Game sessionId={sessionId} />
    </div>
  </>
  );
}
