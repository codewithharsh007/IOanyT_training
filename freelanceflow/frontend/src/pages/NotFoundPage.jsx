// 404 page.
import { Link } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import PrimaryButton from '../components/common/PrimaryButton';

const NotFoundPage = () => (
  <PublicLayout>
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <div className="text-6xl mb-4">404</div>
      <h1 className="text-2xl font-semibold text-slate-900">Page not found</h1>
      <p className="text-sm text-slate-600 mt-2">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link to="/">
        <PrimaryButton className="mt-6">Back to home</PrimaryButton>
      </Link>
    </div>
  </PublicLayout>
);

export default NotFoundPage;
