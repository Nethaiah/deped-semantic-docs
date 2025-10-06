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

    // Fetch user data from the database
    const { data: userData, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('uid', user.id)
      .single();

    if (fetchError) {
      console.error('Error fetching user data:', fetchError);
      return NextResponse.json({ 
        error: "Failed to fetch user data",
        details: fetchError.message 
      }, { status: 500 });
    }

    // Combine auth data with database data
    const responseData = {
      id: user.id,
      email: user.email,
      ...userData,
      user_metadata: user.user_metadata,
      raw_user_meta_data: user.user_metadata
    };

    return NextResponse.json(responseData);

  } catch (err) {
    console.error('User fetch error:', err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
