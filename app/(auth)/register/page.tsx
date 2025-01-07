import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { register } from '../actions';
import { auth } from '../auth';
import AuthForm from '@/components/auth-form';

export const metadata: Metadata = {
  title: 'Register',
};

export default async function RegisterPage() {
  const session = await auth();
  
  if (session?.user) {
    redirect('/');
  }

  return (
    <div className="flex h-[calc(100vh-theme(spacing.16))] items-center justify-center py-10 px-4">
      <AuthForm
        type="register"
        action={register}
      />
    </div>
  );
}
