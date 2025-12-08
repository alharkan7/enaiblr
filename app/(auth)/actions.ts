'use server';

import { hash } from 'bcrypt-ts';
import { z } from 'zod';

import { createUser, getUser } from '@/lib/db/queries';

import { signIn, signOut } from './auth';

const authFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function register(formData: FormData) {
  const validatedFields = authFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' };
  }

  const { email, password } = validatedFields.data;

  const existingUsers = await getUser(email);

  if (existingUsers.length > 0) {
    return { error: 'Email already exists!' };
  }

  const hashedPassword = await hash(password, 10);

  await createUser(email, hashedPassword);

  try {
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    return { success: true };
  } catch (error) {
    return { error: 'Could not authenticate user.' };
  }
}

export async function authenticate(formData: FormData) {
  try {
    const validatedFields = authFormSchema.safeParse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    if (!validatedFields.success) {
      return { error: 'Invalid fields!' };
    }

    const { email, password } = validatedFields.data;
    const users = await getUser(email);

    if (users.length === 0) {
      return { error: 'No user found. Please sign up.' };
    }

    const user = users[0];
    if (!user.password) {
      return { error: 'Please sign in via Google' };
    }

    const passwordsMatch = await hash(password, user.password);
    if (!passwordsMatch) {
      return { error: 'Invalid password' };
    }

    return { success: true };
  } catch (error) {
    return { error: 'Could not authenticate user.' };
  }
}

export async function signOutAction() {
  'use server';
  
  await signOut({ redirectTo: '/' });
}
