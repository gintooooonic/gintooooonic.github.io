export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mx-auto max-w-xl select-none px-5">
      <p className="text-sm">&copy; {year} w.shin</p>
    </footer>
  );
}
