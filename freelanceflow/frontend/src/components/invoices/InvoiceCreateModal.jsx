// Invoice create modal.
import { useEffect, useState } from 'react';
import Modal from '../common/Modal';
import SelectDropdown from '../common/SelectDropdown';
import DatePickerInput from '../common/DatePickerInput';
import TextInput from '../common/TextInput';
import Textarea from '../common/Textarea';
import PrimaryButton from '../common/PrimaryButton';
import OutlinedButton from '../common/OutlinedButton';
import { createInvoice, fetchClients, fetchProjects } from '../../services/api';

const InvoiceCreateModal = ({ isOpen, onClose, onSuccess, preselectedClientId, preselectedProjectId }) => {
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({
    clientId: preselectedClientId || '',
    projectId: preselectedProjectId || '',
    invoiceNumber: '',
    issueDate: '',
    dueDate: '',
    taxPercent: 0,
    notes: '',
  });
  const [lineItems, setLineItems] = useState([{ description: '', quantity: 1, rate: 0 }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadOptions = async () => {
      const clientData = await fetchClients();
      setClients(clientData.clients || []);
    };
    if (isOpen) loadOptions();
  }, [isOpen]);

  useEffect(() => {
    const loadProjects = async () => {
      if (!form.clientId) return;
      const projectData = await fetchProjects({ clientId: form.clientId });
      setProjects(projectData.projects || []);
    };
    loadProjects();
  }, [form.clientId]);

  const updateLineItem = (index, field, value) => {
    setLineItems((prev) => prev.map((item, idx) => (idx === index ? { ...item, [field]: value } : item)));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const payload = {
        ...form,
        lineItems: lineItems.map((item) => ({
          description: item.description,
          quantity: Number(item.quantity),
          rate: Number(item.rate),
        })),
        taxPercent: Number(form.taxPercent || 0),
      };
      const data = await createInvoice(payload);
      onSuccess?.(data);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create invoice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Invoice"
      footer={
        <div className="flex justify-end gap-3">
          <OutlinedButton onClick={onClose}>Cancel</OutlinedButton>
          <PrimaryButton onClick={handleSubmit} isLoading={loading}>
            Create Invoice
          </PrimaryButton>
        </div>
      }
    >
      <div className="space-y-4">
        <SelectDropdown
          label="Client"
          options={clients.map((client) => ({ value: client._id, label: client.name }))}
          value={form.clientId}
          onChange={(value) => setForm((prev) => ({ ...prev, clientId: value }))}
          placeholder="Select a client"
        />
        <SelectDropdown
          label="Project (Optional)"
          options={projects.map((project) => ({ value: project._id, label: project.name }))}
          value={form.projectId}
          onChange={(value) => setForm((prev) => ({ ...prev, projectId: value }))}
          placeholder="Select a project"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TextInput
            label="Invoice Number"
            name="invoiceNumber"
            value={form.invoiceNumber}
            onChange={(e) => setForm((prev) => ({ ...prev, invoiceNumber: e.target.value }))}
          />
          <DatePickerInput
            label="Issue Date"
            name="issueDate"
            value={form.issueDate}
            onChange={(e) => setForm((prev) => ({ ...prev, issueDate: e.target.value }))}
          />
          <DatePickerInput
            label="Due Date"
            name="dueDate"
            value={form.dueDate}
            onChange={(e) => setForm((prev) => ({ ...prev, dueDate: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-slate-900">Line Items</h4>
          {lineItems.map((item, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <TextInput
                label="Description"
                name={`desc-${index}`}
                value={item.description}
                onChange={(e) => updateLineItem(index, 'description', e.target.value)}
              />
              <TextInput
                label="Quantity"
                name={`qty-${index}`}
                value={item.quantity}
                onChange={(e) => updateLineItem(index, 'quantity', e.target.value)}
              />
              <TextInput
                label="Rate"
                name={`rate-${index}`}
                value={item.rate}
                onChange={(e) => updateLineItem(index, 'rate', e.target.value)}
                prefix="$"
              />
            </div>
          ))}
          <button
            type="button"
            className="text-sm text-blue-600"
            onClick={() => setLineItems((prev) => [...prev, { description: '', quantity: 1, rate: 0 }])}
          >
            + Add Item
          </button>
        </div>

        <TextInput
          label="Tax Percent"
          name="taxPercent"
          value={form.taxPercent}
          onChange={(e) => setForm((prev) => ({ ...prev, taxPercent: e.target.value }))}
        />
        <Textarea
          label="Notes"
          name="notes"
          value={form.notes}
          onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    </Modal>
  );
};

export default InvoiceCreateModal;
