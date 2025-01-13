'use server';

import { Resend } from 'resend';
import { v4 as uuidv4 } from 'uuid';
import { hash } from 'bcrypt-ts';
import { db } from '@/lib/db';
import { getUser, updateUserProfile } from '@/lib/db/queries';
import { eq, and, gt } from 'drizzle-orm';
import { tokenPassword } from '@/lib/db/schema';

const resend = new Resend(process.env.RESEND_API_KEY);
const APP_URL = process.env.APP_URL;

export async function requestPasswordReset(formData: FormData) {
  try {
    const email = formData.get('email') as string;
    if (!email) {
      return { error: 'Email is required' };
    }

    const users = await getUser(email);
    if (users.length === 0) {
      return { error: 'No account found with this email' };
    }

    // Create reset token
    const token = uuidv4();
    await db.insert(tokenPassword).values({
      token,
      email,
      used: false,
      createdAt: new Date(),
    });

    // Send reset email
    await resend.emails.send({
      from: 'noreply@enaiblr.org',
      to: email,
      subject: 'Enaiblr: Reset your password',
      html: `
        <p>Click the link below to reset your password:</p>
        <a href="${APP_URL}/reset-password?token=${token}">Reset Password</a>
        <p>This link will expire in 24 hours.</p>
      `,
    });

    return { success: true };
  } catch (error) {
    return { error: 'Failed to send reset email' };
  }
}

export async function resetPassword(formData: FormData) {
  try {
    const token = formData.get('token') as string;
    const password = formData.get('password') as string;

    if (!token || !password) {
      return { error: 'Missing required fields' };
    }

    // Find and validate token
    const [tokenRecord] = await db.select()
      .from(tokenPassword)
      .where(
        and(
          eq(tokenPassword.token, token),
          eq(tokenPassword.used, false),
          gt(tokenPassword.createdAt, new Date(Date.now() - 24 * 60 * 60 * 1000)) // 24 hours
        )
      );

    if (!tokenRecord) {
      return { error: 'Invalid or expired reset token' };
    }

    // Hash the new password
    const hashedPassword = await hash(password, 10);

    // Update user password
    await updateUserProfile(tokenRecord.email, { password: hashedPassword });

    // Mark token as used
    await db.update(tokenPassword)
      .set({ used: true })
      .where(eq(tokenPassword.id, tokenRecord.id));

    return { success: true };
  } catch (error) {
    return { error: 'Failed to reset password' };
  }
}
