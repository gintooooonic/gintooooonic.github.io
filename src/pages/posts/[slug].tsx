import Layout from "@/components/Layout";
import { Post, allPosts } from "contentlayer/generated";

export default function Post({ post }: { post: Post }) {
  return (
    <Layout title={`${post.title} — w.shin`}>
      <h1 className="mb-3 text-3xl font-bold">{post.title}</h1>
      <p className="text-neutral-500">{post.description}</p>
      <hr className="mb-10 mt-5" />

      <div className="prose break-words" dangerouslySetInnerHTML={{ __html: post.body.html }} />
    </Layout>
  );
}

export async function getStaticPaths() {
  return {
    paths: allPosts.map(post => ({ params: { slug: post.slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }: any) {
  return {
    props: {
      post: findPostBySlug(params.slug),
    },
  };
}

function findPostBySlug(slug: string): Post {
  const post = allPosts.find(post => post.slug === slug);
  if (!post) {
    throw new Error(`'${slug}' 포스트를 찾을 수 없습니다.`);
  }

  return post;
}
