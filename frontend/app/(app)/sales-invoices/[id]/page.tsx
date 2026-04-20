import { PageHeader } from '@/components/page-header';
import { SalesInvoiceForm } from '@/components/invoices/sales-invoice-form';
import { PdfDownloadButton } from '@/components/invoices/pdf-download-button';
import { api } from '@/lib/api';
import { API_BASE_URL } from '@/lib/constants';

export default async function EditSalesInvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolved = await params;
  const [doc, series, customers, warehouses, paymentMethods, items] = await Promise.all([
    api.get('sales-invoices', resolved.id),
    api.list('document-series'),
    api.list('customers'),
    api.list('warehouses'),
    api.list('payment-methods'),
    api.list('items'),
  ]);

  return (
    <div>
      <div className="flex items-start justify-between mb-4">
        <PageHeader
          title={`Sales Invoice ${doc.docNo}`}
          description={`Status: ${doc.status} · Created: ${new Date(doc.createdAt).toLocaleDateString()}`}
        />
        <PdfDownloadButton href={`${API_BASE_URL}/pdf/sales-invoices/${resolved.id}`} label="Download PDF" />
      </div>
      <SalesInvoiceForm
        mode="edit"
        data={doc}
        series={series.filter((x: any) => x.documentType === 'SALES_INVOICE')}
        customers={customers}
        warehouses={warehouses}
        paymentMethods={paymentMethods}
        items={items}
      />
    </div>
  );
}

