import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { loginSchema } from "@/lib/zodSchema";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate request body with Zod
    const validatedData = loginSchema.parse(body);
    const { email, password } = validatedData;

    const supabase = await createClient();
    
    // Sign in with email and password using Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Login error:', error);
      
      // Handle specific error cases
      if (error.message.includes('Invalid login credentials')) {
        return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
      }
      
      if (error.message.includes('Email not confirmed')) {
        return NextResponse.json({ 
          error: "Please check your email and click the verification link before signing in" 
        }, { status: 403 });
      }
      
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!data.user) {
      return NextResponse.json({ error: "Login failed" }, { status: 400 });
    }

    return NextResponse.json({ 
      message: "Login successful",
      user: {
        id: data.user.id,
        email: data.user.email,
        email_confirmed_at: data.user.email_confirmed_at
      }
    });

  } catch (error) {
    console.error('Login route error:', error);
    
    // Handle Zod validation errors
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({ 
        error: "Invalid input data",
        details: error.message 
      }, { status: 400 });
    }
    
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
