/** Bellek içi kayan pencere limiti (IP başına). Sunucusuz ortamda instance başına çalışır; spam için yeterli ilk savunma. */
const hits = new Map<string, { count: number; start: number }>();

export function rateLimit(key: string, max = 5, windowMs = 10 * 60 * 1000): boolean {
  const now = Date.now();
  if (hits.size > 2000) {
    for (const [k, v] of hits) if (now - v.start > windowMs) hits.delete(k);
  }
  const rec = hits.get(key);
  if (!rec || now - rec.start > windowMs) {
    hits.set(key, { count: 1, start: now });
    return true;
  }
  if (rec.count >= max) return false;
  rec.count += 1;
  return true;
}

export function clientIp(req: Request): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    req.headers.get('cf-connecting-ip') ||
    '127.0.0.1'
  );
}

/** Tarayıcı kaynaklı istekler yalnızca kendi alan adımızdan kabul edilir. */
export function isAllowedOrigin(req: Request): boolean {
  const origin = req.headers.get('origin') || req.headers.get('referer') || '';
  if (!origin) return true;
  return ['medyapr.com', 'localhost', '127.0.0.1'].some((h) => origin.includes(h));
}
