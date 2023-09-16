import { Post, allPosts } from "contentlayer/generated";

interface PostProps {
  params: {
    slug: string;
  };
}

export default function Post(props: PostProps) {
  const post = findPostBySlug(props.params.slug);

  return (
    <article>
      <h1 className="mb-3 text-4xl font-bold">{post.title}</h1>
      <p className="text-neutral-500">{post.description}</p>
      <hr className="mb-10 mt-5" />

      <div className="prose break-words" dangerouslySetInnerHTML={{ __html: post.body.html }} />
    </article>
  );
}

function findPostBySlug(slug: string): Post {
  const post = allPosts.find(post => post.slug === slug);
  if (!post) {
    throw new Error(`'${slug}' 포스트를 찾을 수 없습니다.`);
  }

  return post;
}
