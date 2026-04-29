// Time logs summary bar.
import CardContainer from '../common/CardContainer';

const TimeLogsSummaryBar = ({ summary }) => (
  <CardContainer>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-600">
      <div>
        <div className="text-xs uppercase">Total Hours</div>
        <div className="text-lg font-semibold text-slate-900">{summary.totalHours || 0}</div>
      </div>
      <div>
        <div className="text-xs uppercase">Billable</div>
        <div className="text-lg font-semibold text-slate-900">{summary.billableHours || 0}</div>
      </div>
      <div>
        <div className="text-xs uppercase">Non-Billable</div>
        <div className="text-lg font-semibold text-slate-900">{summary.nonBillableHours || 0}</div>
      </div>
      <div>
        <div className="text-xs uppercase">This Week</div>
        <div className="text-lg font-semibold text-slate-900">{summary.weekHours || 0}</div>
      </div>
    </div>
  </CardContainer>
);

export default TimeLogsSummaryBar;
