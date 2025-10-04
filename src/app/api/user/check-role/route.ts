import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get the current user session
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Query the users table to get the user's role
    const { data: userData, error: roleError } = await supabase
      .from('users')
      .select('role')
      .eq('uid', user.id)
      .single();

    if (roleError) {
      console.error('Role check error:', roleError);
      return NextResponse.json({ error: "Failed to fetch user role" }, { status: 500 });
    }

    if (!userData) {
      return NextResponse.json({ error: "User not found in database" }, { status: 404 });
    }

    return NextResponse.json({ 
      role: userData.role,
      userId: user.id,
      email: user.email 
    });

  } catch (err) {
    console.error('Check role route error:', err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
