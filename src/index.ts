import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

type Locale =
  | 'en'
  | 'da'
  | 'de'
  | 'el'
  | 'es'
  | 'eu'
  | 'fr'
  | 'he'
  | 'it'
  | 'ja'
  | 'ko'
  | 'nl'
  | 'no_NB'
  | 'pl'
  | 'pt_BR'
  | 'zh_CN'
  | 'zh_TW';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const axeMinJsPath = path.resolve(__dirname, '../../axe-core/axe.min.js');
const axeMinJsContent = fs.readFileSync(axeMinJsPath, 'utf-8');

const styles = `[data-violation-help],[data-violation-description],[data-violation-failure-summary] {
  outline: 2px dashed tomato;
  outline-offset: 4px;
  cursor: help;

  &:where(:hover, :focus) {
    outline: 4px solid red;
    outline-offset: 6px;
  }

  &:is(html) {
    outline-offset: -2px;
  }
  &[data-is-empty='true'] {
   min-width: 46px;
   min-height: 46px;
  }
}`;

function getAxeScript(locale: Locale) {
  const localeFileName = locale === 'en' ? '_template.json' : `${locale}.json`;
  const localePath = path.resolve(__dirname, '../../axe-core/locales', localeFileName);
  const axeLocale = JSON.parse(fs.readFileSync(localePath, 'utf-8'));
  return fs
    .readFileSync(path.resolve(__dirname, 'browser.js'), 'utf-8')
    .replace('AXE_LOCALE', JSON.stringify(axeLocale));
}

export const InsertAxeScriptVite = (props: { locale: Locale }) => {
  const { locale = 'en' } = props;
  const axeScript = getAxeScript(locale);
  return {
    name: 'insert-axe-script', // プラグイン名
    transformIndexHtml(html: string) {
      return html.replace(
        '</head>',
        `
        <script src="${axeMinJsPath}" defer></script>
        <script type="module">${axeScript}</script>
      <style>
      ${styles}
      </style>
      </head>`,
      );
    },
  };
};

export const InsertAxeScriptNextJs = (props: { locale: Locale }) => {
  const { locale = 'en' } = props;
  const axeScript = getAxeScript(locale);
  return `
    <script type="module">${axeMinJsContent}</script>
    <script type="module">${axeScript}</script>
    <style>
      ${styles}
      </style>
  `;
};
