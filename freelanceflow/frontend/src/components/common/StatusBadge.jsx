// Status badge with color variants.
import { AlertTriangle } from 'lucide-react';

const statusStyles = {
  Active: 'bg-emerald-50 text-emerald-700',
  Archived: 'bg-rose-50 text-rose-700',
  Draft: 'bg-slate-100 text-slate-600',
  Sent: 'bg-blue-50 text-blue-700',
  Viewed: 'bg-slate-100 text-slate-600',
  Paid: 'bg-emerald-50 text-emerald-700',
  PartiallyPaid: 'bg-amber-50 text-amber-700',
  Overdue: 'bg-amber-100 text-amber-700',
  OnHold: 'bg-blue-50 text-blue-700',
  Completed: 'bg-emerald-50 text-emerald-700',
  Processed: 'bg-orange-50 text-orange-700',
  Locked: 'bg-slate-200 text-slate-700',
};

const StatusBadge = ({ status }) => (
  <span
    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
      statusStyles[status] || 'bg-slate-100 text-slate-600'
    }`}
  >
    {status === 'Overdue' && <AlertTriangle className="w-3.5 h-3.5" />}
    {status}
  </span>
);

export default StatusBadge;
