"use client";

import Market from "@/components/Market";
import { ConnectButton } from "@consensys/connect-button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="relative flex flex-col items-center gap-20 min-h-screen mx-auto md:p-10">
      <div className=" flex justify-center pt-5 md:pt-0 z-10 max-w-5xl w-full lg:items-center lg:justify-between font-mono text-sm lg:flex">
        <div className="absolute bottom-0 left-0 flex w-full items-end justify-center lg:static lg:h-auto lg:w-auto lg:bg-none ">
          <Link
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="#"
            target="_blank"
            rel="noopener noreferrer"
          >
            K-Market
          </Link>
        </div>
        <ConnectButton />
      </div>
      <Market />
    </main>
  );
}
