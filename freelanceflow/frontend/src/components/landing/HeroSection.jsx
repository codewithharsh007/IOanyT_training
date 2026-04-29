// Landing hero section.
import { Link } from 'react-router-dom';
import PrimaryButton from '../common/PrimaryButton';

const HeroSection = () => (
  <section className="max-w-6xl mx-auto px-4 py-16 grid lg:grid-cols-2 gap-10 items-center">
    <div>
      <h1 className="text-4xl md:text-5xl font-semibold text-slate-900 leading-tight">
        The simplest client & invoice portal for modern freelancers.
      </h1>
      <p className="mt-4 text-slate-600">
        Streamline client work, time tracking, and invoicing in one clean workspace.
      </p>
      <div className="mt-6">
        <Link to="/signup">
          <PrimaryButton className="px-6">Start managing better</PrimaryButton>
        </Link>
      </div>
    </div>
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
      <div className="h-56 bg-slate-100 rounded-xl"></div>
      {/* NOTE: visible in design image but not in frontend-structure.md — skipped */}
    </div>
  </section>
);

export default HeroSection;
