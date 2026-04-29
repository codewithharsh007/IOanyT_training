// Invoices data hook.
import { useCallback, useState } from 'react';
import {
  fetchInvoices,
  createInvoice,
  updateInvoice,
  sendInvoice,
  getInvoiceById,
  recordPayment,
  downloadInvoicePDF,
} from '../services/api';

const useInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadInvoices = useCallback(async (params) => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchInvoices(params);
      setInvoices(data.invoices || []);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to load invoices');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const addInvoice = useCallback(async (payload) => createInvoice(payload), []);
  const editInvoice = useCallback(async (invoiceId, payload) => updateInvoice(invoiceId, payload), []);
  const send = useCallback(async (invoiceId) => sendInvoice(invoiceId), []);
  const getById = useCallback(async (invoiceId) => getInvoiceById(invoiceId), []);
  const addPayment = useCallback(async (invoiceId, payload) => recordPayment(invoiceId, payload), []);
  const downloadPdf = useCallback(async (invoiceId) => downloadInvoicePDF(invoiceId), []);

  return {
    invoices,
    loading,
    error,
    fetchInvoices: loadInvoices,
    createInvoice: addInvoice,
    updateInvoice: editInvoice,
    sendInvoice: send,
    getInvoiceById: getById,
    recordPayment: addPayment,
    downloadInvoicePDF: downloadPdf,
  };
};

export default useInvoices;
