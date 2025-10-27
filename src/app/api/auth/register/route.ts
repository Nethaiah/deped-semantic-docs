import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createClient } from "@supabase/supabase-js";
import { registerSchema } from "@/lib/zodSchema";

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = registerSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid registration payload", issues: parsed.error.issues },
        { status: 400 },
      );
    }

    const { fullName, email, password } = parsed.data;

    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();

    // Enforce local uniqueness early
    const exists = await db.select().from(users).where(eq(users.email, normalizedEmail)).limit(1);
    if (exists.length > 0) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    }

    // Create user in Supabase (email/password + confirm email)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ error: "Server auth not configured" }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        data: { name: fullName, full_name: fullName },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/verify-email`
      }
    });


    if (error) {
      const msg = (error.message || '').toLowerCase();
      if (msg.includes('already registered') || msg.includes('already exists')) {
        return NextResponse.json({ error: "Email already exists" }, { status: 409 });
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Instantly insert user into database (password handled by Supabase)
    const uid = data.user?.id;
    if (uid) {
      await db.insert(users).values({ 
        id: uid,
        email: normalizedEmail, 
        fullName, 
        role: 'user' 
      }).onConflictDoNothing();
    }

    return NextResponse.json({ message: "Registered" });
  } catch (_err) {
    console.error("Register error:", _err);
    return NextResponse.json(
      { error: "Bad Request", details: _err instanceof Error ? _err.message : "Unknown error" },
      { status: 400 }
    );
  }
}
