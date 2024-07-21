import Link from "next/link";

export default function Header() {
  return (
    <header className="mx-auto flex max-w-2xl flex-row justify-between px-5 align-middle">
      <h1 className="select-none text-xl font-bold">
        <Link href="/">w.shin</Link>
      </h1>
      <Navigator />
    </header>
  );
}

function Navigator() {
  return (
    <nav>
      <ul className="flex select-none flex-row justify-end align-middle font-medium [&>li]:ml-5">
        {/* <li>
          <Link href="/">Home</Link>
        </li> */}
      </ul>
    </nav>
  );
}
