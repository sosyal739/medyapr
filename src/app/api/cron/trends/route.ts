import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

export const dynamic = 'force-dynamic';

/**
 * Günlük cron: trend listesinin önbelleğini tazeler.
 * Veri, YOUTUBE_API_KEY tanımlıysa bir sonraki ziyarette YouTube Data API'den yeniden çekilir.
 * Rakamlar burada ASLA değiştirilmez veya tahmin edilmez.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  revalidateTag('trends', 'max');
  revalidatePath('/[locale]/trendler', 'page');
  revalidatePath('/[locale]', 'page');

  return NextResponse.json({
    success: true,
    live: Boolean(process.env.YOUTUBE_API_KEY),
    revalidated_at: new Date().toISOString(),
  });
}
