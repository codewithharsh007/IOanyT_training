// Earnings bar chart card.
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import CardContainer from '../common/CardContainer';
import SelectDropdown from '../common/SelectDropdown';
import LoadingSkeleton from '../common/LoadingSkeleton';

const EarningsBarChart = ({ earningsByMonth, isLoading = false }) => {
  if (isLoading) {
    return <LoadingSkeleton variant="card" />;
  }

  return (
    <CardContainer>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-900">Total Earnings (This Month)</h3>
        <SelectDropdown
          options={[{ value: 'all', label: 'All terms' }]}
          value="all"
          onChange={() => {}}
        />
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={earningsByMonth}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" fill="#2563eb" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </CardContainer>
  );
};

export default EarningsBarChart;
