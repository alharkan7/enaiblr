'use client';

import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { type FormEvent, useState } from 'react';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogoGoogle } from './icons';

interface AuthFormProps {
  type: 'login' | 'register';
  action: (formData: FormData) => Promise<{ success?: boolean; error?: string }>;
}

export default function AuthForm({ type, action }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setLoading(true);
      setError(null);

      const formData = new FormData(event.currentTarget);

      if (type === 'register') {
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');

        if (password !== confirmPassword) {
          setError('Passwords do not match');
          toast.error('Passwords do not match');
          setLoading(false);
          return;
        }
      }

      const result = await action(formData);

      if (result.error) {
        setError(result.error);
        toast.error(result.error);
        return;
      }

      // Sign in directly with credentials after successful server action
      const signInResult = await signIn('credentials', {
        email: formData.get('email'),
        password: formData.get('password'),
        redirect: false,
      });

      if (signInResult?.error) {
        setError('Failed to sign in');
        toast.error('Failed to sign in. Try continue with Google.');
        return;
      }

      toast.success(type === 'login' ? 'Logged in successfully!' : 'Account created successfully!');

      // Get the callback URL or default to /apps
      const callbackUrl = searchParams.get('callbackUrl') || '/apps';

      // Wait for the session to be updated
      await new Promise(resolve => setTimeout(resolve, 500));

      // Force a router refresh and redirect
      router.refresh();
      router.push(callbackUrl);
    } catch (e) {
      setError('An unexpected error occurred');
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    try {
      setLoading(true);
      setError(null);
      const callbackUrl = searchParams.get('callbackUrl');
      const result = await signIn('google', {
        callbackUrl: callbackUrl || '/apps',
        redirect: false
      });

      if (result?.error) {
        setError('Failed to sign in with Google');
        toast.error('Failed to sign in with Google. Please try again.');
        return;
      }

      if (result?.url) {
        router.push(result.url);
      }
    } catch (error) {
      setError('Failed to sign in with Google');
      toast.error('Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md space-y-8 rounded-lg border bg-card p-8 text-card-foreground shadow">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {type === 'login' ? 'Welcome Back' : 'Create an Account'}
        </h1>
        <p className="text-sm text-muted-foreground">
          {type === 'login'
            ? 'Sign in to access unlimited AI features'
            : 'Register to access unlimited AI features'}
        </p>
      </div>

      <Button
        className="w-full border-2 border-primary"
        disabled={loading}
        onClick={handleGoogleSignIn}
        variant="outline"
      >
        <LogoGoogle size={14} />
        Google
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">Or Use Email & Password</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            placeholder="yourname@email.com"
            required
            type="email"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              required
              type={showPassword ? "text" : "password"}
              onChange={(e) => {
                if (type === 'register') {
                  const confirmInput = document.querySelector<HTMLInputElement>('input[name="confirmPassword"]');
                  if (confirmInput?.value) {
                    setPasswordsMatch(e.target.value === confirmInput.value);
                  }
                }
              }}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </div>
        </div>

        {type === 'register' && (
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                required
                type={showConfirmPassword ? "text" : "password"}
                onChange={(e) => {
                  const passwordInput = document.querySelector<HTMLInputElement>('input[name="password"]');
                  if (passwordInput?.value) {
                    setPasswordsMatch(e.target.value === passwordInput.value);
                  }
                }}
                className={!passwordsMatch ? "border-red-500" : ""}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            {!passwordsMatch && (
              <p className="text-sm text-red-500">Passwords do not match</p>
            )}
          </div>
        )}

        {/* {error && (
          <div className="flex items-center gap-x-2 rounded-md bg-red-50 p-2 text-red-500">
            <AlertCircle className="size-4" />
            <p className="text-sm">{error}</p>
          </div>
        )} */}

        <Button
          className="w-full"
          disabled={loading}
          type="submit"
        >
          {loading ? (
            <div className="size-5 animate-spin rounded-full border-b-2 border-white" />
          ) : (
            type === 'login' ? 'Sign In' : 'Sign Up'
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        {type === 'login' ? (
          <>
            Don&apos;t have an account?{' '}
            <Link
              className="font-medium underline"
              href={`/register${searchParams.get('callbackUrl') ? `?callbackUrl=${searchParams.get('callbackUrl')}` : ''}`}
            >
              <b className='text-primary'>Sign Up</b>
            </Link>
            {' | Contact '}
            <Link
              className='font-medium'
              href='https://wa.me/+6281280077690'
              target='_blank'>
              <b className='text-primary'>Help</b>
            </Link>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <Link
              className="font-medium underline"
              href={`/login${searchParams.get('callbackUrl') ? `?callbackUrl=${searchParams.get('callbackUrl')}` : ''}`}
            >
              <b className='text-primary'>Sign In</b>
            </Link>
            {' | Contact '}
            <Link
              className='font-medium'
              href='https://wa.me/+6281280077690'
              target='_blank'>
              <b className='text-primary'>Help</b>
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
