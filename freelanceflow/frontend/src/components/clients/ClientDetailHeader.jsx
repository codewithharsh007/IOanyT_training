// Client detail header.
import StatusBadge from '../common/StatusBadge';
import PrimaryButton from '../common/PrimaryButton';
import OutlinedButton from '../common/OutlinedButton';

const ClientDetailHeader = ({ client, onEdit, onInvite, isInviting = false }) => (
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">{client.name}</h1>
      <div className="mt-2"><StatusBadge status={client.status} /></div>
    </div>
    <div className="flex items-center gap-3">
      <OutlinedButton onClick={onEdit}>Edit Client</OutlinedButton>
      <PrimaryButton onClick={onInvite} isLoading={isInviting}>Invite Client</PrimaryButton>
    </div>
  </div>
);

export default ClientDetailHeader;
