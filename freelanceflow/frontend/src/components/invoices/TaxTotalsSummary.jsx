// Tax and totals summary block.
import { formatCurrency } from '../../utils/formatters';

const TaxTotalsSummary = ({ subtotal, taxPercent, total, totalPaid, balanceDue }) => (
  <div className="text-sm text-slate-600 space-y-1">
    <div className="flex justify-between">
      <span>Subtotal</span>
      <span>{formatCurrency(subtotal)}</span>
    </div>
    <div className="flex justify-between">
      <span>Tax ({taxPercent}%)</span>
      <span>{formatCurrency((subtotal * taxPercent) / 100)}</span>
    </div>
    <div className="flex justify-between font-semibold text-slate-900">
      <span>Total</span>
      <span>{formatCurrency(total)}</span>
    </div>
    <div className="flex justify-between">
      <span>Total Paid</span>
      <span>{formatCurrency(totalPaid)}</span>
    </div>
    <div className="flex justify-between">
      <span>Balance Due</span>
      <span>{formatCurrency(balanceDue)}</span>
    </div>
  </div>
);

export default TaxTotalsSummary;
