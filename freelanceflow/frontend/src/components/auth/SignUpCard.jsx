// Sign up form card.
import { useState } from 'react';
import PrimaryButton from '../common/PrimaryButton';
import PasswordInput from '../common/PasswordInput';
import TextInput from '../common/TextInput';
import TextLink from '../common/TextLink';
import useAuth from '../../hooks/useAuth';

const SignUpCard = () => {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
    } catch (err) {
      setError(err.message || 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">Sign Up</h3>
      <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
        <TextInput
          label="Name"
          name="name"
          value={form.name}
          onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          placeholder="Jane Doe"
          error={error}
        />
        <TextInput
          label="Email"
          name="email"
          value={form.email}
          onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
          placeholder="email@your.email.com"
          error=""
        />
        <PasswordInput
          label="Password"
          name="password"
          value={form.password}
          onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
          error=""
        />
        <PrimaryButton type="submit" isLoading={loading} className="w-full">
          Sign Up
        </PrimaryButton>
        <p className="text-sm text-slate-600 text-center">
          Already have an account? <TextLink to="/login">Log In</TextLink>
        </p>
      </form>
    </div>
  );
};

export default SignUpCard;
