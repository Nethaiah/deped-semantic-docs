import { pgEnum, pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";

// Roles: admin | user (default: user)
export const userRoleEnum = pgEnum('user_role', ['admin', 'user']);

export const users = pgTable('users', {
  id: text('id').primaryKey(), // Supabase auth user ID
  fullName: text('full_name').notNull(),
  email: varchar('email', { length: 256 }).notNull().unique(),
  role: userRoleEnum('role').notNull().default('user'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()).notNull(),
});

export const schema = { users, userRoleEnum }
