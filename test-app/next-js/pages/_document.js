import Document, { Html, Head, Main, NextScript } from "next/document";

import { InsertAxeScriptNextJs } from "axe-dev-tooltip";

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
