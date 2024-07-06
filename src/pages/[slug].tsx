import Layout from "@/components/Layout";
import { Page } from "contentlayer/generated";
import Pages from "@/services/pages";

export default function MdPage({ page }: { page: Page }) {
  return (
    <Layout title={`${page.title} — w.shin`}>
      <h1 className="mb-3 text-3xl font-bold">{page.title}</h1>
      <p className="text-neutral-500">{page.description}</p>
      <hr className="mb-10 mt-5" />

      <div
        className="prose overflow-x-scroll break-words"
        dangerouslySetInnerHTML={{ __html: page.body.html }}
      />
    </Layout>
  );
}

export async function getStaticPaths() {
  return {
    paths: Pages.findAllPageIds().map(pageId => ({ params: { slug: pageId } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }: any) {
  return {
    props: {
      page: Pages.findOne(params.slug),
    },
  };
}
