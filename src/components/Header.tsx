import Link from "next/link";

export default function Header() {
  return (
    <header className="mx-auto flex max-w-xl flex-row justify-between px-5 align-middle">
      <h1 className="select-none text-xl font-bold">
        <Link href="/">@w.shin</Link>
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
