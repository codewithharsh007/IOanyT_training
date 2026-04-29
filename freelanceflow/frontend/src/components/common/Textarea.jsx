// Labeled textarea input.
const Textarea = ({ label, name, value, onChange, placeholder = '', rows = 4, error = '' }) => (
  <div className="flex flex-col gap-1">
    <label htmlFor={name} className="text-sm font-medium text-slate-700">
      {label}
    </label>
    <textarea
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        error ? 'border-red-400' : 'border-slate-200'
      }`}
    />
    {error && <span className="text-xs text-red-500">{error}</span>}
  </div>
);

export default Textarea;
