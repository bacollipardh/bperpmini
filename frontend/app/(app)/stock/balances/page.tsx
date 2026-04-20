import { PageHeader } from '@/components/page-header';
import { DataTable } from '@/components/data-table';
import { api } from '@/lib/api';

export default async function StockBalancesPage() {
  const balances = await api.list('stock/balance');

  return (
    <div>
      <PageHeader title="Stock Balances" description="Gjendja aktuale e stokut sipas magazinës dhe artikullit." />
      <DataTable
        data={balances}
        columns={[
          { key: 'warehouse', title: 'Warehouse', render: (row: any) => row.warehouse?.name ?? '-' },
          { key: 'item', title: 'Item', render: (row: any) => row.item?.name ?? '-' },
          { key: 'qtyOnHand', title: 'Qty On Hand', render: (row: any) => row.qtyOnHand },
          { key: 'avgCost', title: 'Avg Cost', render: (row: any) => row.avgCost },
          { key: 'updatedAt', title: 'Updated At', render: (row: any) => new Date(row.updatedAt).toLocaleString() },
        ]}
      />
    </div>
  );
}
