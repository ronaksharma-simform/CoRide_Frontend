import { z } from "zod";

const PasswordSchema = z
  .string()
  .trim()
  .min(8, "Password must be at least 8 characters")
  .max(20, "Password cannot exceed 20 characters")
  .superRefine((val, ctx) => {
    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hasSpecial = false;

    for (const ch of val) {
      if (/[A-Z]/.test(ch)) hasUpper = true;
      else if (/[a-z]/.test(ch)) hasLower = true;
      else if (/\d/.test(ch)) hasNumber = true;
      else hasSpecial = true;
    }

    if (!hasUpper) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Must contain uppercase letter",
      });
    }

    if (!hasLower) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Must contain lowercase letter",
      });
    }

    if (!hasNumber) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Must contain number",
      });
    }

    if (!hasSpecial) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Must contain special character",
      });
    }
  });
export const UserSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username cannot exceed 20 characters")
    .regex(/^\w+$/, "Only letters, numbers and underscore allowed"),

  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(50, "First name too long"),

  middleName: z.string().trim().max(50, "Middle name too long").default(""),

  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(50, "Last name too long"),

  email: z
    .string()
    .trim()
    .email("Invalid email")
    .transform((val) => val.toLowerCase()),

  phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian phone number"),

  role: z.enum(["USER", "ADMIN"]).default("USER"),

  gender: z.enum(["MALE", "FEMALE"]).default("MALE"),

  avg_rating: z
    .number()
    .min(0, "Rating cannot be negative")
    .max(5, "Rating cannot exceed 5")
    .default(0),

  total_rides: z.number().min(0, "Total rides cannot be negative").default(0),

  created_at: z.string().datetime().optional(),
});

export const UserRegistrationSchema = UserSchema.pick({
  username: true,
  firstName: true,
  middleName: true,
  lastName: true,
  email: true,
  phone: true,
  gender: true,
}).extend({
  password: PasswordSchema,

  orgName: z
    .string()
    .trim()
    .min(2, "Organization name is required")
    .max(100, "Organization name too long"),
});

export const UserLoginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email")
    .transform((val) => val.toLowerCase()),
  password: PasswordSchema,
});

export const UserResponseSchema = UserSchema.pick({
  username: true,
  firstName: true,
  middleName: true,
  lastName: true,
  email: true,
  phone: true,
  role: true,
  gender: true,
  avg_rating: true,
  total_rides: true,
  created_at: true,
});

export const LoginResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: UserResponseSchema,
  accessToken: z.string(),
});

export const SignupResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  data: UserResponseSchema,
});

export const AuthStateSchema = z.object({
  user: UserResponseSchema.nullable(),
  accessToken: z.string().nullable(),
  isAuthenticated: z.boolean(),
  loading: z.boolean(),
  error: z.string().nullable(),
});
export const ResendVerificationEmailResponse = z.object({
  success: z.literal(true),
  message: z.string(),
});
export const ResendVerificationEmailSchema = z.object({
  email: z.email(),
});
export type IUser = z.infer<typeof UserResponseSchema>;
export type IResendVerificationEmailResponse = z.infer<
  typeof ResendVerificationEmailResponse
>;
export type IResendVerificationEmailSchema = z.infer<
  typeof ResendVerificationEmailSchema
>;
export type AuthState = z.infer<typeof AuthStateSchema>;

export type LoginResponse = z.infer<typeof LoginResponseSchema>;

export type IUserRegistrationSchema = z.infer<typeof UserRegistrationSchema>;

export type IUserLoginSchema = z.infer<typeof UserLoginSchema>;

export type ISignupResponse = z.infer<typeof SignupResponseSchema>;
export interface IGetCurrentUserResponse {
  success: boolean;
  data: IUser;
}
