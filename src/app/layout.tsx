import "@/app/globals.css";
import Header from "../components/header/header";
import Head from "next/head";
import "./layout.scss";

export default function RootLayout({
  children,
  title,
}: Readonly<{
  children: React.ReactNode;
  title: string
}>) {
  return (
    <html lang="en">
      <Head>
        <title>{ String(title) }</title>
      </Head>
      <body className="antialiased">
        <div className="container mx-auto">
          <Header title={ String(title) } />
          <main className="p-4">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
