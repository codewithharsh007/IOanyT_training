// Client detail page.
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import ClientDetailHeader from '../components/clients/ClientDetailHeader';
import ClientInfoCard from '../components/clients/ClientInfoCard';
import ActivitySummaryCard from '../components/clients/ActivitySummaryCard';
import ProjectSummaryCard from '../components/projects/ProjectSummaryCard';
import LinkedInvoicesTable from '../components/projects/LinkedInvoicesTable';
import EmptyStateBlock from '../components/common/EmptyStateBlock';
import useClients from '../hooks/useClients';
import useProjects from '../hooks/useProjects';
import useInvoices from '../hooks/useInvoices';

const ClientDetailPage = () => {
  const { id } = useParams();
  const { getClientById, inviteClient } = useClients();
  const { fetchProjects } = useProjects();
  const { fetchInvoices } = useInvoices();

  const [client, setClient] = useState(null);
  const [projects, setProjects] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviting, setInviting] = useState(false);

  useEffect(() => {
    const loadDetails = async () => {
      setLoading(true);
      const clientData = await getClientById(id);
      setClient(clientData.client || clientData);
      const projectData = await fetchProjects({ clientId: id });
      setProjects(projectData.projects || []);
      const invoiceData = await fetchInvoices({ clientId: id });
      setInvoices(invoiceData.invoices || []);
      setLoading(false);
    };
    loadDetails();
  }, [fetchInvoices, fetchProjects, getClientById, id]);

  const stats = useMemo(() => {
    const totalProjects = projects.length;
    const totalInvoiced = invoices.reduce((sum, invoice) => sum + Number(invoice.totalAmount || 0), 0);
    const totalPaid = 0;
    const outstanding = totalInvoiced - totalPaid;
    return { totalProjects, totalInvoiced, totalPaid, outstanding };
  }, [projects, invoices]);

  if (!client && loading) {
    return (
      <AppLayout>
        <div className="text-slate-600">Loading client details...</div>
      </AppLayout>
    );
  }

  if (!client) {
    return (
      <AppLayout>
        <EmptyStateBlock illustration="client" heading="Client not found" subtext="Return to clients list." />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <ClientDetailHeader
          client={client}
          onEdit={() => {}}
          onInvite={async () => {
            setInviting(true);
            await inviteClient(client._id);
            setInviting(false);
          }}
          isInviting={inviting}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <ClientInfoCard client={client} />
          <ActivitySummaryCard stats={stats} isLoading={loading} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900">Projects</h3>
            {projects.length === 0 ? (
              <EmptyStateBlock
                illustration="project"
                heading="No projects yet"
                subtext="Create a project to start tracking work."
              />
            ) : (
              <div className="grid gap-4">
                {projects.map((project) => (
                  <ProjectSummaryCard key={project._id} project={project} />
                ))}
              </div>
            )}
          </div>
          <div>
            {invoices.length === 0 ? (
              <EmptyStateBlock
                illustration="invoice"
                heading="No invoices yet"
                subtext="Generate your first invoice when ready."
              />
            ) : (
              <LinkedInvoicesTable invoices={invoices} />
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ClientDetailPage;
