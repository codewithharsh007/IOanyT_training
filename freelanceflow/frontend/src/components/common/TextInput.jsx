// Labeled text input.
const TextInput = ({ label, name, value, onChange, placeholder = '', error = '', disabled = false, type = 'text', prefix }) => (
  <div className="flex flex-col gap-1">
    <label htmlFor={name} className="text-sm font-medium text-slate-700">
      {label}
    </label>
    <div className="relative">
      {prefix && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">{prefix}</span>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          prefix ? 'pl-7' : ''
        } ${error ? 'border-red-400' : 'border-slate-200'} ${disabled ? 'bg-slate-100' : 'bg-white'}`}
      />
    </div>
    {error && <span className="text-xs text-red-500">{error}</span>}
  </div>
);

export default TextInput;
