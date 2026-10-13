'use client';

import { useCallback, useEffect, useState } from 'react';
import { formatMoney } from '@/lib/pricing';
import type { Order, OrderStatus } from '@/lib/store';

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending_payment: 'Ödeme bekleniyor',
  payment_review: 'Ödeme kontrol',
  queued: 'Sırada',
  running: 'Yayında',
  completed: 'Tamamlandı',
  cancelled: 'İptal',
};

const field = 'rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#FF0033]';
const today = () => new Date().toISOString().slice(0, 10);

export default function AdminPanel() {
  const [key, setKey] = useState('');
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [err, setErr] = useState('');
  const [open, setOpen] = useState<string | null>(null);

  const load = useCallback(async (k: string) => {
    const r = await fetch('/api/admin/orders', { headers: { 'x-admin-key': k }, cache: 'no-store' });
    if (!r.ok) {
      setErr(r.status === 401 ? 'Şifre yanlış (veya ADMIN_PASSWORD tanımlı değil).' : 'Hata');
      setOrders(null);
      return false;
    }
    setErr('');
    setOrders(await r.json());
    return true;
  }, []);

  useEffect(() => {
    try {
      const k = sessionStorage.getItem('av_admin');
      if (k) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- oturumdan anahtarı geri yükleme
        setKey(k);
        load(k);
      }
    } catch {}
  }, [load]);

  async function patch(id: string, body: object) {
    const r = await fetch(`/api/admin/orders/${id}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json', 'x-admin-key': key },
      body: JSON.stringify(body),
    });
    if (r.ok) await load(key);
    else alert('Kaydedilemedi');
  }

  if (!orders) {
    return (
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (await load(key)) {
            try { sessionStorage.setItem('av_admin', key); } catch {}
          }
        }}
        className="mx-auto max-w-sm space-y-3"
      >
        <input type="password" autoFocus placeholder="Admin şifresi" value={key} onChange={(e) => setKey(e.target.value)} className={`${field} w-full`} />
        <button className="w-full rounded-lg bg-[#D9002B] py-2.5 font-bold text-white">Giriş</button>
        {err && <p className="text-sm text-red-600">{err}</p>}
      </form>
    );
  }

  return (
    <div className="space-y-3">
      <div className="mb-4 text-sm text-gray-500">{orders.length} sipariş</div>
      {orders.map((o) => {
        const done = o.stats.reduce((n, s) => n + s.views, 0);
        const isOpen = open === o.id;
        return (
          <div key={o.id} className="rounded-2xl border border-gray-200 bg-white">
            <button onClick={() => setOpen(isOpen ? null : o.id)} className="flex w-full flex-wrap items-center justify-between gap-3 p-4 text-left">
              <div>
                <div className="font-mono text-sm font-bold">{o.id}</div>
                <div className="text-xs text-gray-500">{o.name} · {o.email}</div>
              </div>
              <div className="text-sm">
                {done.toLocaleString('tr-TR')} / {o.views.toLocaleString('tr-TR')} · {formatMoney(o.total, o.currency, 'tr')} · <b>{STATUS_LABEL[o.status]}</b>
              </div>
            </button>
            {isOpen && (
              <div className="space-y-4 border-t border-gray-100 p-4 text-sm">
                <div className="grid gap-1 text-gray-600">
                  <a href={o.videoUrl} target="_blank" rel="noopener noreferrer" className="text-[#FF0033] underline break-all">{o.videoUrl}</a>
                  <div>{o.format} · {o.pkg === 'engagement' ? 'etkileşim paketi' : 'izlenme'} · {o.region} · ödeme: {o.payment}{o.contact ? ` · ${o.contact}` : ''}</div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold">Durum:</span>
                  <select value={o.status} onChange={(e) => patch(o.id, { status: e.target.value })} className={field}>
                    {(Object.keys(STATUS_LABEL) as OrderStatus[]).map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
                  </select>
                </div>

                <StatForm onSave={(stat) => patch(o.id, { stat })} />

                {o.stats.length > 0 && (
                  <table className="w-full max-w-md text-left text-xs">
                    <thead className="text-gray-400"><tr><th>Tarih</th><th>İzlenme</th><th>Harcama</th></tr></thead>
                    <tbody>
                      {o.stats.map((s) => (
                        <tr key={s.date} className="border-t border-gray-100"><td className="py-1">{s.date}</td><td>{s.views.toLocaleString('tr-TR')}</td><td>{s.spend ?? '—'}</td></tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function StatForm({ onSave }: { onSave: (s: { date: string; views: number; spend: string }) => void }) {
  const [date, setDate] = useState(today());
  const [views, setViews] = useState('');
  const [spend, setSpend] = useState('');
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!views) return;
        onSave({ date, views: Number(views), spend });
        setViews('');
        setSpend('');
      }}
      className="flex flex-wrap items-end gap-2"
    >
      <label className="text-xs text-gray-500">Tarih<input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={`${field} mt-1 block`} /></label>
      <label className="text-xs text-gray-500">O günün izlenmesi<input type="number" min={0} value={views} onChange={(e) => setViews(e.target.value)} className={`${field} mt-1 block w-36`} /></label>
      <label className="text-xs text-gray-500">Harcama (isteğe bağlı)<input type="number" min={0} step="0.01" value={spend} onChange={(e) => setSpend(e.target.value)} className={`${field} mt-1 block w-32`} /></label>
      <button className="rounded-lg bg-[#1A1A2E] px-4 py-2 text-sm font-bold text-white">Günü kaydet</button>
    </form>
  );
}
