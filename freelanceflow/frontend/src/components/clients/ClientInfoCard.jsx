// Client info card.
import CardContainer from '../common/CardContainer';
import { Mail, Phone, Building } from 'lucide-react';

const ClientInfoCard = ({ client }) => (
  <CardContainer>
    <h3 className="text-sm font-semibold text-slate-900 mb-4">Client Info</h3>
    <div className="space-y-3 text-sm text-slate-600">
      <div className="flex items-center gap-2">
        <Mail className="w-4 h-4" />
        {client.email}
      </div>
      <div className="flex items-center gap-2">
        <Phone className="w-4 h-4" />
        {client.phone || '-'}
      </div>
      <div className="flex items-center gap-2">
        <Building className="w-4 h-4" />
        {client.company || '-'}
      </div>
    </div>
  </CardContainer>
);

export default ClientInfoCard;
