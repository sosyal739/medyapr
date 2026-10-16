/**
 * İngilizce'ye özel (enOnly) küresel YouTube müzik trendi yazılarını data/posts.json'a ekler.
 * Tablolar data/trending_songs.json anlık görüntüsünden üretilir; metindeki sayılar o görüntüye göre yazıldı
 * (13 Ekim 2026). Tekrar çalıştırmak aynı slug'ları günceller, çift kayıt oluşturmaz.
 *
 * Kullanım: node scripts/add_global_chart_posts.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const postsFile = path.join(ROOT, 'data', 'posts.json');
const trends = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'trending_songs.json'), 'utf8'));
const raw = fs.readFileSync(postsFile, 'utf8');
const crlf = raw.includes('\r\n');
const posts = JSON.parse(raw);

const asOf = new Date(trends.updatedAt);
const DATE_TR = '13 Ekim 2026'; // sitemap/şema ayrıştırıcıları Türkçe ay adı bekler; EN sayfada biçimlenerek gösterilir
const ageDays = (s) => Math.round((asOf - new Date(s.publishedAt)) / 864e5);
const m = (n) => `${(n / 1e6).toFixed(2)}M`;
const clean = (t) => t.replace(/\s*\[.*?\]|\s*\(Official.*?\)|\s*\| .*$/gi, '').trim().slice(0, 60);

function chartTable(list, caption) {
  return {
    caption,
    headers: ['Rank', 'Artist', 'Video', 'Views', 'Age'],
    rows: list.slice(0, 10).map((s) => [`#${s.rank}`, s.artist, clean(s.title), m(s.views), `${ageDays(s)} days`]),
  };
}

const NOTE =
  'Data note: the figures below come from a snapshot of YouTube\'s most-popular music chart taken on 13 October 2026. Rankings and view counts change daily, so treat this as a dated reading, not a permanent ranking.';
const CTA =
  'If you are an artist planning a release, the practical question is where your first week of views will come from. [Our pricing page](/fiyatlandirma) shows what an official Google Ads video campaign costs by country, and [a free video review](/order) tells you whether your video is a fit before you spend anything.';

// Blog oluşturucusu yalnızca '### ' başlık ve [metin](bağ) biçimlerini destekler; kalın ve madde işaretlerini sadeleştir.
const plain = (p) => p.replace(/^## /, '### ').split('**').join('').replace(/^- /, '');

const make = (o0) => {
  const o = { ...o0, paragraphs: o0.paragraphs.map(plain) };
  return build(o);
};

const build = (o) => ({
  author: 'MedyaPR',
  authorRole: 'Music Chart Analysis',
  authorRole_en: 'Music Chart Analysis',
  category: 'Şarkı & Klip Analizleri',
  category_en: 'Song & Video Breakdowns',
  date: DATE_TR,
  enOnly: true,
  ...o,
  title_en: o.title,
  summary_en: o.summary,
  readTime_en: o.readTime,
  quickFact_en: o.quickFact,
  paragraphs_en: o.paragraphs,
  faqs_en: o.faqs,
  tags_en: o.tags,
  table_en: o.table,
});

const de = trends.de;
const us = trends.us;
const gb = trends.gb;

const out = [
  make({
    slug: 'youtube-music-chart-germany-october-2026-turkish-artists',
    title: 'Germany\'s YouTube Music Chart: Three Turkish Acts in the Top 20 (October 2026)',
    summary: 'Manifest is #2, Zeynep Bastık #6 and Eypio #17 on YouTube Germany\'s music chart. What a multi-language diaspora chart means for artists planning a German release.',
    readTime: '5 min',
    videoId: de.find((s) => /manifest/i.test(s.artist))?.videoId,
    image: de.find((s) => /manifest/i.test(s.artist))?.thumbnail,
    tags: ['youtube germany music chart', 'turkish artists germany', 'diaspora music marketing', 'youtube trends october 2026'],
    quickFact: 'On 13 October 2026, three Turkish acts sat in YouTube Germany\'s music chart top 20: Manifest (#2, 18.15M views), Zeynep Bastık (#6, 4.70M) and Eypio (#17, 6.11M).',
    table: chartTable(de, 'YouTube Germany music chart, top 10 (snapshot 13 Oct 2026)'),
    paragraphs: [
      NOTE,
      '## What the chart shows',
      'The German chart is not a German-language chart. In the top 20 on 13 October 2026, at least six entries are German-language (Kerstin Ott & Maite Kelly at #1, Sido x Montez, LX with Bonez MC, Gzuz & Caney030, Gangsta Ralph, Samy Deluxe and NGEE). Around them sit Turkish, Albanian, Serbian, Romanian, Arabic and Italian-titled releases.',
      'Three of those are Turkish: **Manifest** with "TRALALA" at #2 (18.15M views, published four days earlier), **Zeynep Bastık** with "INAT" featuring Dhurata Dora at #6 (4.70M views, eleven days old) and **Eypio** with "Şahidim" at #17 (6.11M views, ten days old). "TRALALA" also appears at #9 on the UK chart the same day.',
      '## Why this matters for artists',
      'Germany has a large Turkish-speaking community, and these results are consistent with diaspora audiences watching releases from Türkiye within days of publication. The chart itself cannot tell us who the viewers are, so treat that as a likely explanation, not a measured fact.',
      'One more detail worth noticing: the #1 video has 0.66M views while a Taylor Swift video at #18 has 18.96M. The chart clearly rewards recent momentum rather than total views, which means a video can chart in the first week with far fewer views than an established hit, provided those views arrive quickly.',
      '## What to take from it',
      '- **A release does not need a German-language hook to chart in Germany.** Turkish-language videos are doing it.',
      '- **The first week decides the chart.** Nine of the top ten were published within the previous eleven days; the one exception is a 16-day-old release at #9.',
      '- **Diaspora targeting is a real lever.** In a Google Ads video campaign you can target by country and language, so a Turkish-language video can be shown to Turkish speakers in Germany specifically.',
      CTA,
    ],
    faqs: [
      { question: 'Which Turkish artists are on YouTube Germany\'s chart?', answer: 'On 13 October 2026: Manifest (#2), Zeynep Bastık (#6) and Eypio (#17). The chart changes daily.' },
      { question: 'Does a video need German lyrics to chart in Germany?', answer: 'No. The same top 20 includes Turkish, Albanian, Serbian, Romanian and Arabic-language videos alongside German ones.' },
      { question: 'Can ads help a video reach a specific country?', answer: 'Yes. Google Ads video campaigns can target by country and language. Results are not guaranteed and depend on the video and the audience.' },
    ],
  }),
  make({
    slug: 'youtube-music-chart-usa-october-2026-latin-and-hip-hop',
    title: 'YouTube USA Music Chart (October 2026): Latin Releases Take Six of the Top Ten',
    summary: 'Six of the top ten on the US YouTube music chart are Latin releases, and seven of ten were published within a week. A dated look at what is charting and why recency matters.',
    readTime: '5 min',
    videoId: us[0]?.videoId,
    image: us[0]?.thumbnail,
    tags: ['youtube usa music chart', 'latin music youtube', 'hip hop youtube trends', 'youtube trends october 2026'],
    quickFact: 'On 13 October 2026, six of the top ten videos on the YouTube USA music chart were Latin releases, and seven of the ten had been published within the previous seven days.',
    table: chartTable(us, 'YouTube USA music chart, top 10 (snapshot 13 Oct 2026)'),
    paragraphs: [
      NOTE,
      '## The top ten at a glance',
      'Bulin 47 and Kevin Wai\'s "Dame Hombro" is #1 (6.52M views, four days old). Taylor Swift\'s "Patient Zero" is #2 with 18.96M views, the most of any entry in the top ten and also one of the oldest at 13 days. Anuel AA\'s "Vuelve" is #5 (8.97M, three days old) and Romeo Santos, Prince Royce and Dalvin La Melodia\'s "Menor" is #8 (11.01M, eleven days).',
      'Los Dos de Tamaulipas place three tracks in the top ten at once ("Paciencia" #4, "5.0" #7 and "En Dios Confío" #9), all five days old. Megan Thee Stallion also has two entries (#3 and #6). Gunna\'s "pop it" rounds out the ten at #10.',
      '## Patterns worth noting',
      '- **Latin releases dominate.** Six of the ten are Latin releases (Bulin 47, Los Dos de Tamaulipas three times, Anuel AA, Romeo Santos).',
      '- **Recency wins.** Seven of the ten were published within the previous seven days; only two are older than eleven days.',
      '- **One act, several entries.** Los Dos de Tamaulipas and Megan Thee Stallion each hold multiple slots, which suggests that releasing several videos in the same window can compound on the chart.',
      '- **Engagement varies widely.** Megan Thee Stallion\'s freestyle videos show like-to-view ratios of about 7.2% and 5.4%, while Romeo Santos\' "Menor" sits near 1.0%. A high view count does not imply high engagement.',
      '## What this means if you release in the US',
      'The US chart is crowded with established names, but its composition shows that language-specific audiences can carry a video to the top. A Spanish-language release is not a niche on this chart, it is the majority of the top ten that week.',
      CTA,
    ],
    faqs: [
      { question: 'Is the YouTube USA chart based on total views?', answer: 'The 13 October 2026 snapshot suggests it favours recent momentum: a Taylor Swift video with 18.96M views is #2 while a video with 0.72M views ranks #4. YouTube does not publish the full formula.' },
      { question: 'How many Latin releases were in the US top ten?', answer: 'Six of ten on 13 October 2026.' },
      { question: 'Can an independent artist reach this chart?', answer: 'Charting depends on fast early viewership. Targeted video ads can help a video reach the right audience early, but they do not guarantee a chart position.' },
    ],
  }),
  make({
    slug: 'youtube-music-chart-uk-october-2026-diaspora-sounds',
    title: 'YouTube UK Music Chart (October 2026): Punjabi, Afrobeats, Romanian and UK Rap Together',
    summary: 'The UK YouTube music chart is a mix of Punjabi, Afrobeats, Romanian, UK rap and Turkish pop. A dated look at how diaspora audiences shape what charts in Britain.',
    readTime: '5 min',
    videoId: gb.find((s) => /manifest/i.test(s.artist))?.videoId,
    image: gb.find((s) => /manifest/i.test(s.artist))?.thumbnail,
    tags: ['youtube uk music chart', 'punjabi music youtube', 'afrobeats youtube', 'diaspora music marketing'],
    quickFact: 'The 13 October 2026 YouTube UK music chart top 20 includes Punjabi artists (Sidhu Moose Wala #4, Arjan Dhillon #11, Karan Aujla #14), Afrobeats (Ayra Starr and ZAYN #5), Romanian releases (#2, #18, #19, #20), UK rap and Turkish pop (Manifest #9).',
    table: chartTable(gb, 'YouTube UK music chart, top 10 (snapshot 13 Oct 2026)'),
    paragraphs: [
      NOTE,
      '## A chart built from many audiences',
      'The top 20 on 13 October 2026 does not read like a single national taste. Punjabi-language videos take three slots: Sidhu Moose Wala\'s "295" at #4 (15.01M views, three days old), Arjan Dhillon\'s "Said & Done" at #11 and Karan Aujla\'s "Ashke" at #14, which has 29.77M views, the most of any entry in the top 20.',
      'Afrobeats appears with Ayra Starr and ZAYN\'s "Heaven Baby" at #5 (8.76M views). Four Romanian-language releases sit at #2, #18, #19 and #20. UK rap is present with Digga, Headie One, Bugzy Malone, Chase & Status with Little Simz, and French Montana with D-Block Europe. Manifest\'s "TRALALA" is #9 (18.15M views, four days old).',
      '## What the chart does and does not tell us',
      'A chart like this shows what is being watched, not who is watching. The pattern is consistent with large, engaged diaspora communities, but the data does not identify viewers, so that remains an interpretation.',
      'It does show something measurable: a video with 0.06M views (Digga, #8) charts in the top ten alongside videos with 15M to 18M views. Early momentum, not total reach, is what places a video.',
      '## Takeaways for artists',
      '- **Niche audiences chart.** Punjabi, Romanian and Turkish-language videos are in the top 20 of a UK chart.',
      '- **Language targeting matters.** Video ads can be targeted by language and country, which lets a release reach a diaspora audience directly instead of relying on search.',
      '- **Plan the first week.** Nine of the top ten were published within the previous eleven days; the exception is Taylor Swift\'s 13-day-old video.',
      CTA,
    ],
    faqs: [
      { question: 'Which genres appear on the YouTube UK music chart?', answer: 'On 13 October 2026: Punjabi music, Afrobeats, Romanian-language pop and manele, UK rap and drill, pop and Turkish pop.' },
      { question: 'Can a Turkish-language video chart in the UK?', answer: 'Yes. Manifest\'s "TRALALA" was #9 on the YouTube UK chart on 13 October 2026.' },
      { question: 'Does a high-view video always rank higher?', answer: 'No. A video with 0.06M views ranked #8 while one with 29.77M views ranked #14, so the chart appears to weigh recent momentum.' },
    ],
  }),
];

for (const p of out) {
  const i = posts.findIndex((x) => x.slug === p.slug);
  if (i >= 0) posts[i] = p; else posts.unshift(p); // en başa: EN ana sayfa ve listede ilk görünür
}

let json = JSON.stringify(posts, null, 2);
if (crlf) json = json.replace(/\n/g, '\r\n');
fs.writeFileSync(postsFile, json);
console.log('yazıldı:', out.map((p) => p.slug).join(', '));
