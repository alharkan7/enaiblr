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
    <div className="flex h-[calc(100vh-theme(spacing.16))] items-center justify-center py-10">
      <AuthForm
        type="login"
        action={authenticate}
      />
    </div>
  );
}
