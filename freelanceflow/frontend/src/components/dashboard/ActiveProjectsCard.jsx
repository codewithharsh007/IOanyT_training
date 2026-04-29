// Active projects summary card.
import { Users } from 'lucide-react';
import CardContainer from '../common/CardContainer';
import LoadingSkeleton from '../common/LoadingSkeleton';

const ActiveProjectsCard = ({ count, isLoading = false, onClick }) => {
  if (isLoading) {
    return <LoadingSkeleton variant="card" />;
  }

  return (
    <CardContainer onClick={onClick}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">Active Projects</h3>
        <Users className="w-5 h-5 text-slate-400" />
      </div>
      <div className="mt-4 text-3xl font-semibold text-slate-900">{count}</div>
    </CardContainer>
  );
};

export default ActiveProjectsCard;
