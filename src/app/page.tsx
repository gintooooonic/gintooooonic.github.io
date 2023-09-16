import { allIntroductions } from "contentlayer/generated";

export default function Home() {
  const introduction = findIntroduction();

  return (
    <main>
      <div
        className="prose break-words"
        dangerouslySetInnerHTML={{ __html: introduction.body.html }}
      />
    </main>
  );
}

function findIntroduction() {
  const introduction = allIntroductions[0];
  if (!introduction) {
    throw new Error("introduction 문서를 찾을 수 없습니다.");
  }

  if (allIntroductions.length > 1) {
    console.warn("1개 이상의 introduction 문서가 존재합니다.");
  }

  return introduction;
}
