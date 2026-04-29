// Frontend API client wrapper for all backend endpoints.
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getAuthHeader = () => {
  const token = localStorage.getItem('ff_access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const register = async (name, email, password) => {
  const response = await apiClient.post('/auth/register', { name, email, password });
  return response.data.data;
};

export const login = async (email, password) => {
  const response = await apiClient.post('/auth/login', { email, password });
  return response.data.data;
};

export const refreshToken = async (refreshTokenValue) => {
  const response = await apiClient.post('/auth/refresh', { refreshToken: refreshTokenValue });
  return response.data.data;
};

export const logout = async (refreshTokenValue) => {
  const response = await apiClient.post(
    '/auth/logout',
    { refreshToken: refreshTokenValue },
    { headers: getAuthHeader() }
  );
  return response.data.data;
};

export const forgotPassword = async (email) => {
  const response = await apiClient.post('/auth/forgot-password', { email });
  return response.data.data;
};

export const resetPassword = async (token, newPassword) => {
  const response = await apiClient.post('/auth/reset-password', { token, newPassword });
  return response.data.data;
};

export const verifyEmail = async (token) => {
  const response = await apiClient.get(`/auth/verify-email?token=${token}`);
  return response.data.data;
};

export const fetchClients = async (params = {}) => {
  const response = await apiClient.get('/clients', { params, headers: getAuthHeader() });
  return response.data.data;
};

export const createClient = async (payload) => {
  const response = await apiClient.post('/clients', payload, { headers: getAuthHeader() });
  return response.data.data;
};

export const getClientById = async (clientId) => {
  const response = await apiClient.get(`/clients/${clientId}`, { headers: getAuthHeader() });
  return response.data.data;
};

export const updateClient = async (clientId, payload) => {
  const response = await apiClient.put(`/clients/${clientId}`, payload, { headers: getAuthHeader() });
  return response.data.data;
};

export const archiveClient = async (clientId) => {
  const response = await apiClient.patch(`/clients/${clientId}/archive`, {}, { headers: getAuthHeader() });
  return response.data.data;
};

export const unarchiveClient = async (clientId) => {
  const response = await apiClient.patch(`/clients/${clientId}/unarchive`, {}, { headers: getAuthHeader() });
  return response.data.data;
};

export const inviteClient = async (clientId) => {
  const response = await apiClient.post(`/clients/${clientId}/invite`, {}, { headers: getAuthHeader() });
  return response.data.data;
};

export const fetchProjects = async (params = {}) => {
  const response = await apiClient.get('/projects', { params, headers: getAuthHeader() });
  return response.data.data;
};

export const createProject = async (payload) => {
  const response = await apiClient.post('/projects', payload, { headers: getAuthHeader() });
  return response.data.data;
};

export const getProjectById = async (projectId) => {
  const response = await apiClient.get(`/projects/${projectId}`, { headers: getAuthHeader() });
  return response.data.data;
};

export const updateProject = async (projectId, payload) => {
  const response = await apiClient.put(`/projects/${projectId}`, payload, { headers: getAuthHeader() });
  return response.data.data;
};

export const archiveProject = async (projectId) => {
  const response = await apiClient.patch(`/projects/${projectId}/archive`, {}, { headers: getAuthHeader() });
  return response.data.data;
};

export const fetchTimeLogs = async (params = {}) => {
  const response = await apiClient.get('/time-logs', { params, headers: getAuthHeader() });
  return response.data.data;
};

export const createTimeLog = async (payload) => {
  const response = await apiClient.post('/time-logs', payload, { headers: getAuthHeader() });
  return response.data.data;
};

export const updateTimeLog = async (timeLogId, payload) => {
  const response = await apiClient.put(`/time-logs/${timeLogId}`, payload, { headers: getAuthHeader() });
  return response.data.data;
};

export const deleteTimeLog = async (timeLogId) => {
  const response = await apiClient.delete(`/time-logs/${timeLogId}`, { headers: getAuthHeader() });
  return response.data.data;
};

export const fetchInvoices = async (params = {}) => {
  const response = await apiClient.get('/invoices', { params, headers: getAuthHeader() });
  return response.data.data;
};

export const createInvoice = async (payload) => {
  const response = await apiClient.post('/invoices', payload, { headers: getAuthHeader() });
  return response.data.data;
};

export const getInvoiceById = async (invoiceId) => {
  const response = await apiClient.get(`/invoices/${invoiceId}`, { headers: getAuthHeader() });
  return response.data.data;
};

export const updateInvoice = async (invoiceId, payload) => {
  const response = await apiClient.put(`/invoices/${invoiceId}`, payload, { headers: getAuthHeader() });
  return response.data.data;
};

export const sendInvoice = async (invoiceId) => {
  const response = await apiClient.patch(`/invoices/${invoiceId}/send`, {}, { headers: getAuthHeader() });
  return response.data.data;
};

export const downloadInvoicePDF = async (invoiceId) => {
  const response = await apiClient.get(`/invoices/${invoiceId}/pdf`, {
    headers: getAuthHeader(),
    responseType: 'blob',
  });
  return response.data;
};

export const recordPayment = async (invoiceId, payload) => {
  const response = await apiClient.post(`/invoices/${invoiceId}/payments`, payload, {
    headers: getAuthHeader(),
  });
  return response.data.data;
};

export const fetchDashboard = async () => {
  const response = await apiClient.get('/dashboard', { headers: getAuthHeader() });
  return response.data.data;
};

export const fetchAuditLogs = async (params = {}) => {
  const response = await apiClient.get('/audit-logs', { params, headers: getAuthHeader() });
  return response.data.data;
};

export const fetchSettings = async () => {
  const response = await apiClient.get('/settings', { headers: getAuthHeader() });
  return response.data.data;
};

export const updateSettings = async (payload) => {
  const response = await apiClient.put('/settings', payload, { headers: getAuthHeader() });
  return response.data.data;
};

export const fetchPortalInvoices = async () => {
  const response = await apiClient.get('/portal/invoices', { headers: getAuthHeader() });
  return response.data.data;
};

export const fetchPortalInvoiceById = async (invoiceId) => {
  const response = await apiClient.get(`/portal/invoices/${invoiceId}`, { headers: getAuthHeader() });
  return response.data.data;
};

export const fetchPortalProjects = async () => {
  const response = await apiClient.get('/portal/projects', { headers: getAuthHeader() });
  return response.data.data;
};

export default apiClient;
