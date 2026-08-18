import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const cssFiles = [
  'css/base.css',
  'css/layout.css',
  'css/components.css',
  'css/pages.css',
  'css/tarjetas.css',
  'css/features-stats.css',
  'css/formulario.css',
  'css/responsive.css'
];

let bundledCss = '/* Airport Studio Bundled CSS */\n';

for (const file of cssFiles) {
  const filePath = path.join(rootDir, file);
  if (fs.existsSync(filePath)) {
    bundledCss += `\n/* --- ${file} --- */\n` + fs.readFileSync(filePath, 'utf8') + '\n';
  }
}

// Simple minification
const minified = bundledCss
  .replace(/\/\*[\s\S]*?\*\//g, '') // remove comments
  .replace(/\s+/g, ' ')             // collapse whitespace
  .replace(/\s*([\{\}\:\;\,])\s*/g, '$1') // remove spaces around punctuation
  .replace(/;\}/g, '}')             // remove trailing semicolons
  .trim();

fs.writeFileSync(path.join(rootDir, 'css/bundle.css'), minified, 'utf8');
console.log(`Bundle created: css/bundle.css (${(minified.length / 1024).toFixed(2)} KB)`);
