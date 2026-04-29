// Clients table for desktop.
import StatusBadge from '../common/StatusBadge';
import RowActionDropdown from '../common/RowActionDropdown';
import LoadingSkeleton from '../common/LoadingSkeleton';
import { Pencil, Mail, Archive } from 'lucide-react';

const ClientsTable = ({ clients, onEdit, onInvite, onArchive, isLoading = false }) => {
  if (isLoading) {
    return <LoadingSkeleton variant="table" rows={5} />;
  }

  return (
    <div className="overflow-auto">
      <table className="w-full text-sm">
        <thead className="text-slate-500">
          <tr>
            <th className="text-left py-2">Client Name</th>
            <th className="text-left py-2">Company</th>
            <th className="text-left py-2">Email</th>
            <th className="text-left py-2">Phone</th>
            <th className="text-left py-2">Status</th>
            <th className="text-right py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client._id} className="border-t border-slate-100">
              <td className="py-2 font-medium text-slate-800">{client.name}</td>
              <td className="py-2 text-slate-600">{client.company || '-'}</td>
              <td className="py-2 text-slate-600">{client.email}</td>
              <td className="py-2 text-slate-600">{client.phone || '-'}</td>
              <td className="py-2"><StatusBadge status={client.status} /></td>
              <td className="py-2 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
                    onClick={() => onEdit(client)}
                  >
                    <Pencil className="w-4 h-4" />
                    Edit
                  </button>
                  <RowActionDropdown
                    actions={[
                      { label: 'Invite', icon: <Mail className="w-4 h-4" />, onClick: () => onInvite(client) },
                      {
                        label: 'Archive',
                        icon: <Archive className="w-4 h-4" />,
                        onClick: () => onArchive(client),
                        isDangerous: true,
                      },
                    ]}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientsTable;
