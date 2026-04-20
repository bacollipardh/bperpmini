import { PageHeader } from '@/components/page-header';
import { DataTable } from '@/components/data-table';
import { StatusBadge } from '@/components/status-badge';
import { api } from '@/lib/api';

export default async function SalesReturnsPage() {
  const docs = await api.list('sales-returns');

  return (
    <div>
      <PageHeader
        title="Sales Returns"
        description="Kthimet e artikujve të lidhura me faturat shitëse."
        createHref="/sales-returns/new"
        createLabel="New Sales Return"
      />
      <DataTable
        data={docs}
        detailsBasePath="/sales-returns"
        columns={[
          { key: 'docNo', title: 'Doc No', render: (row: any) => row.docNo },
          { key: 'customer', title: 'Customer', render: (row: any) => row.customer?.name ?? '-' },
          { key: 'salesInvoice', title: 'Sales Invoice', render: (row: any) => row.salesInvoice?.docNo ?? '-' },
          { key: 'docDate', title: 'Date', render: (row: any) => String(row.docDate).slice(0, 10) },
          { key: 'grandTotal', title: 'Total', render: (row: any) => row.grandTotal },
          { key: 'status', title: 'Status', render: (row: any) => <StatusBadge value={row.status} /> },
        ]}
      />
    </div>
  );
}
