// Empty state block with illustration.
import PrimaryButton from './PrimaryButton';

const illustrationMap = {
  clock: '🕒',
  compass: '🧭',
  invoice: '📄',
  client: '👥',
  project: '📁',
};

const EmptyStateBlock = ({ illustration, heading, subtext = '', actionLabel = '', onAction }) => (
  <div className="flex flex-col items-center text-center gap-3 py-10">
    <div className="text-4xl">{illustrationMap[illustration] || '📦'}</div>
    <h3 className="text-lg font-semibold text-slate-900">{heading}</h3>
    {subtext && <p className="text-sm text-slate-600 max-w-sm">{subtext}</p>}
    {actionLabel && <PrimaryButton onClick={onAction}>{actionLabel}</PrimaryButton>}
  </div>
);

export default EmptyStateBlock;
