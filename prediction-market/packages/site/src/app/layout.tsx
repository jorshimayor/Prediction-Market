"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import Provider from "@/providers/WagmiProvider";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Provider>
      <html lang="en">
        <head>
          <link rel="icon" href="/KM1.png" />
        </head>
        <body className={inter.className}>{children}</body>
      </html>
    </Provider>
  );
}
