import Document, { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";
import { InsertAxeScriptNextJs } from "vite-plugin-axe";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head/>
        <body>
          <Main />
          <NextScript />
          {process.env.NODE_ENV === 'development' && (
            <div
              id="axe-script"
              strategy="afterInteractive"
              // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
              dangerouslySetInnerHTML={{ __html: InsertAxeScriptNextJs("ja") }}
            />
          )}
        </body>
      </Html>
    );
  }
}

export default MyDocument;
