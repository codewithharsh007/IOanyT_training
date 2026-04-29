// Client card for mobile view.
import CardContainer from '../common/CardContainer';
import StatusBadge from '../common/StatusBadge';
import RowActionDropdown from '../common/RowActionDropdown';
import { PencilIcon, EnvelopeIcon, ArchiveBoxIcon } from '@heroicons/react/24/outline';

const ClientCardMobile = ({ client, onEdit, onInvite, onArchive }) => (
  <CardContainer className="space-y-3">
    <div className="flex items-center justify-between">
      <div>
        <h4 className="text-base font-semibold text-slate-900">{client.name}</h4>
        <p className="text-sm text-slate-500">{client.company || '-'}</p>
      </div>
      <RowActionDropdown
        actions={[
          { label: 'Edit', icon: <PencilIcon className="w-4 h-4" />, onClick: () => onEdit(client) },
          { label: 'Invite', icon: <EnvelopeIcon className="w-4 h-4" />, onClick: () => onInvite(client) },
          {
            label: 'Archive',
            icon: <ArchiveBoxIcon className="w-4 h-4" />,
            onClick: () => onArchive(client),
            isDangerous: true,
          },
        ]}
      />
    </div>
    <div className="text-sm text-slate-600">
      <div>{client.email}</div>
      <div>{client.phone || '-'}</div>
    </div>
    <StatusBadge status={client.status} />
  </CardContainer>
);

export default ClientCardMobile;
