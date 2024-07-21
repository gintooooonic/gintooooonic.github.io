import { useEffect, useState } from "react";
import ColorThemeService from "./color-theme";

export default function useDarkMode(): UseDarkModeType {
  const [isDarkMode, setIsDarkMode] = useState<boolean>();

  useEffect(() => {
    setIsDarkMode(ColorThemeService.isDarkMode());
  });

  const toggleDarkMode = (): void => {
    const nextValue = !isDarkMode;
    console.log(`changed to ${nextValue}`);
    setIsDarkMode(nextValue);
    ColorThemeService.set(nextValue);
  };

  return { isDarkMode: isDarkMode ?? DEFAULT_MODE, toggleDarkMode };
}

const DEFAULT_MODE = false; // light mode

interface UseDarkModeType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}
