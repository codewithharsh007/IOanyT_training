// Landing feature cards row.
const features = [
  {
    title: 'Manage Clients & Projects',
    description: 'Keep every client and project organized in one place.',
  },
  {
    title: 'Track Time Effortlessly',
    description: 'Log work fast and bill accurately with clear logs.',
  },
  {
    title: 'Professional Invoicing',
    description: 'Send polished invoices and track payment status.',
  },
];

import { Users, Clock, FileText } from 'lucide-react';

const FeatureCardsRow = () => (
  <section id="features" className="max-w-6xl mx-auto px-4 pb-16">
    <div className="grid md:grid-cols-3 gap-6">
      {features.map((feature) => (
        <div key={feature.title} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-blue-50 mb-4 flex items-center justify-center">
            {feature.title.includes('Clients') && <Users className="w-5 h-5 text-blue-600" />}
            {feature.title.includes('Time') && <Clock className="w-5 h-5 text-blue-600" />}
            {feature.title.includes('Invoicing') && <FileText className="w-5 h-5 text-blue-600" />}
          </div>
          <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
          <p className="text-sm text-slate-600 mt-2">{feature.description}</p>
        </div>
      ))}
    </div>
  </section>
);

export default FeatureCardsRow;
