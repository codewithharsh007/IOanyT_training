// Project overview card.
import CardContainer from '../common/CardContainer';
import ProgressBar from '../common/ProgressBar';
import { formatDate, formatCurrency } from '../../utils/formatters';

const ProjectOverviewCard = ({ project }) => (
  <CardContainer>
    <h3 className="text-sm font-semibold text-slate-900 mb-4">Project Overview</h3>
    <p className="text-sm text-slate-600 mb-4">{project.description || 'No description provided.'}</p>
    <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
      <div>
        <div className="text-xs uppercase">Start Date</div>
        <div className="text-slate-900 font-medium">{formatDate(project.startDate)}</div>
      </div>
      <div>
        <div className="text-xs uppercase">Deadline</div>
        <div className="text-slate-900 font-medium">{formatDate(project.deadline)}</div>
      </div>
      <div>
        <div className="text-xs uppercase">Budget</div>
        <div className="text-slate-900 font-medium">{formatCurrency(project.budget)}</div>
      </div>
      <div>
        <div className="text-xs uppercase">Hourly Rate</div>
        <div className="text-slate-900 font-medium">{formatCurrency(project.hourlyRate)}</div>
      </div>
    </div>
    <div className="mt-4">
      <ProgressBar percent={project.progressPercent || 0} />
    </div>
  </CardContainer>
);

export default ProjectOverviewCard;
