// Login screen.
import PublicLayout from '../components/layout/PublicLayout';
import AuthBrandingPanel from '../components/auth/AuthBrandingPanel';
import LoginCard from '../components/auth/LoginCard';

const LoginPage = () => (
  <PublicLayout>
    <div className="min-h-screen grid lg:grid-cols-2">
      <AuthBrandingPanel />
      <div className="flex items-center justify-center p-6">
        <LoginCard />
      </div>
    </div>
  </PublicLayout>
);

export default LoginPage;
