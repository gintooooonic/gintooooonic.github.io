import { allPosts } from "contentlayer/generated";

interface PostProps {
  params: {
    slug: string;
  };
}

export default function Post(props: PostProps) {
  const post = allPosts.find(post => post.slug === props.params.slug);
  if (!post) throw new Error(`Post not found for slug : ${props.params.slug}`);

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: post.body.html }} />
    </>
  );
}
