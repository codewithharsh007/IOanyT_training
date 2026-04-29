// Sign up screen.
import PublicLayout from '../components/layout/PublicLayout';
import AuthBrandingPanel from '../components/auth/AuthBrandingPanel';
import SignUpCard from '../components/auth/SignUpCard';

const SignUpPage = () => (
  <PublicLayout>
    <div className="min-h-screen grid lg:grid-cols-[1.15fr_0.85fr]">
      <AuthBrandingPanel />
      <div className="flex items-center justify-center px-6 py-10 lg:px-12">
        <SignUpCard />
      </div>
    </div>
  </PublicLayout>
);

export default SignUpPage;
