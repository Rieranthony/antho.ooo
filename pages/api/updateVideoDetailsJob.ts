import type { NextApiRequest, NextApiResponse } from "next";
import { google } from "googleapis";
import axios from "axios";

const youtube = google.youtube({
  version: "v3",
  auth: process.env.GOOGLE_API_KEY // specify your API key here
});

const videoId = "Vx71pC4aFFI";
const imageUrl = "https://antho.ooo/api/thumbnail";

const job = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    res.status(405).send("Method not allowed");
    return;
  }

  try {
    // et the view count from gppgle api
    const { data } = await youtube.videos.list({
      id: [videoId]
    });

    console.log("videos", data);

    const videosResult = data.items;

    if (!videosResult || !videosResult[0]) {
      throw "No video found";
    }

    // Get the view count in the result from the API
    const viewCount = videosResult[0].statistics?.viewCount;

    console.log("view count", viewCount);

    // Don't know why but maybe video has no view
    if (!viewCount) {
      throw "No view count found";
    }

    // Generate image URL with the view in it
    const imgUrl = new URL(imageUrl);
    imgUrl.searchParams.append("views", viewCount.toString());

    // Get image
    const imageResponse = await axios.get(imageUrl, {
      responseType: "arraybuffer"
    });

    const imageBuffer = Buffer.from(imageResponse.data, "binary");

    // Call the API to update the thumbnail as well
    const response = await youtube.thumbnails.set({
      videoId,
      media: {
        mimeType: "image/png",
        body: imageBuffer
      }
    });

    console.log("response from google API", response);

    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

export default job;
