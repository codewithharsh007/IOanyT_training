// Primary action button.
const PrimaryButton = ({ children, onClick, type = 'button', isLoading = false, disabled = false, className = '' }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled || isLoading}
    className={`inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 text-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-blue-700 disabled:opacity-60 ${className}`}
  >
    {isLoading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
    {children}
  </button>
);

export default PrimaryButton;
