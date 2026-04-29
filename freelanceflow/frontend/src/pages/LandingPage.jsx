// Marketing landing page.
import PublicLayout from "../components/layout/PublicLayout";
import LandingNavBar from "../components/landing/LandingNavBar";
import HeroSection from "../components/landing/HeroSection";
import FeatureCardsRow from "../components/landing/FeatureCardsRow";
import PrimaryButton from "../components/common/PrimaryButton";
7;
import { Link } from "react-router-dom";

const LandingPage = () => (
  <PublicLayout>
    <LandingNavBar />
    <HeroSection />
    <FeatureCardsRow />
    <section id="pricing" className="max-w-6xl mx-auto px-4 pb-20">
      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Simple pricing that grows with you
            </h2>
            <p className="text-slate-600 mt-2">
              Start free, upgrade when you&apos;re ready to scale your freelance
              business.
            </p>
          </div>
          <div>
            <Link to="/signup">
              <PrimaryButton className="px-6">Start for free</PrimaryButton>
            </Link>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          {[
            { name: "Starter", price: "$0", note: "Up to 3 active clients" },
            {
              name: "Solo Pro",
              price: "$12",
              note: "Unlimited clients & invoices",
            },
            {
              name: "Studio",
              price: "$24",
              note: "Team seats + advanced analytics",
            },
          ].map((plan) => (
            <div
              key={plan.name}
              className="border border-slate-200 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-slate-900">
                {plan.name}
              </h3>
              <p className="text-3xl font-semibold text-slate-900 mt-3">
                {plan.price}
              </p>
              <p className="text-sm text-slate-600 mt-2">{plan.note}</p>
              <button
                type="button"
                className="mt-4 w-full border border-slate-200 rounded-lg py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                Choose plan
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  </PublicLayout>
);

export default LandingPage;
