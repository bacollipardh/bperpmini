import { StatsCard } from '@/components/stats-card';
import { api } from '@/lib/api';

export default async function DashboardPage() {
  const [items, suppliers, customers, purchaseInvoices, salesInvoices, salesReturns, stockBalances] =
    await Promise.all([
      api.list('items'),
      api.list('suppliers'),
      api.list('customers'),
      api.list('purchase-invoices'),
      api.list('sales-invoices'),
      api.list('sales-returns'),
      api.list('stock/balance'),
    ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Pamje e përgjithshme e sistemit.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard title="Items" value={items.length} />
        <StatsCard title="Suppliers" value={suppliers.length} />
        <StatsCard title="Customers" value={customers.length} />
        <StatsCard title="Stock Lines" value={stockBalances.length} />
        <StatsCard title="Purchase Invoices" value={purchaseInvoices.length} />
        <StatsCard title="Sales Invoices" value={salesInvoices.length} />
        <StatsCard title="Sales Returns" value={salesReturns.length} />
      </div>
    </div>
  );
}
