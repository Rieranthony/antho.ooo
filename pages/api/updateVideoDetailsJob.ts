import type { NextApiRequest, NextApiResponse } from "next";
import { google } from "googleapis";
import axios from "axios";

const credentialJSON = JSON.parse(
  process.env.GOOGLE_APPLICATION_CREDENTIALS || ""
);

const videoId: string = "Vx71pC4aFFI";
const imageUrl = "https://antho.ooo/api/thumbnail";

const job = async (req: NextApiRequest, res: NextApiResponse) => {
  // configure a JWT auth client
  const jwtClient = new google.auth.JWT(
    credentialJSON.client_email,
    undefined,
    credentialJSON.private_key,
    ["https://www.googleapis.com/auth/youtube"]
  );
  //authenticate request
  jwtClient.authorize(function (err, tokens) {
    if (err) {
      console.log(err);
      return;
    } else {
      console.log("Successfully connected!");
    }
  });

  const youtube = google.youtube({
    version: "v3",
    auth: jwtClient
  });

  try {
    // et the view count from gppgle api
    const { data } = await youtube.videos.list({
      id: [videoId],
      part: ["statistics"]
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
      },
      auth: process.env.GOOGLE_API_KEY
    });

    console.log("response from google API", response);

    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

export default job;
