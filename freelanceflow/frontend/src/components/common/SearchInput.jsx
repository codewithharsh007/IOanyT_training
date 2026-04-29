// Search input with icon.
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const SearchInput = ({ value, onChange, placeholder = 'Search' }) => (
  <div className="relative">
    <MagnifyingGlassIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full rounded-lg border border-slate-200 px-9 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

export default SearchInput;
