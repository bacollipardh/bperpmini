import { api } from '@/lib/api';
import { PosForm } from '@/components/sales-agent/pos-form';
import Link from 'next/link';

export default async function SalesAgentPage() {
  const [items, customers, warehouses, paymentMethods, series] = await Promise.all([
    api.list('items'),
    api.list('customers'),
    api.list('warehouses'),
    api.list('payment-methods'),
    api.list('document-series'),
  ]);

  const salesSeries = series.filter((s: any) => s.documentType === 'SALES_INVOICE' && s.isActive !== false);

  return (
    <div>
      {/* Page header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Agjenti i Shitjes</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Kërko artikullin me emër, kod ose barkod dhe krijo faturë shitjeje menjëherë.
          </p>
        </div>
        <Link
          href="/agjenti-shitjes/historiku"
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition-colors shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Historiku
        </Link>
      </div>

      {salesSeries.length === 0 && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-sm px-4 py-3 mb-4">
          ⚠️ Nuk ka seri dokumenti aktive për faturat e shitjes. Krijoni një seri me tip{' '}
          <strong>SALES_INVOICE</strong> te{' '}
          <Link href="/document-series/new" className="underline font-medium">Seritë e Dokumenteve</Link>.
        </div>
      )}

      <PosForm
        items={items.filter((i: any) => i.isActive !== false)}
        customers={customers.filter((c: any) => c.isActive !== false)}
        warehouses={warehouses.filter((w: any) => w.isActive !== false)}
        paymentMethods={paymentMethods.filter((p: any) => p.isActive !== false)}
        series={salesSeries}
      />
    </div>
  );
}
