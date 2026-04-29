// Download PDF button.
import { Download } from 'lucide-react';
import OutlinedButton from '../common/OutlinedButton';

const DownloadPDFButton = ({ onClick, isLoading = false }) => (
  <OutlinedButton onClick={onClick} isLoading={isLoading} className="w-full">
    <Download className="w-4 h-4" />
    Download PDF
  </OutlinedButton>
);

export default DownloadPDFButton;
