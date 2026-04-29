// Formatting helpers for UI display.
import { format } from 'date-fns';

export const formatCurrency = (value) => {
  const numberValue = Number(value || 0);
  return numberValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

export const formatDate = (value) => {
  if (!value) return '';
  return format(new Date(value), 'MMM dd, yyyy');
};
