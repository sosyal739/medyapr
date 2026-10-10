import type { Metadata } from 'next';
import AdminPanel from '@/components/admin/AdminPanel';

export const metadata: Metadata = { title: 'Admin', robots: { index: false, follow: false } };

export default function AdminPage() {
  return (
    <section className="min-h-[70vh] bg-gray-50 py-12">
      <div className="mx-auto max-w-4xl px-4">
        <h1 className="mb-6 font-[family-name:var(--font-heading)] text-2xl font-extrabold text-[#1A1A2E]">Admin — Siparişler</h1>
        <AdminPanel />
      </div>
    </section>
  );
}
