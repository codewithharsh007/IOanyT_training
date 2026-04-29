// Time log card for mobile list.
import CardContainer from '../common/CardContainer';
import StatusBadge from '../common/StatusBadge';
import { formatDate } from '../../utils/formatters';

const TimeLogCardMobile = ({ log, onClick }) => (
  <CardContainer onClick={onClick}>
    <div className="flex items-start justify-between">
      <div>
        <h4 className="text-base font-semibold text-slate-900">{log.projectName || log.projectId}</h4>
        <p className="text-sm text-slate-500">{formatDate(log.date)}</p>
      </div>
      <StatusBadge status={log.status} />
    </div>
    <div className="mt-3 text-sm text-slate-600">Duration: {log.hours}h {log.minutes}m</div>
    {log.description && <p className="text-sm text-slate-500 mt-2">{log.description}</p>}
  </CardContainer>
);

export default TimeLogCardMobile;
