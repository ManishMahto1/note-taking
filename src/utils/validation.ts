import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  dob: z.string().min(1, 'Date of Birth is required'),
  email: z.string().email('Invalid email'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
});