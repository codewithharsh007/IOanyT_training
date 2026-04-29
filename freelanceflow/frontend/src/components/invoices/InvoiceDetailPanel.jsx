// Invoice detail panel.
import StatusBadge from '../common/StatusBadge';
import LineItemsTable from './LineItemsTable';
import TaxTotalsSummary from './TaxTotalsSummary';
import PaymentStatusSection from './PaymentStatusSection';
import DownloadPDFButton from './DownloadPDFButton';
import { formatDate } from '../../utils/formatters';

const InvoiceDetailPanel = ({ invoice, lineItems, payments, onDownload, isDownloading = false }) => {
  if (!invoice) {
    return (
      <div className="h-full flex items-center justify-center text-slate-500">
        Select an invoice to view details
      </div>
    );
  }

  const totalPaid = payments.reduce((sum, payment) => sum + Number(payment.amount), 0);
  const balanceDue = Number(invoice.totalAmount) - totalPaid;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{invoice.invoiceNumber}</h3>
          <div className="text-sm text-slate-500">{invoice.clientName || invoice.clientId}</div>
        </div>
        <StatusBadge status={invoice.status} />
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm text-slate-600 mb-4">
        <div>
          <div className="text-xs uppercase">Issue Date</div>
          <div className="text-slate-900">{formatDate(invoice.issueDate)}</div>
        </div>
        <div>
          <div className="text-xs uppercase">Due Date</div>
          <div className="text-slate-900">{formatDate(invoice.dueDate)}</div>
        </div>
      </div>

      <LineItemsTable lineItems={lineItems} />

      <div className="mt-4">
        <TaxTotalsSummary
          subtotal={Number(invoice.subtotal)}
          taxPercent={Number(invoice.taxPercent)}
          total={Number(invoice.totalAmount)}
          totalPaid={totalPaid}
          balanceDue={balanceDue}
        />
      </div>

      <div className="mt-4">
        <PaymentStatusSection status={invoice.status} />
      </div>

      <div className="mt-6">
        <DownloadPDFButton onClick={onDownload} isLoading={isDownloading} />
      </div>
    </div>
  );
};

export default InvoiceDetailPanel;
