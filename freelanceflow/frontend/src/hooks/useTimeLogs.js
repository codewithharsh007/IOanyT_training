// Time logs data hook.
import { useCallback, useState } from 'react';
import { fetchTimeLogs, createTimeLog, updateTimeLog, deleteTimeLog } from '../services/api';

const useTimeLogs = () => {
  const [timeLogs, setTimeLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadTimeLogs = useCallback(async (params) => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchTimeLogs(params);
      setTimeLogs(data.timeLogs || []);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to load time logs');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const addTimeLog = useCallback(async (payload) => createTimeLog(payload), []);
  const editTimeLog = useCallback(async (timeLogId, payload) => updateTimeLog(timeLogId, payload), []);
  const removeTimeLog = useCallback(async (timeLogId) => deleteTimeLog(timeLogId), []);

  return {
    timeLogs,
    loading,
    error,
    fetchTimeLogs: loadTimeLogs,
    addTimeLog,
    editTimeLog,
    removeTimeLog,
  };
};

export default useTimeLogs;
