import { PageHeader } from '@/components/page-header';
import { PurchaseInvoiceForm } from '@/components/invoices/purchase-invoice-form';
import { PdfDownloadButton } from '@/components/invoices/pdf-download-button';
import { api } from '@/lib/api';
import { API_BASE_URL } from '@/lib/constants';

export default async function EditPurchaseInvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolved = await params;
  const [doc, series, suppliers, warehouses, items] = await Promise.all([
    api.get('purchase-invoices', resolved.id),
    api.list('document-series'),
    api.list('suppliers'),
    api.list('warehouses'),
    api.list('items'),
  ]);

  return (
    <div>
      <div className="flex items-start justify-between mb-4">
        <PageHeader
          title={`Purchase Invoice ${doc.docNo}`}
          description={`Status: ${doc.status} · Created: ${new Date(doc.createdAt).toLocaleDateString()}`}
        />
        <PdfDownloadButton
          href={`${API_BASE_URL}/pdf/purchase-invoices/${resolved.id}`}
          label="Download PDF"
        />
      </div>
      <PurchaseInvoiceForm
        mode="edit"
        data={doc}
        series={series.filter((x: any) => x.documentType === 'PURCHASE_INVOICE')}
        suppliers={suppliers}
        warehouses={warehouses}
        items={items}
      />
    </div>
  );
}
