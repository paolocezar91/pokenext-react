import "@/app/globals.css";
import "./layout.scss";
import Header from "./header/header";
import Head from "next/head";

const title = "Next.js Pokédex Demo";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <title>{ title }</title>
      </Head>
      <body className="antialiased">
        <div className="container mx-auto">
          <Header title={ title } />
          <main className="p-4">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
