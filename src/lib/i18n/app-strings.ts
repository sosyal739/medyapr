/** Sipariş / hesaplayıcı / takip / admin arayüz metinleri (TR + EN). */
import type { Locale } from './config';

const tr = {
  calc: {
    badge: 'Anlık fiyat',
    title: 'İzlenme sayını gir, tahmini teklifi anında gör',
    subtitle: 'Teklifinizi iletin, videonuzu analiz edip WhatsApp veya Telegram üzerinden detaylı dönüş yapalım. Onay alınca işlem başlar. Fiyatlandırma video uzunluğuna göre değişebilir.',
    views: 'İzlenme sayısı',
    format: 'Kampanya Türü',
    guaranteesTitle: '%100 Resmi Google Ads Güvencesi & Standartlar',
    guarantees: [
      {
        badge: 'Bot & Panel Yok',
        title: 'Bot veya Panel Kullanılmaz',
        desc: 'İzlenmeler doğrudan Google Ads üzerinden gelir, ömür boyu kalıcıdır.',
      },
      {
        badge: 'Studio Onaylı',
        title: 'YouTube Reklamcılığı Kaynağı',
        desc: 'YouTube Analytics\'te resmi reklam kaynağı olarak şeffafça görünür.',
      },
      {
        badge: 'Doğal Etkileşim',
        title: 'Beğeni, Yorum & Abonelik',
        desc: 'Gerçek izleyicilerden doğal beğeni, yorum ve kanal aboneliği fırsatı.',
      },
    ],
    region: 'Hedef bölge',
    currency: 'Para birimi',
    formats: {
      instream: { name: 'Resmi Video Reklamı', desc: 'In-Stream & Shorts otomatik optimize gösterim' },
      shorts: { name: 'Shorts Akışı', desc: 'Dikey kısa video akışında gösterim' },
      discovery: { name: 'Keşfet / Arama', desc: 'YouTube aramasında ve önerilenlerde görünürlük' },
    },
    regions: {
      tr: { name: 'Türkiye', desc: 'Sadece Türkçe konuşan kitle', tag: 'Standart' },
      global: { name: 'Global', desc: 'Tüm ülkeler karışık', tag: '1K: ₺100 🔥' },
      premium: { name: 'Ülke seç', desc: 'Listeden ülkenizi seçin', tag: '' },
    },
    total: 'Tahmini Teklif Tutarı',
    discount: 'Paket İndirimi',
    per1k: '1.000 izlenme maliyeti',
    eta: 'Tahmini teslimat',
    days: 'gün',
    cta: 'Teklifi İlet & Analiz İste',
    pkg: 'Paket Türü',
    packages: {
      views: { name: 'Sadece İzlenme', desc: 'Hedef kitleye resmi Google Ads video gösterimi', tag: 'Standart' },
      engagement: {
        name: 'Etkileşim Paketi',
        desc: 'İzlenme + beğeni, yorum ve paylaşım odaklı hedefleme ve kampanya kurgusu',
        tag: '+%30',
      },
    },
    engagementNote: 'Etkileşimler gerçek izleyicilerden gelir; beğeni/yorum sayısı garanti edilmez, bot kullanılmaz.',
    consult: 'WhatsApp ile Teklif İlet',
    consultMsg: 'Merhaba, YouTube video tanıtımı için teklif iletmek ve detaylı analiz almak istiyorum.',
    note: 'Her video; süresi, içeriği ve Google Ads reklam kriterleri açısından 18+ yıllık tecrübeli Google Partner uzmanlarımızca incelenir. Teklifinizi iletin, analiz edip WhatsApp veya Telegram üzerinden detaylı dönüş yapalım. Onay alınca işlem başlar. Fiyatlandırma video uzunluğuna göre değişebilir.',
    perks: [
      'Teklifi iletin, videonuzu analiz edip detaylı dönüş yapalım',
      'WhatsApp & Telegram üzerinden birebir uzman iletişimi',
      'Onay alınca işlem başlar',
      'Fiyatlandırma video uzunluğuna göre değişebilir • Sıfır bot',
    ],
  },
  order: {
    title: 'Teklifinizi iletin, analiz edip dönüş yapalım',
    subtitle: 'Video linkinizi ve iletişim bilginizi bırakın; uzmanlarımız videonuzu analiz edip WhatsApp veya Telegram üzerinden detaylı dönüş yapsın. Onay alınca işlem başlar.',
    summary: 'Teklif özeti',
    video: 'YouTube video linki',
    videoPh: 'https://www.youtube.com/watch?v=...',
    videoBad: 'Geçerli bir YouTube video linki gir (watch, youtu.be veya shorts).',
    videoOk: 'Video bulundu',
    name: 'Ad Soyad',
    email: 'E-posta',
    contact: 'WhatsApp veya Telegram (Analiz dönüşü için)',
    payment: 'Süreç & Onay Modeli',
    card: 'WhatsApp & Telegram Onaylı Süreç',
    cardDesc: 'Video analizi sonrası detaylı dönüş yapılır',
    iban: 'Onay Alınca İşlem Başlar',
    ibanDesc: 'Ödeme planı teklifte netleştirilir',
    terms: 'Hizmet şartlarını ve gizlilik politikasını okudum, kabul ediyorum.',
    submit: 'Teklifi İlet & Analiz İste',
    submitting: 'İletiliyor…',
    error: 'Teklif iletilemedi. Bilgileri kontrol edip tekrar deneyin.',
    edit: 'Değiştir',
  },
  track: {
    title: 'Kampanya & Analiz Takibi',
    code: 'Teklif / Sipariş kodu',
    lookupTitle: 'Talebinizi takip edin',
    lookupDesc: 'Teklif / sipariş kodunuzu girin (AV- ile başlar).',
    lookupBtn: 'Sorgula',
    notFound: 'Bu kodla kayıt bulunamadı.',
    delivered: 'Teslim edilen izlenme',
    target: 'Hedef',
    daily: 'Günlük izlenme',
    status: 'Durum',
    started: 'Talep tarihi',
    noData: 'Onay alınıp kampanya başlayınca günlük rakamlar burada görünür.',
    statuses: {
      pending_payment: 'Analiz & Onay Bekleniyor',
      payment_review: 'Google Ads Onay İncelemesinde',
      queued: 'Onaylandı — Kampanya Hazırlanıyor',
      running: 'Kampanya Yayında',
      completed: 'Tamamlandı',
      cancelled: 'İptal Edildi',
    },
    ibanTitle: 'Analiz & Onay Süreci',
    ibanBody: 'Teklifiniz ve video süreniz analiz edildikten sonra WhatsApp veya Telegram üzerinden detaylı dönüş yapılır; onay alınca işlem başlar.',
    cardBody: 'Tüm analiz ve kampanya onay adımları WhatsApp ve Telegram üzerinden uzman ekibimizle yürütülür.',
    copy: 'Kopyala',
    copied: 'Kopyalandı',
  },
};

type Strings = typeof tr;

const en: Strings = {
  calc: {
    badge: 'Instant quote',
    title: 'Enter your views, see your estimated quote',
    subtitle: 'Submit your quote request; we will analyze your video and reply in detail via WhatsApp or Telegram. Work begins upon approval. Pricing may vary based on video length.',
    views: 'Number of views',
    format: 'Campaign Type',
    guaranteesTitle: '100% Official Google Ads Guarantee & Standards',
    guarantees: [
      {
        badge: 'No Bots & Panels',
        title: 'Zero Bots or SMM Panels',
        desc: 'Views delivered exclusively through Google Ads, permanently retained.',
      },
      {
        badge: 'Studio Verified',
        title: 'YouTube Advertising Source',
        desc: 'Transparently tracked as "YouTube Advertising" in Studio analytics.',
      },
      {
        badge: 'Real Fans',
        title: 'Likes, Comments & Subscribers',
        desc: 'Creates real opportunities for organic likes, comments, and subscribers.',
      },
    ],
    region: 'Target region',
    currency: 'Currency',
    formats: {
      instream: { name: 'Official Video Ads', desc: 'In-Stream & Shorts auto-optimized delivery' },
      shorts: { name: 'Shorts Feed', desc: 'Placement in the vertical short-video feed' },
      discovery: { name: 'Discovery / In-Feed', desc: 'Visibility in YouTube search and recommendations' },
    },
    regions: {
      tr: { name: 'Turkey', desc: 'Turkish-speaking audience only', tag: 'Standard' },
      global: { name: 'Global', desc: 'All countries mixed', tag: 'Best price 🔥' },
      premium: { name: 'Pick a country', desc: 'Choose your country from the list', tag: '' },
    },
    total: 'Estimated Quote',
    discount: 'Package Discount',
    per1k: 'Cost per 1,000 views',
    eta: 'Estimated delivery',
    days: 'days',
    cta: 'Submit Quote & Request Analysis',
    pkg: 'Package',
    packages: {
      views: { name: 'Views Only', desc: 'Official Google Ads video delivery to your target audience', tag: 'Standard' },
      engagement: {
        name: 'Engagement Package',
        desc: 'Views + targeting and campaign setup focused on likes, comments and shares',
        tag: '+30%',
      },
    },
    engagementNote: 'Engagement comes from real viewers; like/comment counts are not guaranteed and no bots are used.',
    consult: 'Send Quote on WhatsApp',
    consultMsg: 'Hello, I would like to submit a quote request and get a detailed analysis for my YouTube video.',
    note: 'Every video is reviewed for duration, content, and Google Ads criteria by our Google Partner specialists with 18+ years of experience. Submit your quote, we will analyze your video and reply in detail via WhatsApp or Telegram. Campaign starts upon approval. Pricing may vary based on video length.',
    perks: [
      'Submit your quote, we analyze your video and reply in detail',
      'Direct specialist communication on WhatsApp & Telegram',
      'Process starts upon approval',
      'Pricing may vary by video duration • Zero bots',
    ],
  },
  order: {
    title: 'Submit your quote for video analysis',
    subtitle: 'Share your video link and contact info; our specialists will analyze your video and reply in detail on WhatsApp or Telegram. Work begins upon approval.',
    summary: 'Quote summary',
    video: 'YouTube video link',
    videoPh: 'https://www.youtube.com/watch?v=...',
    videoBad: 'Enter a valid YouTube video link (watch, youtu.be or shorts).',
    videoOk: 'Video found',
    name: 'Full name',
    email: 'Email',
    contact: 'WhatsApp or Telegram (for detailed reply)',
    payment: 'Workflow & Approval',
    card: 'WhatsApp & Telegram Confirmed Workflow',
    cardDesc: 'Detailed reply provided after video analysis',
    iban: 'Starts Upon Approval',
    ibanDesc: 'Payment plan is agreed in the quote',
    terms: 'I have read and accept the terms of service and privacy policy.',
    submit: 'Submit Quote & Request Analysis',
    submitting: 'Submitting…',
    error: 'Could not submit the request. Check your details and try again.',
    edit: 'Change',
  },
  track: {
    title: 'Campaign & Analysis Tracking',
    code: 'Quote / Order code',
    lookupTitle: 'Track your request',
    lookupDesc: 'Enter your quote/order code (starts with AV-).',
    lookupBtn: 'Track',
    notFound: 'No record found with this code.',
    delivered: 'Views delivered',
    target: 'Target',
    daily: 'Daily views',
    status: 'Status',
    started: 'Requested on',
    noData: 'Daily numbers appear here once approved and the campaign starts.',
    statuses: {
      pending_payment: 'Awaiting Analysis & Approval',
      payment_review: 'In Google Ads Approval Review',
      queued: 'Approved — Preparing Campaign',
      running: 'Campaign Live',
      completed: 'Completed',
      cancelled: 'Cancelled',
    },
    ibanTitle: 'Analysis & Approval Process',
    ibanBody: 'Once your video and duration are analyzed, we send a detailed reply via WhatsApp or Telegram; work begins upon approval.',
    cardBody: 'All analysis and campaign approval steps are coordinated via WhatsApp and Telegram.',
    copy: 'Copy',
    copied: 'Copied',
  },
};

/** Arapça arayüz metinleri (MSA). */
const ar: Strings = {
  "calc": {
    "badge": "عرض سعر فوري",
    "title": "أدخل عدد المشاهدات لترى عرض السعر التقديري",
    "subtitle": "أرسل طلب عرض السعر وسنحلل الفيديو ونرد عليك بالتفصيل عبر WhatsApp أو Telegram. يبدأ العمل عند الموافقة. قد يختلف السعر حسب مدة الفيديو.",
    "views": "عدد المشاهدات",
    "format": "نوع الحملة",
    "guaranteesTitle": "ضمان ومعايير Google Ads الرسمية 100%",
    "guarantees": [
      {
        "badge": "بلا بوتات ولا لوحات",
        "title": "دون أي بوتات أو لوحات SMM",
        "desc": "مشاهدات تُسلَّم حصريًا عبر Google Ads وتبقى بشكل دائم."
      },
      {
        "badge": "موثّق في Studio",
        "title": "مصدر إعلانات يوتيوب",
        "desc": "تُتتبع بشفافية باسم \"إعلانات يوتيوب\" في تحليلات Studio."
      },
      {
        "badge": "معجبون حقيقيون",
        "title": "إعجابات وتعليقات ومشتركون",
        "desc": "تتيح فرصًا حقيقية لإعجابات وتعليقات ومشتركين بشكل طبيعي."
      }
    ],
    "region": "المنطقة المستهدفة",
    "currency": "العملة",
    "formats": {
      "instream": {
        "name": "إعلانات فيديو رسمية",
        "desc": "تسليم محسَّن تلقائيًا عبر In-Stream وShorts"
      },
      "shorts": {
        "name": "موجز Shorts",
        "desc": "ظهور في موجز الفيديوهات القصيرة العمودية"
      },
      "discovery": {
        "name": "الاكتشاف / داخل الموجز",
        "desc": "ظهور في بحث يوتيوب والتوصيات"
      }
    },
    "regions": {
      "tr": {
        "name": "تركيا",
        "desc": "للجمهور الناطق بالتركية فقط",
        "tag": "قياسي"
      },
      "global": {
        "name": "عالمي",
        "desc": "كل الدول مجتمعة",
        "tag": "أفضل سعر 🔥"
      },
      "premium": {
        "name": "اختر دولة",
        "desc": "اختر دولتك من القائمة",
        "tag": ""
      }
    },
    "total": "عرض السعر التقديري",
    "discount": "خصم الباقة",
    "per1k": "التكلفة لكل 1,000 مشاهدة",
    "eta": "مدة التسليم المتوقعة",
    "days": "أيام",
    "cta": "أرسل الطلب واطلب التحليل",
    "pkg": "الباقة",
    "packages": {
      "views": {
        "name": "مشاهدات فقط",
        "desc": "تسليم فيديو رسمي عبر Google Ads إلى جمهورك المستهدف",
        "tag": "قياسي"
      },
      "engagement": {
        "name": "باقة التفاعل",
        "desc": "مشاهدات + استهداف وإعداد حملة يركّزان على الإعجابات والتعليقات والمشاركات",
        "tag": "+30%"
      }
    },
    "engagementNote": "يأتي التفاعل من مشاهدين حقيقيين؛ عدد الإعجابات والتعليقات غير مضمون ولا نستخدم أي بوتات.",
    "consult": "أرسل طلب العرض عبر WhatsApp",
    "consultMsg": "Hello, I would like to submit a quote request and get a detailed analysis for my YouTube video.",
    "note": "تتم مراجعة كل فيديو من حيث المدة والمحتوى ومعايير Google Ads بواسطة متخصصي Google Partner لدينا بخبرة تتجاوز 18 عامًا. أرسل طلب عرض السعر، وسنحلل الفيديو ونرد عليك بالتفصيل عبر WhatsApp أو Telegram. تبدأ الحملة عند الموافقة. قد يختلف السعر حسب مدة الفيديو.",
    "perks": [
      "أرسل عرض السعر، نحلل الفيديو ونرد عليك بالتفصيل",
      "تواصل مباشر مع المتخصصين عبر WhatsApp وTelegram",
      "تبدأ العملية عند الموافقة",
      "قد يختلف السعر حسب مدة الفيديو • دون أي بوتات"
    ]
  },
  "order": {
    "title": "أرسل طلب عرض السعر لتحليل الفيديو",
    "subtitle": "شارك رابط الفيديو ووسيلة التواصل؛ سيحلل متخصصونا الفيديو ويردون عليك بالتفصيل عبر WhatsApp أو Telegram. يبدأ العمل عند الموافقة.",
    "summary": "ملخص عرض السعر",
    "video": "رابط فيديو يوتيوب",
    "videoPh": "https://www.youtube.com/watch?v=...",
    "videoBad": "أدخل رابط فيديو يوتيوب صالحًا (watch أو youtu.be أو shorts).",
    "videoOk": "تم العثور على الفيديو",
    "name": "الاسم الكامل",
    "email": "البريد الإلكتروني",
    "contact": "WhatsApp أو Telegram (للرد المفصل)",
    "payment": "سير العمل والموافقة",
    "card": "سير عمل مؤكَّد عبر WhatsApp وTelegram",
    "cardDesc": "رد مفصل بعد تحليل الفيديو",
    "iban": "يبدأ عند الموافقة",
    "ibanDesc": "يُتفق على خطة الدفع ضمن عرض السعر",
    "terms": "قرأت شروط الاستخدام وسياسة الخصوصية وأوافق عليها.",
    "submit": "أرسل الطلب واطلب التحليل",
    "submitting": "جارٍ الإرسال…",
    "error": "تعذّر إرسال الطلب. تحقق من بياناتك وحاول مرة أخرى.",
    "edit": "تغيير"
  },
  "track": {
    "title": "تتبع الحملة والتحليل",
    "code": "رمز عرض السعر / الطلب",
    "lookupTitle": "تتبّع طلبك",
    "lookupDesc": "أدخل رمز عرض السعر/الطلب (يبدأ بـ AV-).",
    "lookupBtn": "تتبّع",
    "notFound": "لم يتم العثور على أي سجل بهذا الرمز.",
    "delivered": "المشاهدات المسلَّمة",
    "target": "الهدف",
    "daily": "المشاهدات اليومية",
    "status": "الحالة",
    "started": "تاريخ الطلب",
    "noData": "تظهر الأرقام اليومية هنا بعد الموافقة وبدء الحملة.",
    "statuses": {
      "pending_payment": "بانتظار التحليل والموافقة",
      "payment_review": "قيد مراجعة موافقة Google Ads",
      "queued": "تمت الموافقة — جارٍ تجهيز الحملة",
      "running": "الحملة نشطة",
      "completed": "مكتملة",
      "cancelled": "ملغاة"
    },
    "ibanTitle": "عملية التحليل والموافقة",
    "ibanBody": "بعد تحليل الفيديو ومدته، نرسل ردًا مفصلًا عبر WhatsApp أو Telegram، ويبدأ العمل عند الموافقة.",
    "cardBody": "يتم تنسيق جميع خطوات التحليل والموافقة على الحملة عبر WhatsApp وTelegram.",
    "copy": "نسخ",
    "copied": "تم النسخ"
  }
};

export function getAppStrings(locale: Locale | string): Strings {
  return locale === 'ar' ? ar : locale === 'en' ? en : tr;
}
export type AppStrings = Strings;


