import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET endpoint to fetch user data
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get the current user session
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Return the complete user object from Supabase auth
    return NextResponse.json(user);

  } catch (err) {
    console.error('User fetch error:', err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
