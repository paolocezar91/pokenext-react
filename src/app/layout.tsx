'use client';

import "./layout.scss";
import "@/app/globals.css";
import Head from "next/head";
import Header from "../components/header/header";

export default function RootLayout({
  children,
  title,
}: Readonly<{
  children: React.ReactNode;
  title: string
}>) {
  return (
    <>
      <Head>
        <title>{ String(title) }</title>
      </Head>
      <div className="container mx-auto">
        <Header title={ String(title) } />
        <main className="p-4">
          {children}
        </main>
      </div>
    </>
  );
}
