/** Trend pazarları: sunucuya özgü bağımlılık içermez, istemci bileşenleri de içe aktarabilir. */
export type TrendRegion = 'tr' | 'us' | 'de' | 'gb' | 'sa' | 'eg' | 'ma' | 'mx' | 'es' | 'co';
export const TREND_REGIONS: TrendRegion[] = ['tr', 'us', 'de', 'gb', 'sa', 'eg', 'ma', 'mx', 'es', 'co'];
/** Arapça sitede gösterilen pazarlar: Suudi Arabistan (Körfez), Mısır, Fas (Mağrip). */
export const AR_TREND_REGIONS: TrendRegion[] = ['sa', 'eg', 'ma'];
/** İspanyolca sitede gösterilen pazarlar: Meksika, İspanya, Kolombiya. */
export const ES_TREND_REGIONS: TrendRegion[] = ['mx', 'es', 'co'];
