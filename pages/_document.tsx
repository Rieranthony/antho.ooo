import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap"
            rel="stylesheet"
          />
          <meta name="author" content="Anthony Riera" />
          <meta
            name="description"
            content="Software engineer really interested in web3, great designs and good UX. I make youtube videos about how I approach software development, side project stories, and everything in between."
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
