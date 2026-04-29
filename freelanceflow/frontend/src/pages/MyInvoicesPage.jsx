// Personal invoices page.
import { useEffect } from 'react';
import AppLayout from '../components/layout/AppLayout';
import InvoiceCard from '../components/invoices/InvoiceCard';
import EmptyStateBlock from '../components/common/EmptyStateBlock';
import useInvoices from '../hooks/useInvoices';

const MyInvoicesPage = () => {
  const { invoices, loading, error, fetchInvoices } = useInvoices();

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">My Invoices</h1>
          <p className="text-sm text-slate-600">Track the invoices you&apos;ve issued.</p>
        </div>

        {error && <div className="text-sm text-red-500">{error}</div>}

        {invoices.length === 0 && !loading ? (
          <EmptyStateBlock
            illustration="invoice"
            heading="No invoices yet"
            subtext="Invoices you create will show up here."
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {invoices.map((invoice) => (
              <InvoiceCard key={invoice._id} invoice={invoice} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default MyInvoicesPage;
