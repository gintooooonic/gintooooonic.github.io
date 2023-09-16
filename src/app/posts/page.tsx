import { allPosts } from "contentlayer/generated";

export default function Posts() {
  const posts = allPosts.sort((a, b) => (a.date < b.date ? 1 : -1));
  console.log(posts);
  return (
    <ul>
      {posts.map(post => (
        <li>
          <a href={`posts/${post.slug}`}>
            {post.title} ({post.description})
          </a>
        </li>
      ))}
    </ul>
  );
}
