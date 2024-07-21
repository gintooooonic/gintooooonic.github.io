import useDarkMode from "@/services/useDarkMode";
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  const { isDarkMode } = useDarkMode();

  return (
    <Html lang="ko">
      <Head />
      <body className={isDarkMode ? "dark-mode" : ""}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
