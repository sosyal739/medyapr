'use client';

import { useState } from 'react';
import { Send, Mail, MessageCircle, ShieldCheck, Award } from 'lucide-react';
import { TELEGRAM_URL, WHATSAPP_URL } from '@/lib/contact';

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
      setIsSubmitted(true);
      setFormData({ name: '', email: '', phone: '', channelUrl: '', message: '' });
      setTimeout(() => setIsSubmitted(false), 6000);
    } catch {
      setError(
        isTr
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
          {isTr ? '18+ Yıllık Tecrübe • Resmi Google Partner' : '18+ Years Track Record • Official Google Partner'}
        </span>
        <h1 className="text-3xl font-extrabold sm:text-5xl tracking-tight text-white mb-4">
          {isTr ? 'Bizimle ' : 'Get in '}
          <span className="bg-gradient-to-r from-[#FF0033] via-[#FF6B6B] to-[#FF8E53] bg-clip-text text-transparent">
            {isTr ? 'İletişime Geçin' : 'Touch with MedyaPR'}
          </span>
        </h1>
        <p className="text-sm md:text-base text-zinc-300 max-w-2xl mx-auto leading-relaxed">
          {isTr
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
              {isTr ? 'Projenizi Bize İletin' : 'Send Us Your Project'}
            </h2>
            <p className="text-xs text-zinc-400 mb-6">
              {isTr
                ? 'Video onay sürecinin ardından %50 peşin, kalan %50 iş bitiminde alınır.'
                : 'Phased payment: 50% on Google Ads approval, 50% upon campaign completion.'}
            </p>

            {isSubmitted && (
              <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm font-medium flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
                {isTr
                  ? 'Mesajınız başarıyla iletildi! Google Partner uzmanımız en kısa sürede size dönüş yapacaktır.'
                  : 'Message sent successfully! Our Google Partner specialists will get back to you shortly.'}
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
                  {isTr ? 'Adınız Soyadınız' : 'Your Full Name'}
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-700 bg-zinc-800/80 text-white placeholder-zinc-500 focus:border-[#FF0033] focus:ring-2 focus:ring-[#FF0033]/20 outline-none transition-all text-sm"
                  placeholder={isTr ? 'Örn. Adınız Soyadınız' : 'e.g. John Doe'}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                    {isTr ? 'E-posta Adresi' : 'Email Address'}
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
                    {isTr ? 'Telefon / WhatsApp' : 'Phone / WhatsApp'}
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-700 bg-zinc-800/80 text-white placeholder-zinc-500 focus:border-[#FF0033] focus:ring-2 focus:ring-[#FF0033]/20 outline-none transition-all text-sm"
                    placeholder="+90 5XX XXX XX XX"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                  {isTr ? 'YouTube Video veya Kanal URL' : 'YouTube Video or Channel URL'}
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
                  {isTr ? 'Projeniz & Hedefiniz' : 'Your Project & Target'}
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-700 bg-zinc-800/80 text-white placeholder-zinc-500 focus:border-[#FF0033] focus:ring-2 focus:ring-[#FF0033]/20 outline-none transition-all text-sm resize-none"
                  placeholder={
                    isTr
                      ? 'Yeni çıkacak klibimiz için ilk 48 saatte Türkiye hedefli 100K izlenme planlıyoruz...'
                      : 'We are launching a new single and looking for targeted Google Ads reach...'
                  }
                />
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="disabled:opacity-60 w-full py-3.5 px-6 rounded-xl font-bold bg-gradient-to-r from-[#FF0033] to-[#FF6B6B] hover:opacity-95 text-white flex items-center justify-center gap-2 shadow-lg shadow-[#FF0033]/20 transition-all text-sm"
              >
                <Send size={18} />
                {isSending ? (isTr ? 'Gönderiliyor…' : 'Sending…') : isTr ? 'Ücretsiz Analiz Talebi Gönder' : 'Request Free Analysis'}
              </button>
            </form>
          </div>

          {/* Quick Channels & Trust Box */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-8 backdrop-blur-xl shadow-xl">
              <h3 className="text-xl font-bold text-white mb-6">
                {isTr ? 'Doğrudan İletişim Kanalları' : 'Direct Channels'}
              </h3>
              <div className="space-y-4">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl border border-zinc-800 bg-zinc-800/40 hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all group"
                >
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
                    <MessageCircle size={22} className="text-emerald-400 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{isTr ? 'WhatsApp Canlı Destek' : 'WhatsApp Live Support'}</p>
                    <p className="text-xs text-zinc-400">+90 531 299 33 55 {isTr ? '(7/24 Aktif)' : '(24/7 Available)'}</p>
                  </div>
                </a>

                <a
                  href={TELEGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl border border-zinc-800 bg-zinc-800/40 hover:border-sky-500/50 hover:bg-sky-500/10 transition-all group"
                >
                  <div className="w-12 h-12 bg-sky-500/20 rounded-xl flex items-center justify-center group-hover:bg-sky-500 transition-colors">
                    <Send size={22} className="text-sky-400 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{isTr ? 'Telegram ile Sipariş' : 'Order via Telegram'}</p>
                    <p className="text-xs text-zinc-400">+90 531 299 33 55</p>
                  </div>
                </a>

                <a
                  href="mailto:info@medyapr.com"
                  className="flex items-center gap-4 p-4 rounded-xl border border-zinc-800 bg-zinc-800/40 hover:border-red-500/50 hover:bg-red-500/10 transition-all group"
                >
                  <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center group-hover:bg-[#D9002B] transition-colors">
                    <Mail size={22} className="text-[#FF5E7E] group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{isTr ? 'Resmi Kurumsal E-posta' : 'Official Corporate Email'}</p>
                    <p className="text-xs text-zinc-400">info@medyapr.com</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Google Partner Authority Card */}
            <div className="rounded-2xl border border-red-500/30 bg-gradient-to-br from-[#1F0E13] to-[#2B1017] p-8 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#FF0033]/20 rounded-xl flex items-center justify-center text-[#FF0033]">
                  <ShieldCheck size={28} />
                </div>
                <div>
                  <p className="font-bold text-lg text-white">{isTr ? 'Resmi Google Partner Ajansı' : 'Official Google Partner Agency'}</p>
                  <p className="text-zinc-400 text-xs">{isTr ? '18+ Yıllık Kesintisiz Sektör Deneyimi' : '18+ Years Continuous Industry Experience'}</p>
                </div>
              </div>
              <p className="text-zinc-300 text-xs leading-relaxed mb-3">
                {isTr
                  ? 'MedyaPR; Türkiye ve dünyada yüzlerce sanatçı ve kurumsal markaya doğrudan resmi Google Ads video ağıyla şeffaf izlenme ve klip PR hizmeti sunar. Sıfır bot, %100 kanal güvenliği.'
                  : 'MedyaPR delivers 100% official Google Ads campaigns for artists worldwide with zero bot guarantee, high retention, and complete channel safety.'}
              </p>
              <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
                <span>{isTr ? 'MedyaPR Uzman Ekibi' : 'MedyaPR Expert Team'}</span>
                <span className="text-emerald-400 font-medium">{isTr ? '● Canlı Operasyon' : '● Live Operations'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
