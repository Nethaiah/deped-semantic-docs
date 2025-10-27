import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/callback`,
      },
    });

    if (error) {
      console.error('Google OAuth error:', error);
      return NextResponse.json({ error: "OAuth authentication failed" }, { status: 400 });
    }

    if (data.url) {
      return NextResponse.json({ url: data.url });
    }

    return NextResponse.json({ error: "No OAuth URL generated" }, { status: 400 });
  } catch (err) {
    console.error('Google OAuth route error:', err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Helper function to sync Google user to database
export async function syncGoogleUser(user: any) {
  try {
    const uid = user.id;
    const fullName = user.user_metadata?.full_name || user.user_metadata?.name || "Google User";

    // Check if user exists in database
    const [record] = await db.select().from(users).where(eq(users.id, uid)).limit(1);
    
    if (!record) {
      // Create new user in database
      await db.insert(users).values({
        id: uid,
        email: user.email ?? "",
        fullName,
        role: "user",
      });
      console.log("✅ New Google user inserted:", user.email);
    } else {
      console.log("✅ Existing Google user found:", record.email, "- Role:", record.role);
    }
  } catch (error) {
    console.error("Error syncing Google user:", error);
  }
}
