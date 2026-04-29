// Project detail header.
import StatusBadge from '../common/StatusBadge';
import PrimaryButton from '../common/PrimaryButton';
import OutlinedButton from '../common/OutlinedButton';

const ProjectDetailHeader = ({ project, onEdit, onCreateInvoice }) => (
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">{project.name}</h1>
      <div className="mt-2"><StatusBadge status={project.status} /></div>
    </div>
    <div className="flex items-center gap-3">
      <OutlinedButton onClick={onEdit}>Edit Project</OutlinedButton>
      <PrimaryButton onClick={onCreateInvoice}>Create Invoice</PrimaryButton>
    </div>
  </div>
);

export default ProjectDetailHeader;
