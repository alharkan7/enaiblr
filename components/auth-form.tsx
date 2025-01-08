'use client';

import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { type FormEvent, useState } from 'react';
import { toast } from 'sonner';

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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    
    try {
      setLoading(true);
      setError(null);

      const formData = new FormData(event.currentTarget);
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
      
      // Force a router refresh to update session state
      router.refresh();
      
      const callbackUrl = searchParams.get('callbackUrl');
      router.push(callbackUrl || '/apps');
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
      const callbackUrl = searchParams.get('callbackUrl');
      await signIn('google', { callbackUrl: callbackUrl || '/apps' });
    } catch (error) {
      toast.error('Failed to sign in with Google');
    }
  }

  return (
    <div className="w-full max-w-md space-y-8 rounded-lg border bg-card p-8 text-card-foreground shadow">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {type === 'login' ? 'Welcome back' : 'Create an account'}
        </h1>
        <p className="text-sm text-muted-foreground">
          {type === 'login'
            ? 'Enter your email to sign in to your account'
            : 'Enter your email below to create your account'}
        </p>
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
          <Input
            id="password"
            name="password"
            required
            type="password"
          />
        </div>
        
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

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      <Button
        className="w-full"
        disabled={loading}
        onClick={handleGoogleSignIn}
        variant="outline"
      >
        <LogoGoogle size={14}/>
        Google
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {type === 'login' ? (
          <>
            Don&apos;t have an account?{' '}
            <Link 
              className="font-medium underline" 
              href={`/register${searchParams.get('callbackUrl') ? `?callbackUrl=${searchParams.get('callbackUrl')}` : ''}`}
            >
              Sign up
            </Link>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <Link 
              className="font-medium underline" 
              href={`/login${searchParams.get('callbackUrl') ? `?callbackUrl=${searchParams.get('callbackUrl')}` : ''}`}
            >
              Sign in
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
