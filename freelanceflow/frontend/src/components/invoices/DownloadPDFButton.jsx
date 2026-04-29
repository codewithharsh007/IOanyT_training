// Download PDF button.
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import OutlinedButton from '../common/OutlinedButton';

const DownloadPDFButton = ({ onClick, isLoading = false }) => (
  <OutlinedButton onClick={onClick} isLoading={isLoading} className="w-full">
    <ArrowDownTrayIcon className="w-4 h-4" />
    Download PDF
  </OutlinedButton>
);

export default DownloadPDFButton;
