import { PageHeader } from '@/components/page-header';
import { SalesReturnForm } from '@/components/invoices/sales-return-form';
import { PdfDownloadButton } from '@/components/invoices/pdf-download-button';
import { api } from '@/lib/api';
import { API_BASE_URL } from '@/lib/constants';

export default async function EditSalesReturnPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolved = await params;
  const [doc, series, customers, salesInvoices, items] = await Promise.all([
    api.get('sales-returns', resolved.id),
    api.list('document-series'),
    api.list('customers'),
    api.list('sales-invoices'),
    api.list('items'),
  ]);

  return (
    <div>
      <div className="flex items-start justify-between mb-4">
        <PageHeader
          title={`Sales Return ${doc.docNo}`}
          description={`Status: ${doc.status} · Created: ${new Date(doc.createdAt).toLocaleDateString()}`}
        />
        <PdfDownloadButton href={`${API_BASE_URL}/pdf/sales-returns/${resolved.id}`} label="Download PDF" />
      </div>
      <SalesReturnForm
        mode="edit"
        data={doc}
        series={series.filter((x: any) => x.documentType === 'SALES_RETURN')}
        customers={customers}
        salesInvoices={salesInvoices}
        items={items}
      />
    </div>
  );
}

