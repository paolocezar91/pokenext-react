'use client';

import "@/app/globals.css";
import Head from "next/head";
import Header from "../components/header/header";
import "./layout.scss";
import Footer from "@/components/footer";

export default function RootLayout({
  children,
  title,
}: Readonly<{
  children: React.ReactNode;
  title: string
}>) {

  title = 'Pokédex -- ' + title;

  return (
    <>
      <Head>
        <title>{ title }</title>
      </Head>
      <div className="container mx-auto">
        <Header title={ title } />
        <main>
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
}
