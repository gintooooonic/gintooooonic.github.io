import Layout from "@/components/Layout";
import YouTubePlayer from "@/components/YouTubePlayer";
import Introduction from "@/components/Introduction";

export default function MainPage() {
  return (
    <Layout>
      <Introduction />
      <div className="my-10">
        <YouTubePlayer />
      </div>
    </Layout>
  );
}
