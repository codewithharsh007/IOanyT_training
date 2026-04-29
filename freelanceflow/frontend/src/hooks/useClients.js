// Clients data hook.
import { useCallback, useState } from 'react';
import {
  fetchClients,
  createClient,
  updateClient,
  archiveClient,
  unarchiveClient,
  inviteClient,
  getClientById,
} from '../services/api';

const useClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadClients = useCallback(async (params) => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchClients(params);
      setClients(data.clients || []);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to load clients');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const addClient = useCallback(async (payload) => createClient(payload), []);
  const editClient = useCallback(async (clientId, payload) => updateClient(clientId, payload), []);
  const archive = useCallback(async (clientId) => archiveClient(clientId), []);
  const unarchive = useCallback(async (clientId) => unarchiveClient(clientId), []);
  const invite = useCallback(async (clientId) => inviteClient(clientId), []);
  const getById = useCallback(async (clientId) => getClientById(clientId), []);

  return {
    clients,
    loading,
    error,
    fetchClients: loadClients,
    createClient: addClient,
    updateClient: editClient,
    archiveClient: archive,
    unarchiveClient: unarchive,
    inviteClient: invite,
    getClientById: getById,
  };
};

export default useClients;
