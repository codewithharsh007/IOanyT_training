// Shared FreelanceFlow brand mark.
const BrandMark = ({ className = '' }) => (
  <div
    className={`inline-flex items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-sky-400 text-white shadow-sm ${className}`}
    aria-hidden="true"
  >
    <span className="text-[0.78rem] font-extrabold tracking-tight leading-none">FF</span>
  </div>
);

export default BrandMark;
