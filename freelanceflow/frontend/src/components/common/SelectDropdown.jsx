// Single-select dropdown.
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const SelectDropdown = ({
  label = '',
  options,
  value,
  onChange,
  placeholder = 'Select...',
  error = '',
  disabled = false,
  searchable = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedOption = options.find((option) => option.value === value);
  const filteredOptions = searchable
    ? options.filter((option) => option.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : options;

  return (
    <div className="flex flex-col gap-1 relative">
      {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between rounded-lg border px-3 py-2 text-sm ${
          error ? 'border-red-400' : 'border-slate-200'
        } ${disabled ? 'bg-slate-100 text-slate-400' : 'bg-white text-slate-700'}`}
      >
        {selectedOption ? selectedOption.label : placeholder}
        <ChevronDown className="w-4 h-4" />
      </button>
      {isOpen && !disabled && (
        <div className="absolute top-full mt-2 w-full bg-white border border-slate-200 rounded-lg shadow-lg z-20">
          {searchable && (
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search..."
              className="w-full px-3 py-2 text-sm border-b border-slate-200"
            />
          )}
          <ul className="max-h-48 overflow-auto">
            {filteredOptions.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50"
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};

export default SelectDropdown;
