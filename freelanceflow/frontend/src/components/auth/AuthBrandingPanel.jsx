// Auth page branding panel.
import BrandMark from '../common/BrandMark';

const AuthBrandingPanel = () => (
  <div className="hidden lg:flex flex-col justify-center items-start bg-linear-to-br from-white via-blue-50 to-sky-100 px-16 py-12 min-h-screen border-r border-slate-200">
    <BrandMark className="w-16 h-16 mb-8" />
    <h2 className="text-4xl font-semibold tracking-tight text-slate-900 max-w-md leading-tight">
      Streamline your freelance business
    </h2>
    <p className="text-slate-600 mt-4 text-lg max-w-md leading-7">
      Manage clients, projects, and invoices with a clean, focused workflow.
    </p>
  </div>
);

export default AuthBrandingPanel;
