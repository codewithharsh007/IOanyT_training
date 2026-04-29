// Project summary card.
import CardContainer from '../common/CardContainer';
import StatusBadge from '../common/StatusBadge';
import ProgressBar from '../common/ProgressBar';
import { formatDate } from '../../utils/formatters';

const ProjectCard = ({ project, onClick }) => (
  <CardContainer onClick={onClick}>
    <div className="flex items-start justify-between">
      <div>
        <h4 className="text-base font-semibold text-slate-900">{project.name}</h4>
        <p className="text-sm text-slate-500">{project.clientName || project.clientId}</p>
      </div>
      <StatusBadge status={project.status} />
    </div>
    <div className="mt-4">
      <div className="text-xs text-slate-500 mb-2">Progress</div>
      <ProgressBar percent={project.progressPercent || 0} />
    </div>
    <div className="mt-4 text-sm text-slate-600">Deadline: {formatDate(project.deadline)}</div>
    <div className="mt-3 flex justify-between text-xs text-slate-500">
      <span>{project.invoiceCount || 0} Invoices</span>
      <span>{project.totalHours || 0} Hours</span>
    </div>
  </CardContainer>
);

export default ProjectCard;
