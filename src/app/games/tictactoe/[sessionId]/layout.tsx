'use client';
import React from 'react';

import useLocalStorageState from 'use-local-storage-state';
import Image from 'next/image';
import Link from 'next/link';
export default function Layout({ params: { sessionId },
  children,
}: Readonly<{
  params: { sessionId: string; },
  children: React.ReactNode;
}>) {
  const [session, setSession, { removeItem: removeSession }] = useLocalStorageState(`session:${sessionId}`);

  const navigateHome = () => {
    removeSession();
    console.log('navigate home');
  };
  return (
    <>
      <div className='fixed top-4 left-4'>
        <Link href={"/"} className='flex items-center gap-2' onClick={navigateHome} >
          <Image alt="home logo" src={'/logo.png'} width={40} height={40} className='w-auto' /> <span className='font-serif text-xl text-[#1a72be]'> 7th planet</span>
        </Link>
      </div>
      {children}
    </>
  );
}
