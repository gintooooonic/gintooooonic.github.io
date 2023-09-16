import Link from "next/link";
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "w.shin",
  description: "Hello, world!",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="pb-32 pt-20">
        <Header />
        <main className="mx-auto my-10 max-w-xl px-4">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

function Header() {
  return (
    <header className="mx-auto flex max-w-xl flex-row justify-between px-4 align-middle">
      <h1 className="select-none text-xl font-bold">
        <Link href="/">w.shin</Link>
      </h1>
      <nav>
        <ul className="flex select-none flex-row justify-end align-middle font-medium [&>li]:ml-5">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/posts">Posts</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mx-auto max-w-xl select-none px-4">
      <p className="text-sm">&copy; {year} w.shin</p>
    </footer>
  );
}
