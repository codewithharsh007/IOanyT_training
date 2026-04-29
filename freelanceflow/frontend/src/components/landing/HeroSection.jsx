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
    <div className="relative">
      <div className="mx-auto max-w-xl rounded-4xl bg-slate-900 p-3 shadow-2xl shadow-blue-100/60">
        <div className="rounded-[1.6rem] bg-white overflow-hidden border border-slate-200">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-200 bg-slate-50/80">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
          </div>
          <div className="grid grid-cols-[1fr_2fr] min-h-80">
            <div className="bg-slate-50 border-r border-slate-200 p-4 space-y-3">
              <div className="h-4 w-20 rounded bg-slate-200"></div>
              <div className="h-3 w-16 rounded bg-slate-200"></div>
              <div className="h-3 w-14 rounded bg-slate-200"></div>
              <div className="h-3 w-16 rounded bg-slate-200"></div>
              <div className="mt-6 space-y-2">
                <div className="h-8 rounded-lg bg-blue-100"></div>
                <div className="h-8 rounded-lg bg-slate-100"></div>
                <div className="h-8 rounded-lg bg-slate-100"></div>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-slate-200 p-3">
                  <div className="h-3 w-16 rounded bg-slate-200"></div>
                  <div className="mt-3 h-6 w-16 rounded bg-slate-300"></div>
                </div>
                <div className="rounded-xl border border-slate-200 p-3">
                  <div className="h-3 w-20 rounded bg-slate-200"></div>
                  <div className="mt-3 h-6 w-14 rounded bg-slate-300"></div>
                </div>
                <div className="rounded-xl border border-slate-200 p-3">
                  <div className="h-3 w-16 rounded bg-slate-200"></div>
                  <div className="mt-3 h-6 w-18 rounded bg-slate-300"></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-200 p-3 space-y-2">
                  <div className="h-3 w-24 rounded bg-slate-200"></div>
                  <div className="h-28 rounded-lg bg-linear-to-t from-blue-100 to-blue-300"></div>
                </div>
                <div className="rounded-xl border border-slate-200 p-3 space-y-2">
                  <div className="h-3 w-24 rounded bg-slate-200"></div>
                  <div className="h-28 rounded-lg bg-slate-100"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;
