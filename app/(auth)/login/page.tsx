import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { authenticate } from '../actions';
import { auth } from '../auth';
import AuthForm from '@/components/auth-form';

export const metadata: Metadata = {
  title: 'Login',
};

export default async function LoginPage() {
  const session = await auth();
  
  if (session?.user) {
    redirect('/');
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <AuthForm
        type="login"
        action={authenticate}
      />
    </div>
  );
}
