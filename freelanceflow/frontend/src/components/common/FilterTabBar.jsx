// Filter tab bar.
const FilterTabBar = ({ tabs, activeTab, onChange }) => (
  <div className="flex items-center gap-2 flex-wrap">
    {tabs.map((tab) => (
      <button
        key={tab.value}
        type="button"
        onClick={() => onChange(tab.value)}
        className={`px-4 py-2 rounded-full text-sm font-medium border ${
          activeTab === tab.value
            ? 'bg-blue-600 text-white border-blue-600'
            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
        }`}
      >
        {tab.label}
      </button>
    ))}
  </div>
);

export default FilterTabBar;
