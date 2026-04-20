export function DocumentTotals({
  subtotal,
  discountTotal,
  taxTotal,
  grandTotal,
}: {
  subtotal: number;
  discountTotal?: number;
  taxTotal: number;
  grandTotal: number;
}) {
  return (
    <div className="rounded-2xl border bg-slate-50 p-4 max-w-sm ml-auto space-y-2 text-sm">
      <div className="flex justify-between">
        <span>Subtotal</span>
        <span>{subtotal.toFixed(2)}</span>
      </div>
      {typeof discountTotal === 'number' ? (
        <div className="flex justify-between">
          <span>Discount</span>
          <span>{discountTotal.toFixed(2)}</span>
        </div>
      ) : null}
      <div className="flex justify-between">
        <span>Tax</span>
        <span>{taxTotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between font-semibold text-base">
        <span>Grand Total</span>
        <span>{grandTotal.toFixed(2)}</span>
      </div>
    </div>
  );
}
