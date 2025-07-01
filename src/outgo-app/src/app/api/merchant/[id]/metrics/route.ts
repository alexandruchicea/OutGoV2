import { NextResponse } from 'next/server';
import { supabase } from '../../../../../../utils/supabase/client';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id: merchantId } = params;

    // Fetch total activities
    const { count: totalActivities, error: activitiesError } = await supabase
      .from('activities')
      .select('id', { count: 'exact' })
      .eq('merchant_id', merchantId);

    if (activitiesError) {
      console.error('Error fetching total activities:', activitiesError.message);
      return NextResponse.json({ error: activitiesError.message }, { status: 500 });
    }

    // Fetch total bookings and pending bookings
    const { data: bookings, count: totalBookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('id, status, activities(price)', { count: 'exact' })
      .eq('activities.merchant_id', merchantId);

    if (bookingsError) {
      console.error('Error fetching bookings for metrics:', bookingsError.message);
      return NextResponse.json({ error: bookingsError.message }, { status: 500 });
    }

    const pendingBookings = bookings?.filter(b => b.status === 'pending').length || 0;
    const confirmedBookings = bookings?.filter(b => b.status === 'confirmed').length || 0;

    // Calculate revenue (simplified: sum of prices of confirmed bookings)
    const revenue = bookings?.reduce((sum, booking) => {
      if (booking.status === 'confirmed' && booking.activities?.price) {
        return sum + booking.activities.price;
      }
      return sum;
    }, 0) || 0;

    // Placeholder for average rating and conversion rate
    const averageRating = 4.5; // This would come from a reviews table
    const conversionRate = 0.15; // This would be calculated based on views vs bookings

    return NextResponse.json({
      totalActivities,
      totalBookings,
      pendingBookings,
      confirmedBookings,
      revenue,
      averageRating,
      conversionRate,
    }, { status: 200 });
  } catch (error: any) {
    console.error('Unexpected error:', error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
