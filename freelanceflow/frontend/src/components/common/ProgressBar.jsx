// Progress bar component.
const ProgressBar = ({ percent, showLabel = true }) => (
  <div className="w-full">
    {showLabel && <div className="text-xs text-slate-600 mb-1">{percent}%</div>}
    <progress
      value={Math.min(percent, 100)}
      max="100"
      className="w-full h-2 rounded-full bg-slate-200 [&::-webkit-progress-bar]:bg-slate-200 [&::-webkit-progress-value]:bg-blue-600 [&::-moz-progress-bar]:bg-blue-600"
    ></progress>
  </div>
);

export default ProgressBar;
