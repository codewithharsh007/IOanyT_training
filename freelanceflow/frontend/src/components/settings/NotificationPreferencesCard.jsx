// Notification preferences card.
import CardContainer from '../common/CardContainer';
import ToggleSwitch from '../common/ToggleSwitch';
import PrimaryButton from '../common/PrimaryButton';

const NotificationPreferencesCard = ({ preferences, onChange, onSave, isSaving }) => (
  <CardContainer>
    <h3 className="text-sm font-semibold text-slate-900 mb-4">Notification Preferences</h3>
    <div className="space-y-4">
      <ToggleSwitch
        label="Email on invoice view"
        checked={preferences.emailOnInvoiceView}
        onChange={(value) => onChange({ ...preferences, emailOnInvoiceView: value })}
      />
      <ToggleSwitch
        label="Email on payment received"
        checked={preferences.emailOnPaymentReceived}
        onChange={(value) => onChange({ ...preferences, emailOnPaymentReceived: value })}
      />
      <ToggleSwitch
        label="Overdue invoice alerts"
        checked={preferences.overdueInvoiceAlerts}
        onChange={(value) => onChange({ ...preferences, overdueInvoiceAlerts: value })}
      />
      <ToggleSwitch
        label="Email on time log updates"
        checked={preferences.emailOnTimeLogs}
        onChange={(value) => onChange({ ...preferences, emailOnTimeLogs: value })}
      />
      <div className="flex justify-end">
        <PrimaryButton onClick={onSave} isLoading={isSaving}>Save Preferences</PrimaryButton>
      </div>
    </div>
  </CardContainer>
);

export default NotificationPreferencesCard;
