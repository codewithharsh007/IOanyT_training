// Outlined secondary action button.
const OutlinedButton = ({ children, onClick, type = 'button', isLoading = false, disabled = false, className = '' }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled || isLoading}
    className={`inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 text-slate-700 px-4 py-2 text-sm font-medium hover:bg-slate-50 disabled:opacity-60 ${className}`}
  >
    {isLoading && <span className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></span>}
    {children}
  </button>
);

export default OutlinedButton;
