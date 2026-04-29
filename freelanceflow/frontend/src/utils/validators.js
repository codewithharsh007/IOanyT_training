// Simple validators for form inputs.
export const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());

export const isNonEmpty = (value) => String(value || '').trim().length > 0;
