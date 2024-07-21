import Link from "next/link";
import DarkModeToggleButton from "./DarkModeToggleButton";
import useDarkMode from "@/services/useDarkMode";

export default function Header() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <header className="mx-auto flex max-w-2xl flex-row justify-between px-5 align-middle">
      <h1 className="select-none text-xl font-bold">
        <Link href="/">w.shin</Link>
      </h1>
      <DarkModeToggleButton isDarkMode={isDarkMode} onClick={toggleDarkMode} />
    </header>
  );
}
