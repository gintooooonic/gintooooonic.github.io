import Layout from "@/components/Layout";
import { Post } from "contentlayer/generated";
import Posts from "@/services/posts";

export default function PostViewPage({ post }: { post: Post }) {
  return (
    <Layout title={`${post.title} — w.shin`}>
      <h2 className="mb-3 text-2xl font-bold">{post.title}</h2>
      <p className="text-neutral-500">{post.description}</p>
      <hr className="mb-10 mt-5" />

      <div
        className="prose overflow-x-scroll break-words"
        dangerouslySetInnerHTML={{ __html: post.body.html }}
      />
    </Layout>
  );
}

export async function getStaticPaths() {
  return {
    paths: Posts.findAllPostIds().map(postId => ({ params: { slug: postId } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }: any) {
  return {
    props: {
      post: Posts.findOne(params.slug),
    },
  };
}
