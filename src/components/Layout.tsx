import Head from "next/head";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout(props: LayoutProps) {
  const title = props.title ?? "w.shin";
  const description = props.description ?? "Hello, world!";

  return (
    <div className="pb-16 pt-10 sm:pb-32 sm:pt-20">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>
      <Header />
      <main className="mx-auto my-12 max-w-2xl px-5">{props.children}</main>
      <Footer />
    </div>
  );
}

interface LayoutProps {
  children?: React.ReactNode;
  title?: string;
  description?: string;
}
