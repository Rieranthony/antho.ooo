import Image from "next/Image";

export type Video = {
  url: string;
  title: string;
  thumbnailUrl: string;
};

function Video({ url, title, thumbnailUrl }: Video) {
  return (
    <a
      href={url}
      className="flex flex-col p-4 border border-dp-medium-emphasis hover:border-dp-normal rounded-lg hover:cursor-pointer transition-colors hover:bg-dp-02 hover:bg-opacity-25"
    >
      <Image
        alt={`Video Anthony Riera - ${title}`}
        src={thumbnailUrl}
        width={1280}
        height={720}
        className="rounded-md"
      />
      <p className="text-base mt-4 max-w-full">{title}</p>
    </a>
  );
}

export function YoutubeSection({ videos }: { videos: Video[] }) {
  return (
    <div className="grid gap-4 grid-flow-row md:grid-flow-col md:grid-cols-2">
      {videos.map((video, i) => (
        <Video {...video} key={`video-${i}`} />
      ))}
    </div>
  );
}
