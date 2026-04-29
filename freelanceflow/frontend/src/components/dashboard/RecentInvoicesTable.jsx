// Recent invoices table card.
import CardContainer from '../common/CardContainer';
import StatusBadge from '../common/StatusBadge';
import SelectDropdown from '../common/SelectDropdown';
import LoadingSkeleton from '../common/LoadingSkeleton';
import { formatDate, formatCurrency } from '../../utils/formatters';

const RecentInvoicesTable = ({ invoices, isLoading = false, onRowClick }) => {
  if (isLoading) {
    return <LoadingSkeleton variant="table" rows={4} />;
  }

  return (
    <CardContainer>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-900">Recent Invoices</h3>
        <SelectDropdown options={[{ value: 'all', label: 'All terms' }]} value="all" onChange={() => {}} />
      </div>
      <div className="overflow-auto">
        <table className="w-full text-sm">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left py-2">Invoice #</th>
              <th className="text-left py-2">Client</th>
              <th className="text-left py-2">Date</th>
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
                <td className="py-2">{invoice.clientName || invoice.clientId}</td>
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
};

export default RecentInvoicesTable;
