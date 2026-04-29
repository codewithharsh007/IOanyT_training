// Time log create/edit modal.
import { useEffect, useState } from 'react';
import Modal from '../common/Modal';
import SelectDropdown from '../common/SelectDropdown';
import DatePickerInput from '../common/DatePickerInput';
import TextInput from '../common/TextInput';
import Textarea from '../common/Textarea';
import PrimaryButton from '../common/PrimaryButton';
import OutlinedButton from '../common/OutlinedButton';
import { createTimeLog, updateTimeLog, fetchProjects } from '../../services/api';

const TimeLogModal = ({ isOpen, onClose, onSuccess, initialData, preselectedProjectId }) => {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({
    projectId: preselectedProjectId || '',
    date: '',
    hours: 1,
    minutes: 0,
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProjects = async () => {
      const data = await fetchProjects();
      setProjects(data.projects || []);
    };
    if (isOpen) loadProjects();
  }, [isOpen]);

  useEffect(() => {
    if (initialData) {
      setForm({
        projectId: initialData.projectId || '',
        date: initialData.date ? initialData.date.slice(0, 10) : '',
        hours: initialData.hours || 0,
        minutes: initialData.minutes || 0,
        description: initialData.description || '',
      });
    }
  }, [initialData]);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const payload = {
        projectId: form.projectId,
        date: form.date,
        hours: Number(form.hours),
        minutes: Number(form.minutes),
        description: form.description,
      };
      const data = initialData
        ? await updateTimeLog(initialData._id, payload)
        : await createTimeLog(payload);
      onSuccess?.(data);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save time log');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Time Log' : 'Log Time'}
      footer={
        <div className="flex justify-end gap-3">
          <OutlinedButton onClick={onClose}>Cancel</OutlinedButton>
          <PrimaryButton onClick={handleSubmit} isLoading={loading}>
            {initialData ? 'Save Changes' : 'Create Time Log'}
          </PrimaryButton>
        </div>
      }
    >
      <div className="space-y-4">
        <SelectDropdown
          label="Project"
          options={projects.map((project) => ({ value: project._id, label: project.name }))}
          value={form.projectId}
          onChange={(value) => setForm((prev) => ({ ...prev, projectId: value }))}
          placeholder="Select a project"
        />
        <DatePickerInput
          label="Date"
          name="date"
          value={form.date}
          onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
        />
        <div className="grid grid-cols-2 gap-4">
          <TextInput
            label="Hours"
            name="hours"
            value={form.hours}
            onChange={(e) => setForm((prev) => ({ ...prev, hours: e.target.value }))}
          />
          <TextInput
            label="Minutes"
            name="minutes"
            value={form.minutes}
            onChange={(e) => setForm((prev) => ({ ...prev, minutes: e.target.value }))}
          />
        </div>
        <Textarea
          label="Description"
          name="description"
          value={form.description}
          onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    </Modal>
  );
};

export default TimeLogModal;
