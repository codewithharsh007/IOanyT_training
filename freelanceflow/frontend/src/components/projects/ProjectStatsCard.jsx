// Project stats card.
import CardContainer from '../common/CardContainer';
import { formatCurrency } from '../../utils/formatters';

const ProjectStatsCard = ({ stats }) => (
  <CardContainer>
    <h3 className="text-sm font-semibold text-slate-900 mb-4">Project Stats</h3>
    <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
      <div>
        <div className="text-xs uppercase">Total Hours</div>
        <div className="text-lg font-semibold text-slate-900">{stats.totalHours || 0}</div>
      </div>
      <div>
        <div className="text-xs uppercase">Total Invoiced</div>
        <div className="text-lg font-semibold text-slate-900">{formatCurrency(stats.totalInvoiced)}</div>
      </div>
      <div>
        <div className="text-xs uppercase">Total Paid</div>
        <div className="text-lg font-semibold text-slate-900">{formatCurrency(stats.totalPaid)}</div>
      </div>
      <div>
        <div className="text-xs uppercase">Outstanding</div>
        <div className="text-lg font-semibold text-slate-900">
          {formatCurrency((stats.totalInvoiced || 0) - (stats.totalPaid || 0))}
        </div>
      </div>
    </div>
  </CardContainer>
);

export default ProjectStatsCard;
