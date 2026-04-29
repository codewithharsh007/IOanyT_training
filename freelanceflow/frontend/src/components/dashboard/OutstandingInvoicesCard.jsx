// Outstanding invoices summary card.
import CardContainer from '../common/CardContainer';
import StatusBadge from '../common/StatusBadge';
import LoadingSkeleton from '../common/LoadingSkeleton';
import { formatCurrency } from '../../utils/formatters';

const OutstandingInvoicesCard = ({ count, totalAmount, overdueCount, isLoading = false, onClick }) => {
  if (isLoading) {
    return <LoadingSkeleton variant="card" />;
  }

  return (
    <CardContainer onClick={onClick}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">Outstanding Invoices</h3>
        {overdueCount > 0 && <StatusBadge status="Overdue" />}
      </div>
      <div className="mt-4">
        <div className="text-3xl font-semibold text-slate-900">{count}</div>
        <p className="text-sm text-slate-600 mt-1">Total amount: {formatCurrency(totalAmount)}</p>
      </div>
    </CardContainer>
  );
};

export default OutstandingInvoicesCard;
