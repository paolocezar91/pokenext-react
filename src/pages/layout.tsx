import "@/app/globals.css";
import Footer from "@/components/layout/footer";
import "./layout.scss";
import Navbar from "@/components/layout/navbar/navbar";
import Head from "next/head";

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
        <title>{title}</title>
      </Head>
      <div className="container mx-auto">
        <Navbar title={title}/>
        <main className="sm:w-min md:w-[initial]">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
}
