import { PageHeader } from '@/components/page-header';
import { SalesInvoiceForm } from '@/components/invoices/sales-invoice-form';
import { api } from '@/lib/api';

export default async function NewSalesInvoicePage() {
  const [series, customers, warehouses, paymentMethods, items] = await Promise.all([
    api.list('document-series'),
    api.list('customers'),
    api.list('warehouses'),
    api.list('payment-methods'),
    api.list('items'),
  ]);

  return (
    <div>
      <PageHeader title="New Sales Invoice" description="Krijo draft faturë shitëse." />
      <SalesInvoiceForm
        mode="create"
        series={series.filter((x: any) => x.documentType === 'SALES_INVOICE')}
        customers={customers}
        warehouses={warehouses}
        paymentMethods={paymentMethods}
        items={items}
      />
    </div>
  );
}
