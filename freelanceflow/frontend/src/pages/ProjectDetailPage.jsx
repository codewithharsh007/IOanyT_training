// Project detail page.
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import ProjectDetailHeader from '../components/projects/ProjectDetailHeader';
import ProjectOverviewCard from '../components/projects/ProjectOverviewCard';
import ProjectStatsCard from '../components/projects/ProjectStatsCard';
import LinkedInvoicesTable from '../components/projects/LinkedInvoicesTable';
import LinkedTimeLogsTable from '../components/projects/LinkedTimeLogsTable';
import EmptyStateBlock from '../components/common/EmptyStateBlock';
import ProjectCreateModal from '../components/projects/ProjectCreateModal';
import useProjects from '../hooks/useProjects';
import useInvoices from '../hooks/useInvoices';
import useTimeLogs from '../hooks/useTimeLogs';

const ProjectDetailPage = () => {
  const { id } = useParams();
  const { getProjectById } = useProjects();
  const { fetchInvoices } = useInvoices();
  const { fetchTimeLogs } = useTimeLogs();

  const [project, setProject] = useState(null);
  const [stats, setStats] = useState({});
  const [invoices, setInvoices] = useState([]);
  const [timeLogs, setTimeLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    const loadDetails = async () => {
      setLoading(true);
      const projectData = await getProjectById(id);
      setProject(projectData.project || projectData);
      setStats(projectData.stats || {});
      const invoiceData = await fetchInvoices();
      setInvoices((invoiceData.invoices || []).filter((invoice) => invoice.projectId === id));
      const timeLogData = await fetchTimeLogs({ projectId: id });
      setTimeLogs(timeLogData.timeLogs || []);
      setLoading(false);
    };
    loadDetails();
  }, [fetchInvoices, fetchTimeLogs, getProjectById, id]);

  if (loading) {
    return (
      <AppLayout>
        <div className="text-slate-600">Loading project details...</div>
      </AppLayout>
    );
  }

  if (!project) {
    return (
      <AppLayout>
        <EmptyStateBlock illustration="project" heading="Project not found" subtext="Return to projects list." />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <ProjectDetailHeader
          project={project}
          onEdit={() => setIsEditOpen(true)}
          onCreateInvoice={() => {}}
        />

        <div className="grid gap-4 lg:grid-cols-2">
          <ProjectOverviewCard project={{ ...project, progressPercent: stats.progressPercent }} />
          <ProjectStatsCard stats={stats} />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {invoices.length ? (
            <LinkedInvoicesTable invoices={invoices} />
          ) : (
            <EmptyStateBlock
              illustration="invoice"
              heading="No invoices yet"
              subtext="Create an invoice to start billing."
            />
          )}
          {timeLogs.length ? (
            <LinkedTimeLogsTable timeLogs={timeLogs} />
          ) : (
            <EmptyStateBlock
              illustration="clock"
              heading="No time logs"
              subtext="Log time to see work activity here."
            />
          )}
        </div>
      </div>

      <ProjectCreateModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        initialData={project}
        onSuccess={(data) => setProject(data.project || data)}
      />
    </AppLayout>
  );
};

export default ProjectDetailPage;
