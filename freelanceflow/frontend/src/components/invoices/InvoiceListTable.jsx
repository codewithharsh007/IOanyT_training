// Invoice list table.
import StatusBadge from '../common/StatusBadge';
import LoadingSkeleton from '../common/LoadingSkeleton';

const InvoiceListTable = ({ invoices, selectedId, onSelect, isLoading = false }) => {
  if (isLoading) {
    return <LoadingSkeleton variant="table" rows={6} />;
  }

  return (
    <div className="overflow-auto">
      <table className="w-full text-sm">
        <thead className="text-slate-500">
          <tr>
            <th className="text-left py-2">Invoice #</th>
            <th className="text-left py-2">Client</th>
            <th className="text-left py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr
              key={invoice._id}
              onClick={() => onSelect(invoice._id)}
              className={`border-t border-slate-100 cursor-pointer ${
                selectedId === invoice._id ? 'bg-blue-50' : 'hover:bg-slate-50'
              }`}
            >
              <td className="py-2">{invoice.invoiceNumber}</td>
              <td className="py-2">{invoice.clientName || invoice.clientId}</td>
              <td className="py-2"><StatusBadge status={invoice.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceListTable;
