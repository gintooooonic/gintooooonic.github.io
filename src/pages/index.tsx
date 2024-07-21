import Layout from "@/components/Layout";
import { Post } from "contentlayer/generated";
import Link from "next/link";
import { useRouter } from "next/router";
import Posts from "@/services/posts";

export default function PostListPage() {
  const { query } = useRouter();
  const category = query.category as string | undefined;

  const posts = Posts.findAll()
    .filter(post => !category || post.category === category)
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date));

  return (
    <Layout>
      <ul className="mb-10 flex flex-row text-sm text-neutral-500 [&>li]:mr-5 [&>li]:font-medium">
        <li>
          <Link href="" className={category || "text-black"}>
            전체
          </Link>
        </li>
        {Posts.findAllCategories().map(name => (
          <li key={name}>
            <Link href={`?category=${name}`} className={name === category ? "text-black" : ""}>
              {name}
            </Link>
          </li>
        ))}
      </ul>
      {posts.length > 0 ? (
        <PostList posts={posts} />
      ) : (
        <p className="text-center text-sm text-neutral-500">포스트가 존재하지 않습니다.</p>
      )}
    </Layout>
  );
}

function PostList({ posts }: { posts: Post[] }) {
  return (
    <ul>
      {posts.map(post => (
        <li className="mb-7" key={post.slug}>
          <Link href={`posts/${post.slug}`}>
            <div>
              <p className="text-xs font-medium">{post.category}</p>
              <h2 className="text-lg font-medium">{post.title}</h2>
              <p className="text-neutral-500">{post.description}</p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
