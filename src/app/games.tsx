import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from 'next/image';
import Link from 'next/link';
import { games } from '@/lib/gamesData';
import { Button } from '@/components/ui/button';



export default function Games() {

  return (
    <main className='flex w-full h-screen justify-center items-center'>
      <div className='flex  gap-6'>{
        Object.values(games)
          .map(game =>
            <Game key={game.id} game={game} />
          )
      }</div>
    </main>
  );
}


function Game({ game }: any) {
  return <Card>
    <CardHeader>
      <CardTitle>{game.name}</CardTitle>
    </CardHeader>
    <CardContent>
      <Image src={game.img} alt={game.name} width={200} height={200} className='w-auto' />
    </CardContent>
    <CardFooter>
      <Link href={'sessions/' + game.id} className='w-full'><Button variant={'outline'} className='w-full'>Play</Button></Link>
    </CardFooter>
  </Card>;
}