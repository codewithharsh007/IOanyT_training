// Payment status badge section.
import StatusBadge from '../common/StatusBadge';

const PaymentStatusSection = ({ status }) => (
  <div className="flex items-center gap-2">
    <span className="text-sm text-slate-600">Payment Status</span>
    <StatusBadge status={status} />
  </div>
);

export default PaymentStatusSection;
