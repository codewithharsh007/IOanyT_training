// Toast notification UI.
import useToast from '../../hooks/useToast';

const Toast = () => {
  const { toast } = useToast();
  if (!toast) return null;

  const variantStyles =
    toast.variant === 'error' ? 'bg-rose-600' : 'bg-emerald-600';

  return (
    <div className={`fixed top-5 right-5 z-50 text-white px-4 py-3 rounded-lg shadow-lg ${variantStyles}`}>
      {toast.message}
    </div>
  );
};

export default Toast;
