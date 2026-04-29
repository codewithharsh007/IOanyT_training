// Dashboard data hook.
import { useCallback, useState } from 'react';
import { fetchDashboard } from '../services/api';

const useDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getMetrics = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchDashboard();
      setMetrics(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to load dashboard');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { metrics, loading, error, getMetrics };
};

export default useDashboard;
