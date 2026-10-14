// Gündüz modu CSS'ini Tailwind paletinden üretir ve globals.css'teki eski bloğun yerine koyar.
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const theme = fs.readFileSync(ROOT + '/node_modules/tailwindcss/theme.css', 'utf8');
const SHADES = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];
const pal = {};
for (const m of theme.matchAll(/--color-([a-z]+)-(\d+):\s*([^;]+);/g)) {
  (pal[m[1]] ||= {})[m[2]] = m[3].trim();
}
const hues = Object.keys(pal).filter((h) => SHADES.every((s) => pal[h][s]));

// Gündüz: ton ölçeği aynalanır (50<->950, 100<->900 ...); 500 yerinde kalır.
const lightVars = [];
const origVars = ['  --color-white: #fff;'];
for (const h of hues) {
  SHADES.forEach((s, i) => {
    const MAP = { '50': '950', '100': '900', '200': '800', '300': '700', '400': '600', '500': '500', '600': '600', '700': '700', '800': '200', '900': '100', '950': '50' }; // gray yalnızca eski açık temalı bileşenlerde (bg-gray-50, border-gray-100) kullanılıyor: sadece 300-400 aynalanır.
    if (h === 'gray' && !['300', '400'].includes(s)) return;
    if (MAP[s] !== s) lightVars.push(`  --color-${h}-${s}: ${pal[h][MAP[s]]};`);
    origVars.push(`  --color-${h}-${s}: ${pal[h][s]};`);
  });
}

// Token başı eşleşmesi: "hover:bg-x" veya "selection:bg-x" gibi varyantları yakalamaz.
const tok = (t) => `[class^='${t}'], [class*=' ${t}']`;
const ex = (t) => ['', '/90', '/95'].map((o) => `[class~='${t}${o}']`).join(', ');
const SAT = ['red', 'rose', 'emerald', 'green', 'sky', 'blue', 'indigo', 'violet', 'purple', 'amber', 'orange', 'teal', 'cyan', 'pink'];
const satIslands = SAT.flatMap((h) => ['500', '600', '700'].flatMap((n) => [ex('bg-' + h + '-' + n), ex('from-' + h + '-' + n)]));
const islands = [
  ...satIslands,
  '.tab-pill-active', '.keep-dark',
  ex('bg-[#D9002B]'), ex('bg-[#E6002E]'), ex('bg-[#25D366]'), ex('bg-[#FF0033]'),
  ex('from-[#E0002E]'), ex('from-[#FF0033]'), ex('from-[#D9002B]'),
    ex('bg-slate-950'), ex('bg-slate-900'),
  tok('bg-black'), tok('from-black'),
  tok('from-[#1A1A2E]'), tok('from-[#1A0B14]'), tok('from-[#1F0E13]'),
  "[class*='absolute'][class*='top-3']",
];

const block = `/* ===== Gündüz Modu: buzlu beyaz-gri =====
   Tailwind v4 renkleri CSS değişkenidir. Gündüz modunda her renk tonu aynalanır
   (ör. zinc-900 <-> zinc-100, emerald-300 <-> emerald-700), text-white koyu lacivert olur.
   Böylece koyu tasarım için yazılmış sınıflar elle değiştirilmeden okunur kalır.
   Bu blok scripts/generate-light-theme.js ile üretilir; elle düzenleme yerine betiği güncelleyip çalıştırın. */
[data-theme='light'] {
  color-scheme: light;
  --bg-app: #EBEEF3;
  --bg-gradient-start: #F5F7FA;
  --bg-gradient-mid: #EDF0F5;
  --bg-gradient-end: #E4E8EF;
  --surface-card: rgba(255, 255, 255, 0.78);
  --surface-card-subtle: rgba(255, 255, 255, 0.6);
  --surface-card-hover: #FFFFFF;
  --surface-border: rgba(15, 23, 42, 0.1);
  --surface-border-strong: rgba(15, 23, 42, 0.2);
  --header-bg: rgba(245, 247, 250, 0.85);
  --tab-dock-bg: rgba(255, 255, 255, 0.75);
  --text-main: #0F172A;
  --text-body: #334155;
  --text-muted: #64748B;
  --ambient-red-opacity: 0.08;
  --ambient-blur-opacity: 0.06;
  --color-white: #0F172A;
${lightVars.join('\n')}
}

/* Gündüz modunda koyu kalan "adalar": kırmızı/yeşil düğmeler, video oynatıcı, görsel üstü etiketler.
   İçlerindeki renkler orijinal (gece) değerlerine döner. */
[data-theme='light'] :is(
  ${islands.join(',\n  ')}
) {
${origVars.join('\n')}
}

/* Sabit koyu hex ile yazılmış kart zeminleri gündüz modunda buzlu beyaz olur */
[data-theme='light'] :is(${tok('bg-[#12141A]')}, ${tok('bg-[#16191E]')}, ${tok('bg-[#1A1E26]')}, ${tok('bg-[#1A1A2E]')}) {
  background-color: rgba(255, 255, 255, 0.78);
}
[data-theme='light'] :is(${tok('from-[#14161A]')}, ${tok('from-[#181B22]')}, ${tok('from-[#1C2029]')}) {
  --tw-gradient-from: rgba(255, 255, 255, 0.92);
}
[data-theme='light'] :is(${tok('via-[#15171D]')}, ${tok('via-[#16213E]')}, ${tok('via-[#161224]')}):not([class*='from-[#1A1A2E]'], [class*='from-[#1A0B14]'], [class*='from-[#1F0E13]'], [class*='from-black']) {
  --tw-gradient-via: rgba(248, 250, 252, 0.9);
}
[data-theme='light'] :is(${tok('to-[#111317]')}, ${tok('to-[#14161C]')}, ${tok('to-[#1A1A2E]')}, ${tok('to-[#0E0E1B]')}, ${tok('to-[#2B1017]')}):not([class*='from-[#1A1A2E]'], [class*='from-[#1A0B14]'], [class*='from-[#1F0E13]'], [class*='from-black']) {
  --tw-gradient-to: rgba(236, 240, 245, 0.92);
}

/* Buzlu cam yüzeyler ve yumuşak gölgeler */
[data-theme='light'] :is(.bg-studio-card, [class*='backdrop-blur']) {
  -webkit-backdrop-filter: blur(16px) saturate(1.5);
  backdrop-filter: blur(16px) saturate(1.5);
}
[data-theme='light'] :is([class*='rounded-2xl'], [class*='rounded-3xl'])[class*='border'] {
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04), 0 8px 24px -12px rgba(15, 23, 42, 0.12);
}
[data-theme='light'] body {
  background-image: radial-gradient(1200px 600px at 10% -10%, #FFFFFF 0%, transparent 60%), radial-gradient(900px 500px at 100% 0%, rgba(255, 0, 51, 0.05), transparent 60%);
  background-attachment: fixed;
}
[data-theme='light'] :is(input, textarea, select) {
  background-color: rgba(255, 255, 255, 0.9);
  color: #0F172A;
}
/* Zaten açık renkle tasarlanmış (bg-white) kartlar gündüzde de beyaz kalır */
[data-theme='light'] :is([class~='bg-white'], [class~='bg-white/90'], [class~='bg-white/95']) {
  background-color: #FFFFFF;
}
/* Gece için açık tonda seçilmiş pembe/turuncu yazılar gündüzde koyulaşır */
[data-theme='light'] :is(${['FF6B6B', 'FF5E7E', 'FF4D6D', 'FF6B7A', 'FF8FA3'].map((c) => tok('text-[#' + c + ']')).join(', ')}) {
  color: #C8002A;
}
[data-theme='light'] :is(${tok('text-[#FF8E53]')}) {
  color: #C2410C;
}
[data-theme='light'] ::placeholder {
  color: #64748B;
}
[data-theme='light'] .theme-toggle {
  border-color: rgba(15, 23, 42, 0.15);
  background: rgba(255, 255, 255, 0.8);
}

`;

const cssPath = ROOT + '/src/app/globals.css';
const raw = fs.readFileSync(cssPath, 'utf8');
const crlf = raw.includes('\r\n');
let css = raw.replace(/\r\n/g, '\n');
const a = css.indexOf('/* ===== Gündüz Modu');
const b = css.indexOf('/* ===== Base Styles ===== */');
if (a < 0 || b < 0) throw new Error('markers');
css = css.slice(0, a) + block + css.slice(b);
fs.writeFileSync(cssPath, crlf ? css.replace(/\n/g, '\r\n') : css);
console.log('hues', hues.length, 'lightVars', lightVars.length);
