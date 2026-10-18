/** Trend pazarları: sunucuya özgü bağımlılık içermez, istemci bileşenleri de içe aktarabilir. */
export type TrendRegion = 'tr' | 'us' | 'de' | 'gb' | 'sa' | 'eg' | 'ma';
export const TREND_REGIONS: TrendRegion[] = ['tr', 'us', 'de', 'gb', 'sa', 'eg', 'ma'];
/** Arapça sitede gösterilen pazarlar: Suudi Arabistan (Körfez), Mısır, Fas (Mağrip). */
export const AR_TREND_REGIONS: TrendRegion[] = ['sa', 'eg', 'ma'];
