// Invoice summary card.
import CardContainer from '../common/CardContainer';
import StatusBadge from '../common/StatusBadge';
import { formatDate, formatCurrency } from '../../utils/formatters';

const InvoiceCard = ({ invoice, onClick }) => (
  <CardContainer onClick={onClick}>
    <div className="flex items-start justify-between">
      <h4 className="text-base font-semibold text-slate-900">{invoice.invoiceNumber}</h4>
      <StatusBadge status={invoice.status} />
    </div>
    <div className="mt-3 text-sm text-slate-600">Client: {invoice.clientName || invoice.clientId}</div>
    <div className="mt-2 text-xs text-slate-500 flex justify-between">
      <span>Issue: {formatDate(invoice.issueDate)}</span>
      <span>Due: {formatDate(invoice.dueDate)}</span>
    </div>
    <div className="mt-3 text-sm text-slate-700">
      Total amount: <span className="font-semibold">{formatCurrency(invoice.totalAmount)}</span>
    </div>
  </CardContainer>
);

export default InvoiceCard;
