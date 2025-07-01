import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id: userId } = params;
    const { name, preferences } = await request.json();

    const supabase = createRouteHandlerClient({ cookies });

    // Admin check (simplified - in a real app, use proper roles/permissions)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.email !== 'admin@example.com') { // Placeholder for admin check
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({ name, preferences })
      .eq('id', userId)
      .select();

    if (error) {
      console.error('Error updating user profile:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(data[0], { status: 200 });
  } catch (error: any) {
    console.error('Unexpected error:', error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id: userId } = params;

    const supabase = createRouteHandlerClient({ cookies });

    // Admin check (simplified - in a real app, use proper roles/permissions)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.email !== 'admin@example.com') { // Placeholder for admin check
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Note: Deleting from 'profiles' table will cascade delete from 'auth.users' if RLS is set up correctly
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (error) {
      console.error('Error deleting user:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Unexpected error:', error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
