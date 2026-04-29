// Toggle switch component.
const ToggleSwitch = ({ checked, onChange, label = '', disabled = false }) => (
  <label className="flex items-center justify-between gap-4 cursor-pointer">
    <span className="text-sm text-slate-700">{label}</span>
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`w-11 h-6 rounded-full flex items-center px-1 transition ${
        checked ? 'bg-blue-600' : 'bg-slate-300'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <span
        className={`w-4 h-4 bg-white rounded-full transition transform ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      ></span>
    </button>
  </label>
);

export default ToggleSwitch;
