// Settings data hook.
import { useCallback, useState } from 'react';
import { fetchSettings, updateSettings } from '../services/api';

const useSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadSettings = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchSettings();
      setSettings(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to load settings');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const saveSettings = useCallback(async (payload) => {
    const data = await updateSettings(payload);
    setSettings(data);
    return data;
  }, []);

  return { settings, loading, error, fetchSettings: loadSettings, updateSettings: saveSettings };
};

export default useSettings;
