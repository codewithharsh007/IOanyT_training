// Sign up screen.
import PublicLayout from '../components/layout/PublicLayout';
import AuthBrandingPanel from '../components/auth/AuthBrandingPanel';
import SignUpCard from '../components/auth/SignUpCard';

const SignUpPage = () => (
  <PublicLayout>
    <div className="min-h-screen grid lg:grid-cols-2">
      <AuthBrandingPanel />
      <div className="flex items-center justify-center p-6">
        <SignUpCard />
      </div>
    </div>
  </PublicLayout>
);

export default SignUpPage;
