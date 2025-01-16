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
      from: 'Enaiblr <noreply@enaiblr.org>',
      to: email,
      subject: 'Reset Your Password - Enaiblr',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset Your Password</title>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                margin: 0;
                padding: 0;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 40px 20px;
              }
              .logo {
                margin-bottom: 30px;
                text-align: center;
              }
              .content {
                background: #ffffff;
                padding: 30px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              }
              .button {
                display: inline-block;
                padding: 12px 24px;
                background-color: #007bff;
                color: #ffffff;
                text-decoration: none;
                border-radius: 4px;
                margin: 20px 0;
              }
              .footer {
                margin-top: 30px;
                font-size: 14px;
                color: #666;
                text-align: center;
              }
              .warning {
                color: #666;
                font-size: 14px;
                margin-top: 20px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="logo">
                <!-- Replace with your actual logo -->
                <h1 style="color: #007bff; margin: 0;">Enaiblr</h1>
              </div>
              
              <div class="content">
                <h2>Password Reset Request</h2>
                <p>Hello,</p>
                <p>We received a request to reset the password for your Enaiblr account. To proceed with the password reset, please click the button below:</p>
                
                <div style="text-align: center;">
                  <a href="${APP_URL}/reset-password?token=${token}" class="button" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: #ffffff !important; text-decoration: none; border-radius: 4px; margin: 20px 0;">Reset Your Password</a>
                </div>
                
                <p class="warning">This link will expire in 24 hours for security reasons. If you didn't request this password reset, please ignore this email or contact our support team if you have concerns.</p>
                
                <p>If the button above doesn't work, you can copy and paste this link into your browser:</p>
                <p style="word-break: break-all; font-size: 14px;">
                  ${APP_URL}/reset-password?token=${token}
                </p>
              </div>
              
              <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Enaiblr. All rights reserved.</p>
                <p>This is an automated message, please do not reply to this email.</p>
              </div>
            </div>
          </body>
        </html>
      `
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
