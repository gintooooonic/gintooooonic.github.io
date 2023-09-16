import Layout from "@/components/Layout";
import { Post, allPosts } from "contentlayer/generated";
import Link from "next/link";

export const metadata = { title: "포스트 — w.shin" };

export default function Posts() {
  const posts = allPosts
    .filter(post => !post.draft)
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date));

  console.log(posts);

  return (
    <Layout>
      <PostList posts={posts} />
    </Layout>
  );
}

function PostList({ posts }: PostListProps) {
  return (
    <ul>
      {posts.map(post => (
        <li className="mb-7" key={post.slug}>
          <Link href={`posts/${post.slug}`}>
            <div>
              <h2 className="text-lg font-medium">{post.title}</h2>
              <p className="text-neutral-500">{post.description}</p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

interface PostListProps {
  posts: Post[];
}
