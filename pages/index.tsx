import type { NextPage } from "next";
import { useRef } from "react";
import { SocialBar } from "../components/SocialBar";
import { YoutubeSection, Video } from "../components/VideoSection";
import { useAnimation } from "../hooks/useAnimation";

type HomeProps = {
  videos: Video[];
};

const Home: NextPage<HomeProps> = ({ videos }) => {
  const divRef = useRef<HTMLDivElement>(null);

  useAnimation({
    // @ts-ignore
    divRef
  });

  return (
    <main className="container mx-auto p-6 md:pt-20">
      <div className="flex flex-col justify-center items-center">
        <div
          ref={divRef}
          className="aspect-square max-w-[600px] bg-black text-[10px] leading-[10px] md:text-[16px] md:leading-[16px]"
        />
        <h1 className="font-medium text-4xl mb-4">Anthony Riera</h1>
        <SocialBar />
        <section className="w-full md:max-w-3xl md:mx-auto mt-8 md:mt-4 md:pb-96">
          <h3 className="mb-4">My youtube videos</h3>
          <YoutubeSection videos={videos} />
        </section>
      </div>
    </main>
  );
};

export type YTType = {
  id: {
    kind: string;
    videoId: string;
    channelId: string;
    playlistId: string;
  };
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: Record<
      "default" | "medium" | "high",
      {
        url: string;
        width: number;
        height: number;
      }
    >;
    channelTitle: string;
    liveBroadcastContent: string;
  };
};

export async function getStaticProps() {
  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?key=${process.env.GOOGLE_API_KEY}&channelId=UCvjRCspZdRy1NMqyh_7BKyQ&type=video&part=snippet,id&order=date&maxResults=20`
    );
    const json = (await res.json()) as { items: YTType[] };

    const filteredVideos = json.items.map((item) => ({
      title: item.snippet.title,
      thumbnailUrl: `https://img.youtube.com/vi/${item.id.videoId}/maxresdefault.jpg`,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`
    }));

    return {
      props: {
        videos: filteredVideos
      },
      revalidate: 600
    };
  } catch (err) {
    console.log("ERROR", err);
    return {
      props: {
        videos: []
      }
    };
  }
}

export default Home;
