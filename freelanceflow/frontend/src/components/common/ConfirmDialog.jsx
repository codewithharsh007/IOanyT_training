// Confirmation dialog for destructive actions.
import Modal from './Modal';
import PrimaryButton from './PrimaryButton';
import OutlinedButton from './OutlinedButton';

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  isDangerous = false,
  isLoading = false,
}) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title={title}
    footer={
      <div className="flex justify-end gap-3">
        <OutlinedButton onClick={onClose}>Cancel</OutlinedButton>
        <PrimaryButton
          onClick={onConfirm}
          isLoading={isLoading}
          className={isDangerous ? 'bg-red-600 hover:bg-red-700' : ''}
        >
          {confirmLabel}
        </PrimaryButton>
      </div>
    }
  >
    <p className="text-sm text-slate-600">{message}</p>
  </Modal>
);

export default ConfirmDialog;
