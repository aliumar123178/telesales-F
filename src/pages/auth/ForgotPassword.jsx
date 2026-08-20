import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { requestPasswordReset } from '../../services/authService.js';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';

export default function ForgotPassword() {
  const [username, setUsername] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await requestPasswordReset(username);
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 py-10 max-w-md mx-auto">
      <h1 className="font-display text-2xl font-semibold text-ink mb-1">Reset your password</h1>
      <p className="text-slate-500 text-sm mb-8">
        Enter your username and we'll send reset instructions to your registered email.
      </p>

      {status === 'sent' ? (
        <p className="text-success text-sm">Reset instructions sent. Check your email.</p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            label="Username"
            icon={Mail}
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {status === 'error' && (
            <p className="text-danger text-sm">Could not find that account. Try again.</p>
          )}
          <Button type="submit" loading={status === 'sending'}>
            Send reset link
          </Button>
        </form>
      )}

      <Link to="/login" className="text-brand-500 text-sm font-medium mt-6 text-center underline underline-offset-2">
        Back to login
      </Link>
    </div>
  );
}
