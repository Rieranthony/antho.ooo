import { ImageResponse } from "@vercel/og";

export const config = {
  runtime: "experimental-edge"
};

// Make sure the font exists in the specified path:
const fontBold = fetch(
  new URL("../../assets/JetBrainsMono-Bold.ttf", import.meta.url)
).then((res) => res.arrayBuffer());
const fontRegular = fetch(
  new URL("../../assets/JetBrainsMono-Regular.ttf", import.meta.url)
).then((res) => res.arrayBuffer());

const thumbnail = async function (req: any) {
  const [fontBoldData, fontRegularData] = await Promise.all([
    fontBold,
    fontRegular
  ]);

  try {
    const { searchParams } = new URL(req.url);

    const viewsParams = searchParams.get("views") ?? "0";

    const views: number = parseInt(viewsParams);

    // Format number properly
    const formattedViews = `${views.toLocaleString("en-US")}`;

    const fontSize = views < 999999 ? 280 : 235;
    const marginTop = views < 999999 ? -70 : -40;

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "#fff",
            color: "#fff",
            fontWeight: 800
          }}
        >
          <img
            width="1280"
            height="720"
            style={{
              objectFit: "cover",
              position: "absolute",
              width: "100%",
              height: "100%"
            }}
            alt="thumbnail"
            src={`https://www.antho.ooo/thumbnail_base.jpg`}
          />
          <div style={{ marginTop, fontSize }}>{formattedViews}</div>
          <div style={{ marginTop, fontSize: 100 }}>ish</div>
        </div>
      ),
      {
        width: 1280,
        height: 720,
        fonts: [
          {
            name: "JetBrainMono",
            data: fontBoldData,
            style: "normal",
            weight: 700
          },
          {
            name: "JetBrainMono",
            data: fontRegularData,
            style: "normal",
            weight: 400
          }
        ]
      }
    );
  } catch (e: any) {
    console.error(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500
    });
  }
};

export default thumbnail;
