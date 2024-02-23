import React from 'react';
import { games } from '@/lib/gamesData';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Page({ params: { gameId } }: { params: { gameId: string; }; }) {
  const game = games[gameId];
  const sessionId = 'fasdfsasfa';
  if (!game) return <div>No such game found </div>;
  return (
    <div className='flex flex-col h-screen items-center pt-24 gap-10'>
      <h1 className='text-4xl'>{game.name}</h1>
      <Image src={game.img} alt={game.name} width={100} height={100} className='w-auto' />
      <h1 className='text-2xl'>Sessions</h1>
      <div>

        <Link href={`/games/${game.id}/${sessionId}`}><Button variant={'outline'} className='w-full'>+ open new session</Button></Link>

      </div>
    </div>
  );
}
