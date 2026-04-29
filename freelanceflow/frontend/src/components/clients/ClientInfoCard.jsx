// Client info card.
import CardContainer from '../common/CardContainer';
import { EnvelopeIcon, PhoneIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

const ClientInfoCard = ({ client }) => (
  <CardContainer>
    <h3 className="text-sm font-semibold text-slate-900 mb-4">Client Info</h3>
    <div className="space-y-3 text-sm text-slate-600">
      <div className="flex items-center gap-2">
        <EnvelopeIcon className="w-4 h-4" />
        {client.email}
      </div>
      <div className="flex items-center gap-2">
        <PhoneIcon className="w-4 h-4" />
        {client.phone || '-'}
      </div>
      <div className="flex items-center gap-2">
        <BuildingOfficeIcon className="w-4 h-4" />
        {client.company || '-'}
      </div>
    </div>
  </CardContainer>
);

export default ClientInfoCard;
