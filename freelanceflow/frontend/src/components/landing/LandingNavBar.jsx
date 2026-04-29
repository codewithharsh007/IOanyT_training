// Landing page navigation bar.
import { Link } from 'react-router-dom';
import PrimaryButton from '../common/PrimaryButton';
import BrandMark from '../common/BrandMark';

const LandingNavBar = () => (
  <header className="w-full bg-white/80 backdrop-blur border-b border-slate-200">
    <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <BrandMark className="w-8 h-8" />
        <span className="text-lg font-semibold text-slate-900">FreelanceFlow</span>
      </div>
      <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600">
        <a href="#features" className="hover:text-slate-900">Features</a>
        <a href="#pricing" className="hover:text-slate-900">Pricing</a>
      </nav>
      <Link to="/login">
        <PrimaryButton>Log In</PrimaryButton>
      </Link>
    </div>
  </header>
);

export default LandingNavBar;
