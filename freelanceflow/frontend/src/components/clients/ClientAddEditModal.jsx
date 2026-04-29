// Client add/edit modal.
import { useEffect, useState } from 'react';
import Modal from '../common/Modal';
import TextInput from '../common/TextInput';
import Textarea from '../common/Textarea';
import PrimaryButton from '../common/PrimaryButton';
import OutlinedButton from '../common/OutlinedButton';
import { createClient, updateClient } from '../../services/api';

const ClientAddEditModal = ({ isOpen, onClose, onSuccess, initialData = null }) => {
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', notes: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        company: initialData.company || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        notes: initialData.notes || '',
      });
    }
  }, [initialData]);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const payload = { ...form };
      const data = initialData
        ? await updateClient(initialData._id, payload)
        : await createClient(payload);
      onSuccess?.(data);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save client');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Client' : 'Add Client'}
      footer={
        <div className="flex justify-end gap-3">
          <OutlinedButton onClick={onClose}>Cancel</OutlinedButton>
          <PrimaryButton onClick={handleSubmit} isLoading={loading}>
            Save Client
          </PrimaryButton>
        </div>
      }
    >
      <div className="space-y-4">
        <TextInput
          label="Full Name"
          name="name"
          value={form.name}
          onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          error={error}
        />
        <TextInput
          label="Company Name"
          name="company"
          value={form.company}
          onChange={(e) => setForm((prev) => ({ ...prev, company: e.target.value }))}
        />
        <TextInput
          label="Email"
          name="email"
          value={form.email}
          onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
        />
        <TextInput
          label="Phone"
          name="phone"
          value={form.phone}
          onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
        />
        <Textarea
          label="Notes"
          name="notes"
          value={form.notes}
          onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
        />
      </div>
    </Modal>
  );
};

export default ClientAddEditModal;
