import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
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
    const supabase = await createClient();

    // Enforce local uniqueness early
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", normalizedEmail)
      .single();

    if (existingUser) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    }

    // Create user in Supabase (email/password + confirm email)
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
      await supabase
        .from("users")
        .insert({ 
          id: uid,
          email: normalizedEmail, 
          full_name: fullName, 
          role: 'user' 
        });
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
