import { z } from "zod";

export const studentIdRegex = /^\d{3}-\d{4}$/;

export const registerSchema = z.object({
  studentId: z.string().min(1, { message: "Student ID is required" }).regex(studentIdRegex, { message: "Student ID must follow the format 000-0000" }),
  fullName: z.string().min(1, { message: "Full name is required" }),
  email: z.email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  terms: z.boolean().refine((data) => data, { message: "You must accept the terms and conditions" }),
})

export type RegisterSchema = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  studentId: z.string().min(1, { message: "Student ID is required" }).regex(studentIdRegex, { message: "Student ID must follow the format 000-0000" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
})

export type LoginSchema = z.infer<typeof loginSchema>;

// Upload form schema
export const uploadSchema = z.object({
  docType: z.string().min(1, { message: "Document type is required" }),
  title: z.string().min(1, { message: "Title is required" }),
  issuanceNumber: z.string().min(1, { message: "Issuance number is required" }),
  issuanceDate: z.string().min(1, { message: "Issuance date is required" }),
  audience: z.array(z.enum(["all", "schools", "internal", "district"])),
})

export type UploadSchema = z.infer<typeof uploadSchema>;

export const forgotPasswordSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
});

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  newPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;

export const profileSchema = z.object({
  fullName: z.string().min(1, { message: "Full name is required" }),
});

export type ProfileSchema = z.infer<typeof profileSchema>;

export const passwordSchema = z.object({
  currentPassword: z.string().min(1, { message: "Current password is required" }),
  newPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type PasswordSchema = z.infer<typeof passwordSchema>;