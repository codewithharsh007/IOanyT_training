// Invoices workspace page.
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import PrimaryButton from '../components/common/PrimaryButton';
import EmptyStateBlock from '../components/common/EmptyStateBlock';
import InvoiceListTable from '../components/invoices/InvoiceListTable';
import InvoiceDetailPanel from '../components/invoices/InvoiceDetailPanel';
import InvoiceCreateModal from '../components/invoices/InvoiceCreateModal';
import useInvoices from '../hooks/useInvoices';

const InvoicesPage = () => {
  const { invoices, loading, error, fetchInvoices, getInvoiceById, downloadInvoicePDF } = useInvoices();
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [lineItems, setLineItems] = useState([]);
  const [payments, setPayments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  useEffect(() => {
    const selectedId = searchParams.get('selected');
    if (selectedId) {
      handleSelect(selectedId);
    }
  }, [searchParams]);

  const handleSelect = async (invoiceId) => {
    const detail = await getInvoiceById(invoiceId);
    setSelectedInvoice(detail.invoice || detail);
    setLineItems(detail.lineItems || []);
    setPayments(detail.payments || []);
  };

  const handleDownload = async () => {
    if (!selectedInvoice) return;
    setIsDownloading(true);
    const blob = await downloadInvoicePDF(selectedInvoice._id);
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${selectedInvoice.invoiceNumber}.pdf`;
    anchor.click();
    window.URL.revokeObjectURL(url);
    setIsDownloading(false);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Invoices</h1>
            <p className="text-sm text-slate-600">Create and manage invoices for your clients.</p>
          </div>
          <PrimaryButton onClick={() => setIsModalOpen(true)}>Create Invoice</PrimaryButton>
        </div>

        {error && <div className="text-sm text-red-500">{error}</div>}

        {invoices.length === 0 && !loading ? (
          <EmptyStateBlock
            illustration="invoice"
            heading="No invoices yet"
            subtext="Create your first invoice to start billing clients."
            actionLabel="Create Invoice"
            onAction={() => setIsModalOpen(true)}
          />
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <InvoiceListTable
                invoices={invoices}
                selectedId={selectedInvoice?._id}
                onSelect={handleSelect}
                isLoading={loading}
              />
            </div>
            <InvoiceDetailPanel
              invoice={selectedInvoice}
              lineItems={lineItems}
              payments={payments}
              onDownload={handleDownload}
              isDownloading={isDownloading}
            />
          </div>
        )}

        <InvoiceCreateModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={(data) => {
            fetchInvoices();
            if (data?.invoice) handleSelect(data.invoice._id);
          }}
        />
      </div>
    </AppLayout>
  );
};

export default InvoicesPage;
