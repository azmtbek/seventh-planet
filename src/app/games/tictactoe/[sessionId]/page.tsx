import React from 'react';
// import Game from './game';
import dynamic from 'next/dynamic';

const Game = dynamic(() => import('./game'), {
  ssr: false,
});

export default function Page({ params: { sessionId } }: { params: { sessionId: string; }; }) {

  return (<>
    <div className='flex flex-col items-center h-screen'>
      <Game sessionId={sessionId} />
    </div>
  </>
  );
}
