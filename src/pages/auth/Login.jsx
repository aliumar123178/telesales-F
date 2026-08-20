import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, Radio } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';

const schema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async ({ username, password }) => {
    setServerError('');
    setSubmitting(true);
    try {
      await login(username, password);
      navigate('/', { replace: true });
    } catch (err) {
      setServerError(err.response?.data?.message || 'Invalid username or password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 py-10 max-w-md mx-auto">
      <div className="flex flex-col items-center mb-10">
        <div className="w-14 h-14 rounded-2xl bg-brand-500 flex items-center justify-center mb-4">
          <Radio size={26} className="text-white" strokeWidth={2.5} />
        </div>
        <h1 className="font-display text-2xl font-semibold text-ink">Addis Telesales</h1>
        <p className="text-slate-500 text-sm mt-1">Sign in to your agent workspace</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Username"
          icon={User}
          placeholder="Enter your username"
          error={errors.username?.message}
          {...register('username')}
        />
        <Input
          label="Password"
          type="password"
          icon={Lock}
          placeholder="Enter your password"
          error={errors.password?.message}
          {...register('password')}
        />

        {serverError && <p className="text-danger text-sm">{serverError}</p>}

        <Button type="submit" loading={submitting} className="mt-2">
          Login
        </Button>
      </form>

      <div className="flex justify-between mt-6 text-sm">
        <Link to="/signup" className="text-brand-500 font-medium underline underline-offset-2">
          Sign up
        </Link>
        <Link to="/forgot-password" className="text-slate-500 underline underline-offset-2">
          Forgot password
        </Link>
      </div>
    </div>
  );
}
