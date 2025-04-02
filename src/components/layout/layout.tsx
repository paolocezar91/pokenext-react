import "@/app/globals.css";
import "./layout.scss";
import Header from "./header/header";

const title = "Next.js Pokédex Demo";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="container mx-auto">
          <Header title={ title } />
          <main className="container-fluid p-4">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
