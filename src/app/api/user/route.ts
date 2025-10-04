import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get the current user session
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { fullName, role = 'user' } = await req.json();

    // Check if user already exists in our database
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('uid', user.id)
      .single();

    if (existingUser) {
      return NextResponse.json({ 
        message: "User already exists",
        userId: user.id 
      });
    }

    // Create new user record in our database
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        uid: user.id,
        fullName: fullName || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        email: user.email!,
        role: role,
      })
      .select()
      .single();

    if (insertError) {
      console.error('User creation error:', insertError);
      return NextResponse.json({ error: "Failed to create user record" }, { status: 500 });
    }

    return NextResponse.json({ 
      message: "User created successfully",
      user: newUser 
    });

  } catch (err) {
    console.error('User route error:', err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
