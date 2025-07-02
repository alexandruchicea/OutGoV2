import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Admin check (simplified - in a real app, use proper roles/permissions)
    const { data: { user } } = await supabase.auth.getUser();
    import { isAdmin } from '@/utils/auth/roles';

if (!user || !isAdmin(user)) { // Admin check
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: users, error } = await supabase.from('profiles').select('id, name, preferences');

    if (error) {
      console.error('Error fetching users:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(users, { status: 200 });
  } catch (error: any) {
    console.error('Unexpected error:', error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
