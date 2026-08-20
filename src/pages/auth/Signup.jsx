import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, Mail } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';

const schema = z
  .object({
    fullName: z.string().min(2, 'Enter your full name'),
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    setServerError('');
    setSubmitting(true);
    try {
      await signup(values);
      navigate('/', { replace: true });
    } catch (err) {
      setServerError(err.response?.data?.message || 'Could not create account');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 py-10 max-w-md mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold text-ink">Create your account</h1>
        <p className="text-slate-500 text-sm mt-1">Set up agent access for Nexora Telesales</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Full name" icon={User} placeholder="Jane Doe" error={errors.fullName?.message} {...register('fullName')} />
        <Input label="Username" icon={User} placeholder="Choose a username" error={errors.username?.message} {...register('username')} />
        <Input label="Email" type="email" icon={Mail} placeholder="you@example.com" error={errors.email?.message} {...register('email')} />
        <Input label="Password" type="password" icon={Lock} placeholder="Create a password" error={errors.password?.message} {...register('password')} />
        <Input label="Confirm password" type="password" icon={Lock} placeholder="Re-enter password" error={errors.confirmPassword?.message} {...register('confirmPassword')} />

        {serverError && <p className="text-danger text-sm">{serverError}</p>}

        <Button type="submit" loading={submitting} className="mt-2">
          Create account
        </Button>
      </form>

      <p className="text-center text-sm mt-6 text-slate-500">
        Already have an account?{' '}
        <Link to="/login" className="text-brand-500 font-medium underline underline-offset-2">
          Log in
        </Link>
      </p>
    </div>
  );
}
