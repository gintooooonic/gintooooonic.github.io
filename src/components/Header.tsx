import Link from "next/link";
import DarkModeToggleButton from "./DarkModeToggleButton";

export default function Header() {
  return (
    <header className="mx-auto flex max-w-2xl flex-row justify-between px-5 align-middle">
      <h1 className="select-none text-xl font-bold">
        <Link href="/">w.shin</Link>
      </h1>
      <DarkModeToggleButton isDarkMode={true} onClick={() => {}} />
    </header>
  );
}
