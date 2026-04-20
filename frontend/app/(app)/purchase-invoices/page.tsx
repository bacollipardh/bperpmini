import { PageHeader } from '@/components/page-header';
import { DataTable } from '@/components/data-table';
import { StatusBadge } from '@/components/status-badge';
import { api } from '@/lib/api';

export default async function PurchaseInvoicesPage() {
  const docs = await api.list('purchase-invoices');

  return (
    <div>
      <PageHeader
        title="Purchase Invoices"
        description="Fatura blerëse dhe hyrjet e stokut."
        createHref="/purchase-invoices/new"
        createLabel="New Purchase Invoice"
      />
      <DataTable
        data={docs}
        detailsBasePath="/purchase-invoices"
        columns={[
          { key: 'docNo', title: 'Doc No', render: (row: any) => row.docNo },
          { key: 'supplier', title: 'Supplier', render: (row: any) => row.supplier?.name ?? '-' },
          { key: 'warehouse', title: 'Warehouse', render: (row: any) => row.warehouse?.name ?? '-' },
          { key: 'docDate', title: 'Date', render: (row: any) => String(row.docDate).slice(0, 10) },
          { key: 'grandTotal', title: 'Total', render: (row: any) => row.grandTotal },
          { key: 'status', title: 'Status', render: (row: any) => <StatusBadge value={row.status} /> },
        ]}
      />
    </div>
  );
}
