// Linked invoices table for project detail.
import CardContainer from '../common/CardContainer';
import StatusBadge from '../common/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';

const LinkedInvoicesTable = ({ invoices, onRowClick }) => (
  <CardContainer>
    <h3 className="text-sm font-semibold text-slate-900 mb-4">Linked Invoices</h3>
    <div className="overflow-auto">
      <table className="w-full text-sm">
        <thead className="text-slate-500">
          <tr>
            <th className="text-left py-2">Invoice</th>
            <th className="text-left py-2">Issue Date</th>
            <th className="text-left py-2">Status</th>
            <th className="text-right py-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr
              key={invoice._id}
              className="border-t border-slate-100 hover:bg-slate-50 cursor-pointer"
              onClick={() => onRowClick?.(invoice)}
            >
              <td className="py-2">{invoice.invoiceNumber}</td>
              <td className="py-2">{formatDate(invoice.issueDate)}</td>
              <td className="py-2"><StatusBadge status={invoice.status} /></td>
              <td className="py-2 text-right">{formatCurrency(invoice.totalAmount)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </CardContainer>
);

export default LinkedInvoicesTable;
