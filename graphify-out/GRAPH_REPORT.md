# Graph Report - medyapr  (2026-10-15)

## Corpus Check
- 105 files · ~392,109 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 1, .ico 1, .css 1)

## Summary
- 517 nodes · 1167 edges · 18 communities (13 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1cceeb03`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- OrderWizard.tsx
- lucide-react
- getPageAlternates
- store.ts
- json
- package.json
- youtube.ts
- [locale]/page.tsx
- next
- POST
- generate-light-theme.js
- compilerOptions
- README.md
- AGENTS.md
- postcss.config.mjs
- vercel.json

## God Nodes (most connected - your core abstractions)
1. `next` - 50 edges
2. `lucide-react` - 38 edges
3. `getPageAlternates()` - 37 edges
4. `Dictionary` - 27 edges
5. `OrderWizard()` - 21 edges
6. `react` - 18 edges
7. `quote` - 16 edges
8. `compilerOptions` - 16 edges
9. `HomePage()` - 15 edges
10. `formatMoney()` - 15 edges

## Surprising Connections (you probably didn't know these)
- `generateMetadata()` --calls--> `getPageAlternates()`  [EXTRACTED]
  medyapr/src/app/[locale]/fiyatlandirma/page.tsx → medyapr/src/lib/seo.ts
- `generateMetadata()` --calls--> `getPageAlternates()`  [EXTRACTED]
  medyapr/src/app/[locale]/hakkimizda/page.tsx → medyapr/src/lib/seo.ts
- `generateMetadata()` --calls--> `getPageAlternates()`  [EXTRACTED]
  medyapr/src/app/[locale]/hizmetler/page.tsx → medyapr/src/lib/seo.ts
- `generateMetadata()` --calls--> `getPageAlternates()`  [EXTRACTED]
  medyapr/src/app/[locale]/sss/page.tsx → medyapr/src/lib/seo.ts
- `generateMetadata()` --calls--> `getPageAlternates()`  [EXTRACTED]
  medyapr/src/app/[locale]/trendler/page.tsx → medyapr/src/lib/seo.ts

## Import Cycles
- None detected.

## Communities (18 total, 5 thin omitted)

### Community 0 - "OrderWizard.tsx"
Cohesion: 0.06
Nodes (71): OrderPage(), Props, Calculator(), fromSlider(), PRESETS, toSlider(), useAnimatedNumber(), Props (+63 more)

### Community 1 - "lucide-react"
Cohesion: 0.05
Nodes (51): lucide-react, react, generateMetadata(), PricingPage(), Props, AboutPage(), generateMetadata(), Props (+43 more)

### Community 2 - "getPageAlternates"
Cohesion: 0.06
Nodes (55): BlogIndexPage(), CATEGORIES, generateMetadata(), BlogPostPage(), generateMetadata(), generateStaticParams(), parseParagraphWithLinks(), Props (+47 more)

### Community 3 - "store.ts"
Cohesion: 0.08
Nodes (35): PATCH(), STATUSES, GET(), GET(), AdminPage(), metadata, dynamic, Props (+27 more)

### Community 4 - "json"
Cohesion: 0.11
Nodes (15): load_posts(), main(), save_posts(), add_release(), extract_video_id(), fetch_rss_feed(), load_releases(), save_releases() (+7 more)

### Community 5 - "package.json"
Cohesion: 0.05
Nodes (36): eslintConfig, dependencies, lucide-react, next, nodemailer, react, react-dom, resend (+28 more)

### Community 6 - "youtube.ts"
Cohesion: 0.11
Nodes (27): generateMetadata(), revalidate, TrendlerPage(), TrendingMusicSectionProps, GlobalTrendsConversionBanner(), COUNTRIES, GENRE_FILTERS, GENRE_LABELS (+19 more)

### Community 7 - "[locale]/page.tsx"
Cohesion: 0.13
Nodes (22): HomePage(), Props, FAQPage(), generateMetadata(), Props, ArtistTestimonial, ArtistTestimonialsMarquee(), ArtistTestimonialsMarqueeProps (+14 more)

### Community 8 - "next"
Cohesion: 0.12
Nodes (8): nextConfig, securityHeaders, next, dynamic, metadata, Props, TrackLookupPage(), LookupForm()

### Community 9 - "POST"
Cohesion: 0.22
Nodes (16): nodemailer, resend, clean(), POST(), POST(), GET(), escapeHtml(), Notification (+8 more)

### Community 10 - "generate-light-theme.js"
Cohesion: 0.11
Nodes (18): a, b, crlf, css, ex(), fs, hues, islands (+10 more)

### Community 11 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 12 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

## Knowledge Gaps
- **8 isolated node(s):** `react-dom`, `@tailwindcss/postcss`, `@types/node`, `@types/nodemailer`, `@types/react` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 192 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `OrderWizard.tsx`, `lucide-react`, `getPageAlternates`, `store.ts`, `package.json`, `youtube.ts`, `[locale]/page.tsx`, `POST`?**
  _High betweenness centrality (0.286) - this node is a cross-community bridge._
- **What connects `react-dom`, `@tailwindcss/postcss`, `@types/node` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `OrderWizard.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05854341736694678 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `lucide-react` to `OrderWizard.tsx`, `getPageAlternates`, `store.ts`, `package.json`, `youtube.ts`, `[locale]/page.tsx`, `next`?**
  _High betweenness centrality (0.104) - this node is a cross-community bridge._
- **Should `lucide-react` be split into smaller, more focused modules?**
  _Cohesion score 0.050949367088607596 - nodes in this community are weakly interconnected._
- **Why does `react` connect `lucide-react` to `OrderWizard.tsx`, `getPageAlternates`, `store.ts`, `package.json`, `youtube.ts`, `[locale]/page.tsx`, `next`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Should `getPageAlternates` be split into smaller, more focused modules?**
  _Cohesion score 0.055087719298245616 - nodes in this community are weakly interconnected._