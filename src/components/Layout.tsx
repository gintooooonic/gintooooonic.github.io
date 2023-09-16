import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "w.shin",
  description: "Hello, world!",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pb-32 pt-20">
      <Header />
      <main className="mx-auto my-12 max-w-xl px-4">{children}</main>
      <Footer />
    </div>
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
            <Link href="/">홈</Link>
          </li>
          <li>
            <Link href="/posts">포스트</Link>
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
