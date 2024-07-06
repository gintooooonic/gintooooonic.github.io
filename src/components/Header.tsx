import Link from "next/link";

export default function Header() {
  return (
    <header className="mx-auto flex max-w-2xl flex-row justify-between px-5 align-middle">
      <h1 className="select-none text-xl font-bold">
        <Link href="/">w.shin</Link>
      </h1>
    </header>
  );
}

/**
 * @deprecated 홈/포스트 페이지 구분이 사라지면서 불필요해졌으나, 나중에 필요한 경우 다시 사용 가능
 */
function Navigator() {
  return (
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
  );
}
