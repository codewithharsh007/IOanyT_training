// Dashboard project summary card.
import CardContainer from '../common/CardContainer';
import StatusBadge from '../common/StatusBadge';
import { formatCurrency } from '../../utils/formatters';

const ProjectSummaryCard = ({ project, onClick, isSelected = false }) => (
  <CardContainer onClick={onClick} isSelected={isSelected}>
    <div className="flex items-start justify-between">
      <div>
        <h4 className="text-base font-semibold text-slate-900">{project.name}</h4>
        <p className="text-sm text-slate-500">{project.clientName || project.clientId}</p>
      </div>
      <StatusBadge status={project.status} />
    </div>
    <p className="text-sm text-slate-600 mt-3">{project.description || 'No description provided.'}</p>
    {isSelected && (
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-slate-600">
        <div>
          <div className="text-xs uppercase">Total hours logged</div>
          <div className="text-base font-semibold text-slate-900">{project.totalHours || 0}</div>
        </div>
        <div>
          <div className="text-xs uppercase">Total billed</div>
          <div className="text-base font-semibold text-slate-900">
            {formatCurrency(project.totalBilled || 0)}
          </div>
        </div>
      </div>
    )}
  </CardContainer>
);

export default ProjectSummaryCard;
