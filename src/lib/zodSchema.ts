import { z } from "zod";

export const registerSchema = z.object({
  fullName: z.string().min(1, { message: "Full name is required" }),
  email: z.email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  terms: z.boolean().refine((data) => data, { message: "You must accept the terms and conditions" }),
})

export type RegisterSchema = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
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