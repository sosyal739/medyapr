/**
 * Veri katmanı. Şimdilik yerel JSON dosyası (data/orders.json) — geliştirme ve demo için.
 * Yayında Vercel'de dosya sistemi yazılamaz: bu arayüz (getOrder/createOrder/addStat/...)
 * Supabase ile birebir değiştirilecek; sayfa ve API kodu değişmeyecek.
 * Şema: supabase/schema.sql
 */
import { promises as fs } from 'fs';
import path from 'path';
import { randomBytes } from 'crypto';
import type { Currency, Format, Region } from './pricing';

export type OrderStatus = 'pending_payment' | 'payment_review' | 'queued' | 'running' | 'completed' | 'cancelled';

export type DailyStat = { date: string; views: number; spend?: number };

export type Order = {
  id: string;
  createdAt: string;
  status: OrderStatus;
  email: string;
  name: string;
  contact?: string;
  videoUrl: string;
  videoId: string;
  format: Format;
  region: Region;
  views: number;
  currency: Currency;
  total: number;
  payment: 'card' | 'iban';
  paymentNote?: string;
  startViews?: number;
  stats: DailyStat[];
  adminNote?: string;
};

const FILE = path.join(process.cwd(), 'data', 'orders.json');

async function readAll(): Promise<Order[]> {
  try {
    return JSON.parse(await fs.readFile(FILE, 'utf8')) as Order[];
  } catch {
    return [];
  }
}

async function writeAll(orders: Order[]) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(orders, null, 2), 'utf8');
}

/** Tahmin edilemez takip kodu: AV-XXXXXXXXXX */
export function newOrderId(): string {
  return 'AV-' + randomBytes(6).toString('base64url').replace(/[-_]/g, 'x').toUpperCase();
}

export async function createOrder(data: Omit<Order, 'id' | 'createdAt' | 'status' | 'stats'>): Promise<Order> {
  const orders = await readAll();
  const order: Order = {
    ...data,
    id: newOrderId(),
    createdAt: new Date().toISOString(),
    status: data.payment === 'card' ? 'pending_payment' : 'payment_review',
    stats: [],
  };
  orders.unshift(order);
  await writeAll(orders);
  return order;
}

export async function getOrder(id: string): Promise<Order | null> {
  return (await readAll()).find((o) => o.id === id) ?? null;
}

export async function listOrders(): Promise<Order[]> {
  return readAll();
}

export async function updateOrder(id: string, patch: Partial<Order>): Promise<Order | null> {
  const orders = await readAll();
  const i = orders.findIndex((o) => o.id === id);
  if (i < 0) return null;
  orders[i] = { ...orders[i], ...patch, id: orders[i].id };
  await writeAll(orders);
  return orders[i];
}

/** Günlük istatistik ekler/üzerine yazar; tamamlanan izlenme siparişe ulaşırsa otomatik completed. */
export async function upsertStat(id: string, stat: DailyStat): Promise<Order | null> {
  const order = await getOrder(id);
  if (!order) return null;
  const stats = order.stats.filter((s) => s.date !== stat.date).concat(stat).sort((a, b) => a.date.localeCompare(b.date));
  const delivered = stats.reduce((n, s) => n + s.views, 0);
  const status: OrderStatus =
    order.status === 'cancelled' ? 'cancelled' : delivered >= order.views ? 'completed' : 'running';
  return updateOrder(id, { stats, status });
}

export function delivered(order: Order): number {
  return order.stats.reduce((n, s) => n + s.views, 0);
}

/** Müşteriye açık alan: e-posta/iletişim/admin notu gizlenir. */
export function publicView(o: Order) {
  const { email: _e, contact: _c, adminNote: _a, paymentNote: _p, name, ...rest } = o;
  return { ...rest, name: name.split(' ')[0] };
}
