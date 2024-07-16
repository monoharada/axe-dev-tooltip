# axe-dev-tooltip

![a11y error elements with tooltips on hover](https://github.com/monoharada/axe-dev-tooltip/raw/main/public/SCR-20240707-denf.webp)

This plugin inserts the Axe accessibility testing script into your HTML files, configured for a specified locale. It supports both Vite and Next.js.

When the plugin detects an issue with `axe-core`, an accessibility check button will appear at the bottom right of the screen. Clicking the check button will highlight the affected elements with a dashed outline. Hovering over these elements will display a tooltip explaining the issue.

## Installation

First, install the necessary devDependencies:

```bash
npm install axe-core axe-dev-tooltip --save-dev
```

## Configuration

### vite

Create a `vite.config.ts` file and configure the plugin:

```typescript
// vite.config.ts

import { defineConfig } from "vite";
import { InsertAxeScriptVite } from "axe-dev-tooltip";
export default defineConfig({
  plugins: [InsertAxeScriptVite({locale:'ja'})], // Specify the locale here
});
```

### Next.js

To configure the plugin for Next.js, modify your `_document.js` file as follows:

```javascript
// _document.js
import Document, { Html, Head, Main, NextScript } from "next/document";
import { InsertAxeScriptNextJs } from "axe-dev-tooltip";
class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head />
        <body>
          <Main />
          <NextScript />
          {process.env.NODE_ENV === 'development' && (
            <div
              id="axe-script"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{ __html: InsertAxeScriptNextJs({locale:'ja'}) }}
            />
          )}
        </body>
      </Html>
    );
  }
}
export default MyDocument;

```

## Supported Locales

The following locales are supported:

- "en" (English)
- "da" (Danish)
- "de" (German)
- "el" (Greek)
- "es" (Spanish)
- "eu" (Basque)
- "fr" (French)
- "he" (Hebrew)
- "it" (Italian)
- "ja" (Japanese)
- "ko" (Korean)
- "nl" (Dutch)
- "no_NB" (Norwegian Bokmål)
- "pl" (Polish)
- "pt_BR" (Portuguese, Brazil)
- "zh_CN" (Chinese, Simplified)
- "zh_TW" (Chinese, Traditional)

## License

MIT
