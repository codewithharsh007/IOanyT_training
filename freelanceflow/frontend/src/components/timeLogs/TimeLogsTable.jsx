// Time logs table.
import StatusBadge from '../common/StatusBadge';
import LoadingSkeleton from '../common/LoadingSkeleton';
import { formatDate } from '../../utils/formatters';

const TimeLogsTable = ({ timeLogs, isLoading = false, onRowClick }) => {
  if (isLoading) {
    return <LoadingSkeleton variant="table" rows={6} />;
  }

  return (
    <div className="overflow-auto">
      <table className="w-full text-sm">
        <thead className="text-slate-500">
          <tr>
            <th className="text-left py-2">Date</th>
            <th className="text-left py-2">Project</th>
            <th className="text-left py-2">Duration</th>
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
              <td className="py-2">{log.projectName || log.projectId}</td>
              <td className="py-2">{log.hours}h {log.minutes}m</td>
              <td className="py-2"><StatusBadge status={log.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TimeLogsTable;
