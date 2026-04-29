// Linked time logs table for project detail.
import CardContainer from '../common/CardContainer';
import StatusBadge from '../common/StatusBadge';
import { formatDate } from '../../utils/formatters';

const LinkedTimeLogsTable = ({ timeLogs, onRowClick }) => (
  <CardContainer>
    <h3 className="text-sm font-semibold text-slate-900 mb-4">Linked Time Logs</h3>
    <div className="overflow-auto">
      <table className="w-full text-sm">
        <thead className="text-slate-500">
          <tr>
            <th className="text-left py-2">Date</th>
            <th className="text-left py-2">Hours</th>
            <th className="text-left py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {timeLogs.map((log) => (
            <tr
              key={log._id}
              className="border-t border-slate-100 hover:bg-slate-50 cursor-pointer"
              onClick={() => onRowClick?.(log)}
            >
              <td className="py-2">{formatDate(log.date)}</td>
              <td className="py-2">{log.hours}h {log.minutes}m</td>
              <td className="py-2"><StatusBadge status={log.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </CardContainer>
);

export default LinkedTimeLogsTable;
