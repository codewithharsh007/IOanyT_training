// Row action dropdown.
import { useEffect, useRef, useState } from 'react';
import { MoreVertical } from 'lucide-react';

const RowActionDropdown = ({ actions }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
        <button type="button" onClick={() => setIsOpen((prev) => !prev)}>
        <MoreVertical className="w-5 h-5 text-slate-500" />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-200 rounded-lg shadow-lg z-20">
          {actions.map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={() => {
                action.onClick();
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-50 ${
                action.isDangerous ? 'text-rose-600' : 'text-slate-700'
              }`}
            >
              <span className="inline-flex items-center gap-2">
                {action.icon}
                {action.label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default RowActionDropdown;
