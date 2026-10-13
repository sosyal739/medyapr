import { NextResponse } from 'next/server';
import { parseYouTubeId } from '@/lib/pricing';
import { getVideoInfo } from '@/lib/youtube';
import { clientIp, rateLimit } from '@/lib/rate-limit';

/** GET /api/video?url=<YouTube linki> → video önizlemesi (başlık, kanal, kapak, varsa istatistikler). */
export async function GET(req: Request) {
  if (!rateLimit(`video:${clientIp(req)}`, 40)) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429, headers: { 'Retry-After': '600' } });
  }
  const url = new URL(req.url).searchParams.get('url') ?? '';
  const id = parseYouTubeId(url);
  if (!id) return NextResponse.json({ error: 'invalid_url' }, { status: 422 });

  const info = await getVideoInfo(id);
  if (info === null) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  if (info === undefined) return NextResponse.json({ error: 'unavailable', id }, { status: 503 });
  return NextResponse.json(info);
}
