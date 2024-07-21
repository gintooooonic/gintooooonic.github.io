import Link from "next/link";

export default function Navigator() {
  return (
    <nav>
      <ul className="flex select-none flex-row justify-end align-middle font-medium [&>li]:ml-5">
        <li>
          <Link href="/">Home</Link>
        </li>
      </ul>
    </nav>
  );
}
