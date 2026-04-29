// Login form card.
import { useState } from 'react';
import PrimaryButton from '../common/PrimaryButton';
import PasswordInput from '../common/PasswordInput';
import TextInput from '../common/TextInput';
import TextLink from '../common/TextLink';
import useAuth from '../../hooks/useAuth';

const LoginCard = () => {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">Log In</h3>
      <p className="mt-2 text-sm text-slate-600">
        If you just signed up, check your email and verify your account before logging in.
      </p>
      <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
        <TextInput
          label="Email"
          name="email"
          value={form.email}
          onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
          placeholder="email@your.email.com"
          error={error}
        />
        <PasswordInput
          label="Password"
          name="password"
          value={form.password}
          onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
          error=""
        />
        <div className="flex justify-end">
          <TextLink to="/forgot-password">Forgot password?</TextLink>
        </div>
        <PrimaryButton type="submit" isLoading={loading} className="w-full">
          Log In
        </PrimaryButton>
        <p className="text-sm text-slate-600 text-center">
          Don&apos;t have an account? <TextLink to="/signup">Sign Up</TextLink>
        </p>
      </form>
    </div>
  );
};

export default LoginCard;
