import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase/client';

export async function POST(request: Request) {
  const { email, password, name } = await request.json(); // Added name

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Insert a new profile entry for the newly signed-up user
  if (data.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        { id: data.user.id, name: name, email: email } // Include name and email
      ]);

    if (profileError) {
      console.error('Error creating user profile:', profileError.message);
      // You might want to handle this error more gracefully, e.g., delete the auth.user entry
      return NextResponse.json({ error: 'Failed to create user profile' }, { status: 500 });
    }
  }

  return NextResponse.json({ user: data.user }, { status: 200 });
}
