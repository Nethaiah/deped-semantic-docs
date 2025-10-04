import { pgEnum, pgTable, text, varchar, timestamp, serial } from "drizzle-orm/pg-core";

// Roles: admin | user (default: user)
export const userRoleEnum = pgEnum('user_role', ['admin', 'user']);

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').unique(),
  fullName: text('full_name').notNull(),
  email: varchar('email', { length: 256 }).notNull().unique(),
  role: userRoleEnum('role').notNull().default('user'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()).notNull(),
});

export const schema = { users, userRoleEnum }
