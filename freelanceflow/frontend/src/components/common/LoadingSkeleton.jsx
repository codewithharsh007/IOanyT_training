// Loading skeleton placeholders.
const LoadingSkeleton = ({ variant, rows = 5, cols = 3 }) => {
  if (variant === 'card') {
    return <div className="h-24 bg-slate-100 rounded-lg animate-pulse" />;
  }

  if (variant === 'cardGrid') {
    return (
      <div className={`grid gap-4 grid-cols-1 md:grid-cols-${cols}`}>
        {Array.from({ length: cols }).map((_, index) => (
          <div key={index} className="h-32 bg-slate-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (variant === 'detail') {
    return <div className="h-64 bg-slate-100 rounded-lg animate-pulse" />;
  }

  if (variant === 'form') {
    return <div className="h-40 bg-slate-100 rounded-lg animate-pulse" />;
  }

  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="h-4 bg-slate-100 rounded-lg animate-pulse" />
      ))}
    </div>
  );
};

export default LoadingSkeleton;
