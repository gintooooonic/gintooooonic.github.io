export default function YouTubePlayer() {
  const youtubeVideoIds = ["jfKfPfyJRdk", "TpPwI_Lo0YY", "t99W9uDdc_M"];

  return (
    <ul className="no-scrollbar flex flex-row overflow-x-scroll">
      {youtubeVideoIds.map(id => (
        <li className="mr-5" key={id}>
          <iframe
            className="rounded-lg"
            width="320"
            height="180"
            src={`https://www.youtube-nocookie.com/embed/${id}?si=P1ofLMaEMiARvBHe&amp;controls=0`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          ></iframe>
        </li>
      ))}
    </ul>
  );
}
