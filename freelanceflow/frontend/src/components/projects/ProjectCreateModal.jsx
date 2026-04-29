// Project create/edit modal.
import { useEffect, useState } from 'react';
import Modal from '../common/Modal';
import TextInput from '../common/TextInput';
import SelectDropdown from '../common/SelectDropdown';
import DatePickerInput from '../common/DatePickerInput';
import Textarea from '../common/Textarea';
import PrimaryButton from '../common/PrimaryButton';
import OutlinedButton from '../common/OutlinedButton';
import { createProject, updateProject, fetchClients } from '../../services/api';

const ProjectCreateModal = ({ isOpen, onClose, onSuccess, initialData = null, preselectedClientId }) => {
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState({
    name: '',
    clientId: preselectedClientId || '',
    status: 'Draft',
    description: '',
    startDate: '',
    deadline: '',
    budget: '',
    hourlyRate: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadClients = async () => {
      const data = await fetchClients();
      setClients(data.clients || []);
    };
    if (isOpen) {
      loadClients();
    }
  }, [isOpen]);

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        clientId: initialData.clientId || '',
        status: initialData.status || 'Draft',
        description: initialData.description || '',
        startDate: initialData.startDate ? initialData.startDate.slice(0, 10) : '',
        deadline: initialData.deadline ? initialData.deadline.slice(0, 10) : '',
        budget: initialData.budget || '',
        hourlyRate: initialData.hourlyRate || '',
      });
    }
  }, [initialData]);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const payload = {
        ...form,
        budget: form.budget ? Number(form.budget) : undefined,
        hourlyRate: form.hourlyRate ? Number(form.hourlyRate) : undefined,
      };
      const data = initialData
        ? await updateProject(initialData._id, payload)
        : await createProject(payload);
      onSuccess?.(data);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Project' : 'Create Project'}
      footer={
        <div className="flex justify-end gap-3">
          <OutlinedButton onClick={onClose}>Cancel</OutlinedButton>
          <PrimaryButton onClick={handleSubmit} isLoading={loading}>
            {initialData ? 'Save Project' : 'Create Project'}
          </PrimaryButton>
        </div>
      }
    >
      <div className="space-y-4">
        <TextInput
          label="Project Name"
          name="name"
          value={form.name}
          onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          error={error}
        />
        <SelectDropdown
          label="Client"
          options={clients.map((client) => ({ value: client._id, label: client.name }))}
          value={form.clientId}
          onChange={(value) => setForm((prev) => ({ ...prev, clientId: value }))}
          placeholder="Select a client"
        />
        <SelectDropdown
          label="Status"
          options={[
            { value: 'Active', label: 'Active' },
            { value: 'Draft', label: 'Draft' },
            { value: 'OnHold', label: 'On Hold' },
          ]}
          value={form.status}
          onChange={(value) => setForm((prev) => ({ ...prev, status: value }))}
        />
        <Textarea
          label="Description"
          name="description"
          value={form.description}
          onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DatePickerInput
            label="Start Date"
            name="startDate"
            value={form.startDate}
            onChange={(e) => setForm((prev) => ({ ...prev, startDate: e.target.value }))}
          />
          <DatePickerInput
            label="Deadline"
            name="deadline"
            value={form.deadline}
            onChange={(e) => setForm((prev) => ({ ...prev, deadline: e.target.value }))}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput
            label="Budget"
            name="budget"
            value={form.budget}
            onChange={(e) => setForm((prev) => ({ ...prev, budget: e.target.value }))}
            prefix="$"
          />
          <TextInput
            label="Hourly Rate"
            name="hourlyRate"
            value={form.hourlyRate}
            onChange={(e) => setForm((prev) => ({ ...prev, hourlyRate: e.target.value }))}
            prefix="$"
          />
        </div>
      </div>
    </Modal>
  );
};

export default ProjectCreateModal;
