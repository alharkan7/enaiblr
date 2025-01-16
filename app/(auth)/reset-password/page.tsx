import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { auth } from '../auth';
import PasswordResetForm from '@/components/password-reset-form';
import { resetPassword } from '@/app/(account)/actions/reset-password';

export const metadata: Metadata = {
  title: 'Reset Password',
};

// Create a server action wrapper
async function resetPasswordWithToken(token: string, formData: FormData) {
  'use server';
  formData.append('token', token);
  return resetPassword(formData);
}

type SearchParams = { [key: string]: string | string[] | undefined };

interface PageProps {
  params: Promise<Record<string, string>>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const Page = async ({ params, searchParams }: PageProps) => {
  await params; // Await params even if we don't use them
  const searchParamsValue = await searchParams;
  const session = await auth();
  const token = typeof searchParamsValue.token === 'string' ? searchParamsValue.token : undefined;
  
  if (session?.user) {
    redirect('/');
  }

  if (!token) {
    redirect('/forgot-password');
  }

  // Create a wrapper function that matches the expected type
  const handleResetPassword = async (formData: FormData) => {
    'use server';
    return resetPasswordWithToken(token, formData);
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-4">
        <PasswordResetForm 
          type="reset" 
          action={handleResetPassword}
        />
      </div>
    </div>
  );
};

export default Page;
