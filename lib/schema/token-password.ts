import { z } from 'zod';

export const TokenPasswordSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  token: z.string().uuid(),
  used: z.boolean().default(false),
  email: z.string().email(),
});

export type TokenPassword = z.infer<typeof TokenPasswordSchema>;
