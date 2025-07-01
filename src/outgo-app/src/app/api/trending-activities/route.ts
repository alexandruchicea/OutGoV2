import { NextResponse } from 'next/server';
import { supabase } from '../../../utils/supabase/client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'trending' or 'highly-rated'

    let query = supabase.from('activities').select('*');

    if (type === 'trending') {
      // Simplified trending: order by creation date for now
      // In a real app, this would involve complex queries on bookings/views
      query = query.order('created_at', { ascending: false });
    } else if (type === 'highly-rated') {
      // Simplified highly-rated: order by a dummy rating for now
      // In a real app, this would involve aggregating data from the 'reviews' table
      query = query.order('price', { ascending: false }); // Using price as a proxy for rating for now
    }

    const { data: activities, error } = await query.limit(5);

    if (error) {
      console.error('Error fetching trending/highly-rated activities:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(activities, { status: 200 });
  } catch (error: any) {
    console.error('Unexpected error:', error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
