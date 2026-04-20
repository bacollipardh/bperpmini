import { PageHeader } from '@/components/page-header';
import { DataTable } from '@/components/data-table';
import { StatusBadge } from '@/components/status-badge';
import { api } from '@/lib/api';

export default async function SalesInvoicesPage() {
  const docs = await api.list('sales-invoices');

  return (
    <div>
      <PageHeader
        title="Sales Invoices"
        description="Faturat shitëse, zbritjet dhe ulja e stokut."
        createHref="/sales-invoices/new"
        createLabel="New Sales Invoice"
      />
      <DataTable
        data={docs}
        detailsBasePath="/sales-invoices"
        columns={[
          { key: 'docNo', title: 'Doc No', render: (row: any) => row.docNo },
          { key: 'customer', title: 'Customer', render: (row: any) => row.customer?.name ?? '-' },
          { key: 'warehouse', title: 'Warehouse', render: (row: any) => row.warehouse?.name ?? '-' },
          { key: 'docDate', title: 'Date', render: (row: any) => String(row.docDate).slice(0, 10) },
          { key: 'grandTotal', title: 'Total', render: (row: any) => row.grandTotal },
          { key: 'status', title: 'Status', render: (row: any) => <StatusBadge value={row.status} /> },
        ]}
      />
    </div>
  );
}
