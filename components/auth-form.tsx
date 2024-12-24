'use client';

import { AlertCircle } from 'lucide-react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AuthFormProps {
  type: 'login' | 'register';
  action: (formData: FormData) => Promise<{ success?: boolean; error?: string }>;
}

export default function AuthForm({ type, action }: AuthFormProps) {
  const router = useRouter();
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

      toast.success(type === 'login' ? 'Logged in successfully!' : 'Account created successfully!');
      router.refresh();
      router.push('/');
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
      await signIn('google', { callbackUrl: '/' });
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
            placeholder="m@example.com"
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
        
        {error && (
          <div className="flex items-center gap-x-2 rounded-md bg-red-50 p-2 text-red-500">
            <AlertCircle className="h-4 w-4" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <Button
          className="w-full"
          disabled={loading}
          type="submit"
        >
          {loading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white" />
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
        <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
        </svg>
        Google
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {type === 'login' ? (
          <>
            Don&apos;t have an account?{' '}
            <Link className="font-medium underline" href="/register">
              Sign up
            </Link>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <Link className="font-medium underline" href="/login">
              Sign in
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
