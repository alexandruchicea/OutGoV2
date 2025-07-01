import { NextResponse } from 'next/server';
import { supabase } from '../../../../../utils/supabase/client';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // Optional: Implement 24h cancellation policy logic here
    // const { data: booking, error: fetchError } = await supabase
    //   .from('bookings')
    //   .select('booking_date')
    //   .eq('id', id)
    //   .single();

    // if (fetchError) {
    //   console.error('Error fetching booking for cancellation check:', fetchError.message);
    //   return NextResponse.json({ error: fetchError.message }, { status: 500 });
    // }

    // const bookingDate = new Date(booking.booking_date);
    // const now = new Date();
    // const diffHours = Math.abs(bookingDate.getTime() - now.getTime()) / 36e5;

    // if (diffHours < 24) {
    //   return NextResponse.json({ error: 'Cancellation not allowed within 24 hours of booking.' }, { status: 403 });
    // }

    const { error } = await supabase
      .from('bookings')
      .update({ status: 'cancelled', cancellation_policy_applied: true })
      .eq('id', id);

    if (error) {
      console.error('Error canceling booking:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Booking cancelled successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Unexpected error:', error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { booking_date, booking_time } = await request.json();

    if (!booking_date || !booking_time) {
      return NextResponse.json({ error: 'Missing required fields for rescheduling' }, { status: 400 });
    }

    const { error } = await supabase
      .from('bookings')
      .update({ booking_date, booking_time, status: 'rescheduled' })
      .eq('id', id);

    if (error) {
      console.error('Error rescheduling booking:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Booking rescheduled successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Unexpected error:', error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const { data: booking, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching booking:', error.message);
      if (error.code === 'PGRST116') { // No rows found
        return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(booking, { status: 200 });
  } catch (error: any) {
    console.error('Unexpected error:', error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
