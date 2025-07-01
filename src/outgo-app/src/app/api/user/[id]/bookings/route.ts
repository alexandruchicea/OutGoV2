import { NextResponse } from 'next/server';
import { supabase } from '../../../../../../utils/supabase/client';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id: userId } = params;

    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*, activities(*)') // Select all booking fields and join with activity details
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching user bookings:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(bookings, { status: 200 });
  } catch (error: any) {
    console.error('Unexpected error:', error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
