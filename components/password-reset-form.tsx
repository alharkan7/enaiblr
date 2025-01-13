'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { type FormEvent, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Eye, EyeOff, ChevronLeft, Check, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PasswordResetFormProps {
  type: 'request' | 'reset';
  action: (formData: FormData) => Promise<{ success?: boolean; error?: string }>;
}

export default function PasswordResetForm({ type, action }: PasswordResetFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordValid, setPasswordValid] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(false);

  // Password validation rules
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasLetter = /[a-zA-Z]/.test(password);

  useEffect(() => {
    if (type === 'reset') {
      setPasswordValid(hasMinLength && hasNumber && hasLetter);
      setPasswordsMatch(password === confirmPassword && password !== '');
    }
  }, [password, confirmPassword, type, hasMinLength, hasNumber, hasLetter]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setLoading(true);
      setError(null);

      const formData = new FormData(event.currentTarget);

      if (type === 'reset') {
        if (!passwordValid) {
          setError('Password does not meet requirements');
          toast.error('Password does not meet requirements');
          return;
        }
        if (!passwordsMatch) {
          setError('Passwords do not match');
          toast.error('Passwords do not match');
          return;
        }
      }

      const result = await action(formData);

      if (result.error) {
        setError(result.error);
        toast.error(result.error);
        return;
      }

      toast.success(
        type === 'request'
          ? 'Password reset instructions sent to your email!'
          : 'Password reset successful!'
      );

      if (type === 'reset') {
        router.push('/login');
      }
    } catch (e) {
      setError('An unexpected error occurred');
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-lg border bg-card space-y-4 p-8 text-card-foreground shadow">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold mb-2">
          {type === 'request' ? 'Forgot Password' : 'Reset Password'}</h1>
        <p className="text-sm text-muted-foreground">
          {type === 'request' ? 'Enter your email to receive a reset link.' : 'Enter your new password below.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {type === 'request' ? (
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              required
            />
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={password && (passwordValid ? 'border-green-500' : 'border-red-500')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {password && (
                <div className="mt-2 space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    {hasMinLength ? <Check size={14} className="text-green-500" /> : <X size={14} className="text-red-500" />}
                    <span className={hasMinLength ? "text-green-500" : "text-red-500"}>At least 8 characters</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {hasNumber ? <Check size={14} className="text-green-500" /> : <X size={14} className="text-red-500" />}
                    <span className={hasNumber ? "text-green-500" : "text-red-500"}>Contains a number</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {hasLetter ? <Check size={14} className="text-green-500" /> : <X size={14} className="text-red-500" />}
                    <span className={hasLetter ? "text-green-500" : "text-red-500"}>Contains a letter</span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className={confirmPassword && (passwordsMatch ? 'border-green-500' : 'border-red-500')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {confirmPassword && (
                <div className="mt-2 flex items-center gap-2 text-sm">
                  {passwordsMatch ? 
                    <><Check size={14} className="text-green-500" /><span className="text-green-500">Passwords match</span></> : 
                    <><X size={14} className="text-red-500" /><span className="text-red-500">Passwords do not match</span></>
                  }
                </div>
              )}
            </div>
          </>
        )}

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button 
          type="submit" 
          className="w-full" 
          disabled={loading || (type === 'reset' && (!passwordValid || !passwordsMatch))}
        >
          {loading
            ? 'Loading...'
            : type === 'request'
              ? 'Send Reset Instructions'
              : 'Reset Password'}
        </Button>
        {type === 'request' && (
          <div className="mt-4 text-center text-sm text-muted-foreground">
            <ChevronLeft className="size-4 inline-block mr-1 text-muted-foreground" /> Back to {' '}
            <Link href="/login" className="text-primary hover:underline">
              <b className='text-primary'>Login</b>
            </Link>
          </div>
        )}
      </form>
    </div>
  );
}
