// Client activity summary card.
import CardContainer from '../common/CardContainer';
import LoadingSkeleton from '../common/LoadingSkeleton';
import { formatCurrency } from '../../utils/formatters';

const ActivitySummaryCard = ({ stats, isLoading = false }) => {
  if (isLoading) {
    return <LoadingSkeleton variant="card" />;
  }

  return (
    <CardContainer>
      <h3 className="text-sm font-semibold text-slate-900 mb-4">Activity Summary</h3>
      <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
        <div>
          <div className="text-xs uppercase">Projects</div>
          <div className="text-lg font-semibold text-slate-900">{stats.totalProjects}</div>
        </div>
        <div>
          <div className="text-xs uppercase">Invoiced</div>
          <div className="text-lg font-semibold text-slate-900">{formatCurrency(stats.totalInvoiced)}</div>
        </div>
        <div>
          <div className="text-xs uppercase">Paid</div>
          <div className="text-lg font-semibold text-slate-900">{formatCurrency(stats.totalPaid)}</div>
        </div>
        <div>
          <div className="text-xs uppercase">Outstanding</div>
          <div className="text-lg font-semibold text-slate-900">{formatCurrency(stats.outstanding)}</div>
        </div>
      </div>
    </CardContainer>
  );
};

export default ActivitySummaryCard;
