// Dashboard overview page.
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import EarningsBarChart from '../components/dashboard/EarningsBarChart';
import OutstandingInvoicesCard from '../components/dashboard/OutstandingInvoicesCard';
import ActiveProjectsCard from '../components/dashboard/ActiveProjectsCard';
import RecentInvoicesTable from '../components/dashboard/RecentInvoicesTable';
import EmptyStateBlock from '../components/common/EmptyStateBlock';
import useDashboard from '../hooks/useDashboard';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { metrics, loading, error, getMetrics } = useDashboard();

  useEffect(() => {
    getMetrics();
  }, [getMetrics]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-600">Track earnings, outstanding invoices, and active work.</p>
        </div>

        {error && (
          <div className="text-sm text-red-500">{error}</div>
        )}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <OutstandingInvoicesCard
            count={metrics?.outstandingInvoicesCount || 0}
            totalAmount={metrics?.outstandingInvoicesTotal || 0}
            overdueCount={metrics?.overdueCount || 0}
            isLoading={loading}
            onClick={() => navigate('/invoices')}
          />
          <ActiveProjectsCard
            count={metrics?.activeProjectsCount || 0}
            isLoading={loading}
            onClick={() => navigate('/projects')}
          />
          <EarningsBarChart
            earningsByMonth={metrics?.earningsByMonth || []}
            isLoading={loading}
          />
        </div>

        <div>
          {metrics?.recentInvoices?.length ? (
            <RecentInvoicesTable
              invoices={metrics.recentInvoices}
              isLoading={loading}
              onRowClick={(invoice) => navigate(`/invoices?selected=${invoice._id}`)}
            />
          ) : (
            <EmptyStateBlock
              illustration="invoice"
              heading="No invoices yet"
              subtext="Create your first invoice to start tracking payments."
              actionLabel="Create Invoice"
              onAction={() => navigate('/invoices')}
            />
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default DashboardPage;
