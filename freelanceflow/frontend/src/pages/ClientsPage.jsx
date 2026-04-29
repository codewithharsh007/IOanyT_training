// Clients list page.
import { useEffect, useState } from 'react';
import AppLayout from '../components/layout/AppLayout';
import PrimaryButton from '../components/common/PrimaryButton';
import SearchInput from '../components/common/SearchInput';
import EmptyStateBlock from '../components/common/EmptyStateBlock';
import ClientsTable from '../components/clients/ClientsTable';
import ClientCardMobile from '../components/clients/ClientCardMobile';
import ClientAddEditModal from '../components/clients/ClientAddEditModal';
import useClients from '../hooks/useClients';

const ClientsPage = () => {
  const { clients, loading, error, fetchClients, inviteClient, archiveClient } = useClients();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const handleSearch = async (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    await fetchClients({ search: value });
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Clients</h1>
            <p className="text-sm text-slate-600">Manage every client and their contact details.</p>
          </div>
          <PrimaryButton onClick={() => { setEditingClient(null); setIsModalOpen(true); }}>
            Add Client
          </PrimaryButton>
        </div>

        <div className="max-w-sm">
          <SearchInput value={searchTerm} onChange={handleSearch} placeholder="Search clients" />
        </div>

        {error && <div className="text-sm text-red-500">{error}</div>}

        {clients.length === 0 && !loading ? (
          <EmptyStateBlock
            illustration="client"
            heading="No clients yet"
            subtext="Add your first client to start collaborating."
            actionLabel="Add Client"
            onAction={() => { setEditingClient(null); setIsModalOpen(true); }}
          />
        ) : (
          <>
            <div className="hidden lg:block">
              <ClientsTable
                clients={clients}
                onEdit={(client) => { setEditingClient(client); setIsModalOpen(true); }}
                onInvite={(client) => inviteClient(client._id)}
                onArchive={(client) => archiveClient(client._id)}
                isLoading={loading}
              />
            </div>
            <div className="grid gap-4 lg:hidden">
              {clients.map((client) => (
                <ClientCardMobile
                  key={client._id}
                  client={client}
                  onEdit={(item) => { setEditingClient(item); setIsModalOpen(true); }}
                  onInvite={(item) => inviteClient(item._id)}
                  onArchive={(item) => archiveClient(item._id)}
                />
              ))}
            </div>
          </>
        )}

        <ClientAddEditModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => fetchClients({ search: searchTerm })}
          initialData={editingClient}
        />
      </div>
    </AppLayout>
  );
};

export default ClientsPage;
