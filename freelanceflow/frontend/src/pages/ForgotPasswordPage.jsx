// Forgot password screen.
import { useState } from 'react';
import PublicLayout from '../components/layout/PublicLayout';
import AuthBrandingPanel from '../components/auth/AuthBrandingPanel';
import TextInput from '../components/common/TextInput';
import PrimaryButton from '../components/common/PrimaryButton';
import TextLink from '../components/common/TextLink';
import CardContainer from '../components/common/CardContainer';
import { forgotPassword } from '../services/api';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ message: '', isError: false });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus({ message: '', isError: false });
    try {
      await forgotPassword(email);
      setStatus({ message: 'Password reset instructions sent to your email.', isError: false });
    } catch (err) {
      setStatus({ message: err.message || 'Unable to send reset email.', isError: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      <div className="min-h-screen grid lg:grid-cols-[1.15fr_0.85fr]">
        <AuthBrandingPanel />
        <div className="flex items-center justify-center px-6 py-10 lg:px-12">
          <CardContainer className="max-w-md w-full">
            <h3 className="text-lg font-semibold text-slate-900">Reset your password</h3>
            <p className="text-sm text-slate-600 mt-2">
              Enter your account email and we&apos;ll send a reset link.
            </p>
            <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
              <TextInput
                label="Email"
                name="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="email@your.email.com"
              />
              {status.message && (
                <p className={`text-sm ${status.isError ? 'text-red-500' : 'text-emerald-600'}`}>
                  {status.message}
                </p>
              )}
              <PrimaryButton type="submit" isLoading={loading} className="w-full">
                Send reset link
              </PrimaryButton>
              <div className="text-center text-sm text-slate-600">
                <TextLink to="/login">Return to login</TextLink>
              </div>
            </form>
          </CardContainer>
        </div>
      </div>
    </PublicLayout>
  );
};

export default ForgotPasswordPage;
