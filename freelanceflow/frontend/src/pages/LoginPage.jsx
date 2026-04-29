// Login screen.
import PublicLayout from '../components/layout/PublicLayout';
import AuthBrandingPanel from '../components/auth/AuthBrandingPanel';
import LoginCard from '../components/auth/LoginCard';

const LoginPage = () => (
  <PublicLayout>
    <div className="min-h-screen grid lg:grid-cols-[1.15fr_0.85fr]">
      <AuthBrandingPanel />
      <div className="flex items-center justify-center px-6 py-10 lg:px-12">
        <LoginCard />
      </div>
    </div>
  </PublicLayout>
);

export default LoginPage;
