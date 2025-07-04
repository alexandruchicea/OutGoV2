import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id: merchantId } = params;

    const supabase = createRouteHandlerClient({ cookies });

    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*, activities(*)')
      .eq('activities.merchant_id', merchantId);

    if (error) {
      console.error('Error fetching merchant bookings:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(bookings, { status: 200 });
  } catch (error: any) {
    console.error('Unexpected error:', error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
