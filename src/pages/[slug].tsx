import Layout from "@/components/Layout";
import { Page, Post, allPages, allPosts } from "contentlayer/generated";

export default function MdPage({ page }: { page: Page }) {
  console.log('page : ', allPages)
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
    paths: allPages.map(page => ({ params: { slug: page.slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }: any) {
  return {
    props: {
      page: findPageBySlug(params.slug),
    },
  };
}

function findPageBySlug(slug: string): Page {
  const page = allPages.find(page => page.slug === slug);
  if (!page) {
    throw new Error(`'${slug}' 포스트를 찾을 수 없습니다.`);
  }

  return page;
}
