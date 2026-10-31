'use client';

import { useState } from 'react';
import { Send, Mail, MessageCircle, ShieldCheck, Award } from 'lucide-react';
import { TELEGRAM_URL, WHATSAPP_URL } from '@/lib/contact';
import { trackEvent } from '@/lib/analytics';

type Props = {
  locale: string;
};

export default function ContactClient({ locale }: Props) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    channelUrl: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');

  const isTr = locale === 'tr';


  const isAr = locale === 'ar';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSending) return;
    setIsSending(true);
    setError('');
    try {
      const hp = (e.currentTarget.elements.namedItem('website_hp') as HTMLInputElement | null)?.value ?? '';
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, language: locale, website_hp: hp }),
      });
      if (!res.ok) throw new Error(String(res.status));
      trackEvent('contact_form_submitted', { language: locale });
      trackEvent('generate_lead', { event_category: 'contact_form', event_label: locale, value: 100, currency: 'TRY' });
      trackEvent('conversion', {
        send_to: 'AW-11081445035/q5ZlCL6wop4dEKvdhaQp',
        value: 100,
        currency: 'TRY',
      });
      setIsSubmitted(true);
      setFormData({ name: '', email: '', phone: '', channelUrl: '', message: '' });
      setTimeout(() => setIsSubmitted(false), 6000);
    } catch {
      setError(
        isAr
          ? 'تعذّر إرسال الرسالة. يُرجى التواصل معنا عبر WhatsApp أو Telegram.'
          : isTr
          ? 'Mesaj gönderilemedi. Lütfen WhatsApp veya Telegram üzerinden yazın.'
          : 'Message could not be sent. Please reach us on WhatsApp or Telegram.',
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-studio-gradient text-white py-14 md:py-20 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="pointer-events-none absolute top-20 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-[#FF0033]/15 blur-[160px] animate-pulse-glow" />
      <div className="pointer-events-none absolute bottom-20 right-10 h-[400px] w-[400px] rounded-full bg-cyan-600/10 blur-[150px] animate-float-drift" />

      {/* Hero Header */}
      <div className="relative mx-auto max-w-6xl px-4 md:px-8 mb-12 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-zinc-700/60 bg-zinc-800/80 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#FF5E7E] mb-4">
          <Award className="h-4 w-4 text-[#FF0033]" />
          {isAr ? 'خبرة تتجاوز 18 عامًا • Google Partner رسمي' : isTr ? '18+ Yıllık Tecrübe • Resmi Google Partner' : '18+ Years Track Record • Official Google Partner'}
        </span>
        <h1 className="text-3xl font-extrabold sm:text-5xl tracking-tight text-white mb-4">
          {isAr ? 'تواصل ' : isTr ? 'Bizimle ' : 'Get in '}
          <span className="bg-gradient-to-r from-[#FF0033] via-[#FF6B6B] to-[#FF8E53] bg-clip-text text-transparent">
            {isAr ? 'مع MedyaPR' : isTr ? 'İletişime Geçin' : 'Touch with MedyaPR'}
          </span>
        </h1>
        <p className="text-sm md:text-base text-zinc-300 max-w-2xl mx-auto leading-relaxed">
          {isAr
            ? 'تواصل مع خبراء Google Partner المعتمدين لدينا للترويج للفيديو كليب وحملات In-Stream ووضع استراتيجية الحملة.'
            : isTr
            ? 'YouTube klibiniz veya kurumsal video tanıtımınız için uzman ekibimizle iletişime geçin. Ücretsiz ön analiz ve strateji danışmanlığı sağlayalım.'
            : 'Reach out to our certified Google Partner specialists for music video PR, In-Stream campaigns, and campaign strategy.'}
        </p>
      </div>

      {/* Main Section */}
      <div className="container mx-auto px-4 relative z-10 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Contact Form */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-8 md:p-10 backdrop-blur-xl shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-2">
              {isAr ? 'أرسل طلب عرض السعر ورابط الفيديو' : isTr ? 'Teklifinizi & Video Linkinizi İletin' : 'Submit Your Quote & Video Link'}
            </h2>
            <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
              {isAr
                ? 'أرسل طلب عرض السعر وسنحلل الفيديو ونرد عليك بالتفصيل؛ ويبدأ العمل بعد الموافقة. قد تختلف الأسعار حسب مدة الفيديو.'
                : isTr
                ? 'Teklifinizi iletin, videonuzu analiz edip detaylı dönüş yapalım; onay alınca işlem başlar. Fiyatlandırma video uzunluğuna göre değişebilir.'
                : 'Submit your quote, we will analyze your video and reply in detail; work begins upon approval. Pricing may vary based on video length.'}
            </p>

            {isSubmitted && (
              <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm font-medium flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
                {isAr
                  ? 'تم إرسال طلبك! سيحلل خبراؤنا الفيديو ويردون عليك بالتفصيل في أقرب وقت.'
                  : isTr
                  ? 'Talebiniz başarıyla iletildi! Uzman ekibimiz videonuzu analiz edip en kısa sürede detaylı dönüş yapacaktır.'
                  : 'Request sent! Our specialists will analyze your video and get back to you in detail shortly.'}
              </div>
            )}

            {error && (
              <div role="alert" className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-sm font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Honeypot: insanlar görmez, botlar doldurur */}
              <input type="text" name="website_hp" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 opacity-0" />
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                  {isAr ? 'اسمك الكامل / اسمك الفني' : isTr ? 'Adınız Soyadınız / Sanatçı Adı' : 'Your Full Name / Artist Name'}
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-700 bg-zinc-800/80 text-white placeholder-zinc-500 focus:border-[#FF0033] focus:ring-2 focus:ring-[#FF0033]/20 outline-none transition-all text-sm"
                  placeholder={isAr ? 'مثال: محمد أحمد' : isTr ? 'Örn. Adınız Soyadınız' : 'e.g. John Doe'}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                    {isAr ? 'البريد الإلكتروني' : isTr ? 'E-posta Adresi' : 'Email Address'}
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-700 bg-zinc-800/80 text-white placeholder-zinc-500 focus:border-[#FF0033] focus:ring-2 focus:ring-[#FF0033]/20 outline-none transition-all text-sm"
                    placeholder="ornek@medyapr.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                    {isAr ? 'رقم WhatsApp أو اسم مستخدم Telegram' : isTr ? 'WhatsApp veya Telegram Kullanıcı Adı' : 'WhatsApp or Telegram Username'}
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-700 bg-zinc-800/80 text-white placeholder-zinc-500 focus:border-[#FF0033] focus:ring-2 focus:ring-[#FF0033]/20 outline-none transition-all text-sm"
                    placeholder={isAr ? 'رقم WhatsApp أو @telegram' : isTr ? 'WhatsApp no veya @telegram' : 'WhatsApp or @telegram'}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                  {isAr ? 'رابط فيديو أو قناة يوتيوب' : isTr ? 'YouTube Video veya Kanal URL' : 'YouTube Video or Channel URL'}
                </label>
                <input
                  type="url"
                  value={formData.channelUrl}
                  onChange={(e) => setFormData({ ...formData, channelUrl: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-700 bg-zinc-800/80 text-white placeholder-zinc-500 focus:border-[#FF0033] focus:ring-2 focus:ring-[#FF0033]/20 outline-none transition-all text-sm"
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                  {isAr ? 'طلب عرض السعر وهدفك' : isTr ? 'Teklifiniz & Hedefiniz' : 'Your Quote Request & Target'}
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-700 bg-zinc-800/80 text-white placeholder-zinc-500 focus:border-[#FF0033] focus:ring-2 focus:ring-[#FF0033]/20 outline-none transition-all text-sm resize-none"
                  placeholder={
                    isAr
                      ? 'نشارككم رابط الفيديو وعدد المشاهدات المستهدف لإجراء تحليل ما قبل الحملة...'
                      : isTr
                      ? 'Video linkimizi ve hedeflediğimiz izlenme sayısını iletiyoruz, analiz edip detaylı dönüş yapabilir misiniz...'
                      : 'Sharing our video link and target views for pre-campaign analysis...'
                  }
                />
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="disabled:opacity-60 w-full py-3.5 px-6 rounded-xl font-bold bg-gradient-to-r from-[#FF0033] to-[#FF6B6B] hover:opacity-95 text-white flex items-center justify-center gap-2 shadow-lg shadow-[#FF0033]/20 transition-all text-sm"
              >
                <Send size={18} />
                {isSending ? (isAr ? 'جارٍ الإرسال…' : isTr ? 'Gönderiliyor…' : 'Sending…') : isAr ? 'أرسل الطلب واطلب التحليل' : isTr ? 'Teklifi İlet & Analiz İste' : 'Submit Quote & Request Analysis'}
              </button>
            </form>
          </div>

          {/* Quick Channels & Trust Box */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-8 backdrop-blur-xl shadow-xl">
              <h3 className="text-xl font-bold text-white mb-2">
                {isAr ? 'قنوات مباشرة لعرض السعر والتحليل' : isTr ? 'Hızlı Teklif & Analiz Kanalları' : 'Direct Quote & Analysis Channels'}
              </h3>
              <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
                {isAr
                  ? 'أرسل رابط الفيديو وطلب عرض السعر مباشرة عبر WhatsApp أو Telegram؛ وسيحلل خبراؤنا الفيديو ويردون عليك بالتفصيل.'
                  : isTr
                  ? 'Teklifinizi ve video linkinizi WhatsApp veya Telegram üzerinden doğrudan iletin; uzman ekibimiz videonuzu analiz edip detaylı dönüş yapsın.'
                  : 'Send your video link and quote directly via WhatsApp or Telegram; our specialists will analyze your video and reply in detail.'}
              </p>
              <div className="space-y-4">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl border border-zinc-800 bg-zinc-800/40 hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all group"
                >
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center group-hover:bg-emerald-500 transition-colors shrink-0">
                    <MessageCircle size={22} className="text-emerald-400 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{isAr ? 'خط WhatsApp لعرض السعر والتحليل' : isTr ? 'WhatsApp Teklif & Analiz Hattı' : 'WhatsApp Quote & Analysis Desk'}</p>
                    <p className="text-xs text-zinc-400">
                      {isAr ? 'أرسل طلبك للحصول على تحليل مفصل لفيديوك (متاح 24/7)' : isTr ? 'Teklifi iletin, analiz edip detaylı dönüş yapalım (7/24 Aktif)' : 'Submit your quote for detailed video analysis (24/7 Active)'}
                    </p>
                  </div>
                </a>

                <a
                  href={TELEGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl border border-zinc-800 bg-zinc-800/40 hover:border-sky-500/50 hover:bg-sky-500/10 transition-all group"
                >
                  <div className="w-12 h-12 bg-sky-500/20 rounded-xl flex items-center justify-center group-hover:bg-sky-500 transition-colors shrink-0">
                    <Send size={22} className="text-sky-400 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{isAr ? 'خط Telegram لعرض السعر والموافقة' : isTr ? 'Telegram Teklif & Onay Hattı' : 'Telegram Quote & Approval Desk'}</p>
                    <p className="text-xs text-zinc-400">
                      {isAr ? 'دعم فوري وتحليل للفيديو وبدء الحملة' : isTr ? 'Anlık iletişim, video analizi ve kampanya başlatma' : 'Instant support, video analysis, and campaign activation'}
                    </p>
                  </div>
                </a>

                <a
                  href="mailto:info@medyapr.com"
                  className="flex items-center gap-4 p-4 rounded-xl border border-zinc-800 bg-zinc-800/40 hover:border-red-500/50 hover:bg-red-500/10 transition-all group"
                >
                  <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center group-hover:bg-[#D9002B] transition-colors shrink-0">
                    <Mail size={22} className="text-[#FF5E7E] group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{isAr ? 'البريد الإلكتروني الرسمي للشركة' : isTr ? 'Resmi Kurumsal E-posta' : 'Official Corporate Email'}</p>
                    <p className="text-xs text-zinc-400">info@medyapr.com</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Process Explanation Card */}
            <div className="rounded-2xl border border-red-500/30 bg-gradient-to-br from-[#1F0E13] to-[#2B1017] p-8 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#FF0033]/20 rounded-xl flex items-center justify-center text-[#FF0033] shrink-0">
                  <ShieldCheck size={28} />
                </div>
                <div>
                  <p className="font-bold text-base sm:text-lg text-white">
                    {isAr ? 'التحليل الفني للفيديو والموافقة على الحملة' : isTr ? 'Teknik Video Analizi & Kampanya Onay Süreci' : 'Technical Video Analysis & Campaign Approval'}
                  </p>
                  <p className="text-zinc-400 text-xs">
                    {isAr ? 'أرسل الطلب • نحلل الفيديو • يبدأ العمل بعد الموافقة' : isTr ? 'Teklifi İletin • Analiz Edelim • Onay Alınca İşlem Başlar' : 'Submit Quote • Video Analysis • Starts Upon Approval'}
                  </p>
                </div>
              </div>
              <p className="text-zinc-300 text-xs leading-relaxed mb-3">
                {isAr
                  ? 'يختلف كل فيديو على يوتيوب في مدته وفئته ومدى توافقه مع سياسات Google Ads. ولفحص رابط الفيديو وبيانات القناة بدقة، تتم جميع خطوات عرض السعر والتحليل والموافقة عبر WhatsApp وTelegram مع فريقنا المتخصص. أرسل طلبك وسنحلل الفيديو ونرد عليك بالتفصيل؛ ويبدأ العمل بعد الموافقة. (قد تختلف الأسعار حسب مدة الفيديو.)'
                  : isTr
                  ? 'YouTube reklam kampanyalarında her videonun uzunluğu, kategori yapısı ve Google Ads reklam politikalarına uygunluğu farklıdır. Video bağlantınızın ve kanal verinizin eksiksiz incelenebilmesi için tüm teklif, analiz ve onay süreçleri WhatsApp ve Telegram üzerinden uzman ekibimizle yürütülür. Teklifinizi iletin, videonuzu analiz edip detaylı dönüş yapalım; onay alınca işlem başlar. (Fiyatlandırma video uzunluğuna göre değişebilir.)'
                  : 'Every YouTube video differs in duration, category, and Google Ads policy eligibility. To accurately inspect your video link and channel metrics, all quote, analysis, and approval steps are managed via WhatsApp and Telegram with our specialist team. Submit your quote, let us analyze your video and reply in detail; work begins upon approval. (Pricing may vary based on video length.)'}
              </p>
              <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
                <span>{isAr ? 'فريق Google Partner بخبرة تتجاوز 18 عامًا' : isTr ? '18+ Yıllık Google Partner Ekibi' : '18+ Years Google Partner Team'}</span>
                <span className="text-emerald-400 font-medium">{isAr ? '● تحليل من الخبراء 24/7' : isTr ? '● 7/24 Uzman Analizi' : '● 24/7 Specialist Analysis'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
