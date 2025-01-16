import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { auth } from '../auth';
import PasswordResetForm from '@/components/password-reset-form';
import { requestPasswordReset } from '@/app/(account)/actions/reset-password';

export const metadata: Metadata = {
  title: 'Forgot Password',
};

export default async function ForgotPasswordPage() {
  const session = await auth();
  
  if (session?.user) {
    redirect('/');
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-4">
        <PasswordResetForm type="request" action={requestPasswordReset} />
      </div>
    </div>
  );
}
