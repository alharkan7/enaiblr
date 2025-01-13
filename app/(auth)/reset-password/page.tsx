import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { auth } from '../auth';
import AuthForm from '@/components/auth-form';

export const metadata: Metadata = {
  title: 'Reset Password',
};

export default async function ResetPasswordPage() {
  const session = await auth();
  
  if (session?.user) {
    redirect('/');
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <AuthForm
        type="reset-password"
        // action={async () => ({ success: true })} // Placeholder action
      />
    </div>
  );
}
