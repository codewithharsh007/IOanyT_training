// Time logs tracking page.
import { useEffect, useState } from 'react';
import AppLayout from '../components/layout/AppLayout';
import PrimaryButton from '../components/common/PrimaryButton';
import EmptyStateBlock from '../components/common/EmptyStateBlock';
import TimeLogsSummaryBar from '../components/timeLogs/TimeLogsSummaryBar';
import TimeLogsTable from '../components/timeLogs/TimeLogsTable';
import TimeLogCardMobile from '../components/timeLogs/TimeLogCardMobile';
import TimeLogModal from '../components/timeLogs/TimeLogModal';
import useTimeLogs from '../hooks/useTimeLogs';

const TimeLogsPage = () => {
  const { timeLogs, loading, error, fetchTimeLogs } = useTimeLogs();
  const [summary, setSummary] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadLogs = async () => {
      const data = await fetchTimeLogs();
      const totalHours = data.totalHours || 0;
      const billableHours = data.billableHours || 0;
      const nonBillableHours = totalHours - billableHours;
      const weekHours = (data.timeLogs || []).reduce((sum, log) => {
        const logDate = new Date(log.date);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        if (logDate >= weekAgo) {
          return sum + log.hours + log.minutes / 60;
        }
        return sum;
      }, 0);
      setSummary({ totalHours, billableHours, nonBillableHours, weekHours: Math.round(weekHours) });
    };
    loadLogs();
  }, [fetchTimeLogs]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Time Logs</h1>
            <p className="text-sm text-slate-600">Track billable and non-billable work.</p>
          </div>
          <PrimaryButton onClick={() => setIsModalOpen(true)}>Log Time</PrimaryButton>
        </div>

        <TimeLogsSummaryBar summary={summary} />

        {error && <div className="text-sm text-red-500">{error}</div>}

        {timeLogs.length === 0 && !loading ? (
          <EmptyStateBlock
            illustration="clock"
            heading="No time logs yet"
            subtext="Log time to monitor billable hours."
            actionLabel="Log Time"
            onAction={() => setIsModalOpen(true)}
          />
        ) : (
          <>
            <div className="hidden lg:block">
              <TimeLogsTable timeLogs={timeLogs} isLoading={loading} />
            </div>
            <div className="grid gap-4 lg:hidden">
              {timeLogs.map((log) => (
                <TimeLogCardMobile key={log._id} log={log} />
              ))}
            </div>
          </>
        )}

        <TimeLogModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => fetchTimeLogs()}
        />
      </div>
    </AppLayout>
  );
};

export default TimeLogsPage;
