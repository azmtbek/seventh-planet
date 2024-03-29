import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import UserSession from "./user-session";
import Link from "next/link";
import Image from "next/image";
// import { RouteChangeListener } from "./route-change-listener";



const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        fontSans.variable
      )}>
        <div className='fixed top-4 left-4 z-10'>
          <Link href={"/"} className='flex items-center gap-2' >
            <Image alt="home logo" src={'/logo.png'} width={40} height={40} className='w-auto' /> <span className='font-serif text-xl text-[#1a72be]'> 7th planet</span>
          </Link>
        </div>
        {/* <RouteChangeListener /> */}
        <UserSession />
        {children}</body>
    </html>
  );
}
