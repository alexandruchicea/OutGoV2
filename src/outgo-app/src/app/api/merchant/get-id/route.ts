import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const { data, error } = await supabase
      .from('merchants')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching merchant ID:', error);
      return new NextResponse(JSON.stringify({ error: 'Failed to fetch merchant ID' }), { status: 500 });
    }

    return new NextResponse(JSON.stringify({ merchantId: data.id }), { status: 200 });

  } catch (error: any) {
    console.error('Unexpected error:', error.message);
    return new NextResponse(JSON.stringify({ error: 'An unexpected error occurred' }), { status: 500 });
  }
}
