// Settings page.
import { useEffect, useState } from 'react';
import AppLayout from '../components/layout/AppLayout';
import ProfileSettingsCard from '../components/settings/ProfileSettingsCard';
import NotificationPreferencesCard from '../components/settings/NotificationPreferencesCard';
import useSettings from '../hooks/useSettings';

const SettingsPage = () => {
  const { settings, loading, error, fetchSettings, updateSettings } = useSettings();
  const [profile, setProfile] = useState({ name: '', email: '', company: '' });
  const [notifications, setNotifications] = useState({
    emailOnInvoiceView: false,
    emailOnPaymentReceived: false,
    overdueInvoiceAlerts: false,
    emailOnTimeLogs: false,
  });

  useEffect(() => {
    const loadSettings = async () => {
      const data = await fetchSettings();
      setProfile(data.profile);
      setNotifications({
        emailOnInvoiceView: data.notifications?.emailOnInvoiceView ?? false,
        emailOnPaymentReceived: data.notifications?.emailOnPaymentReceived ?? false,
        overdueInvoiceAlerts: data.notifications?.overdueInvoiceAlerts ?? false,
        emailOnTimeLogs: data.notifications?.emailOnTimeLogs ?? false,
      });
    };
    loadSettings();
  }, [fetchSettings]);

  const handleSaveProfile = async () => {
    await updateSettings({ name: profile.name, company: profile.company });
  };

  const handleSaveNotifications = async () => {
    await updateSettings({ notifications });
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Settings</h1>
          <p className="text-sm text-slate-600">Manage your profile and notifications.</p>
        </div>

        {error && <div className="text-sm text-red-500">{error}</div>}
        {loading && <div className="text-sm text-slate-500">Loading settings...</div>}

        <div className="grid gap-4 lg:grid-cols-2">
          <ProfileSettingsCard
            profile={profile}
            onChange={setProfile}
            onSave={handleSaveProfile}
            isSaving={loading}
          />
          <NotificationPreferencesCard
            preferences={notifications}
            onChange={setNotifications}
            onSave={handleSaveNotifications}
            isSaving={loading}
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default SettingsPage;
