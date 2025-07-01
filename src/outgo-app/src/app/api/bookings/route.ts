import { NextResponse } from 'next/server';
import { supabase } from '../../../../utils/supabase/client';

export async function POST(request: Request) {
  try {
    const { user_id, activity_id, booking_date, booking_time } = await request.json();

    if (!user_id || !activity_id || !booking_date || !booking_time) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('bookings')
      .insert([
        {
          user_id,
          activity_id,
          booking_date,
          booking_time,
          status: 'confirmed', // Default status for new bookings
        },
      ])
      .select();

    if (error) {
      console.error('Error creating booking:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data[0], { status: 201 });
  } catch (error: any) {
    console.error('Unexpected error:', error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
