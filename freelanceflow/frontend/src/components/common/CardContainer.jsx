// Card container wrapper.
const CardContainer = ({ children, className = '', onClick, isSelected = false }) => (
  <div
    role={onClick ? 'button' : undefined}
    onClick={onClick}
    className={`bg-white rounded-xl border ${isSelected ? 'border-blue-500' : 'border-slate-200'} shadow-sm p-5 ${
      onClick ? 'cursor-pointer hover:shadow-md transition' : ''
    } ${className}`}
  >
    {children}
  </div>
);

export default CardContainer;
