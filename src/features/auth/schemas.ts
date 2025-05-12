import { z } from "zod";

export const SignUpFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
  password: z
    .string()
    .min(8, { message: "*Password must be at least 8 characters long." })
    .regex(/[a-zA-Z]/, {
      message: " *Password must contain at least one letter.",
    })
    .regex(/[0-9]/, { message: "*Password must contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "*Password must contain at least one special character.",
    })
    .trim(),
});

export const LoginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
  password: z
    .string()
    .min(8, { message: "*Password must be at least 8 characters long." })
    .trim(),
});

export type FormState =
  | {
      errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
      };
      message?: string;
      success?: boolean;
    }
  | undefined;
