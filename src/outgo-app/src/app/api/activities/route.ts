import { NextResponse } from 'next/server';
import { supabase } from '../../../utils/supabase/client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get('search');
    const sortBy = searchParams.get('sortBy');
    const userLat = searchParams.get('latitude');
    const userLon = searchParams.get('longitude');
    const category = searchParams.get('category');

    let query = supabase.from('activities').select('*');

    if (searchTerm) {
      query = query.or(`name.ilike.%${searchTerm}%,summary.ilike.%${searchTerm}%`);
    }

    if (category) {
      // This is a placeholder for category filtering. You would need a 'category' column
      // or a separate 'activity_categories' table to implement this properly.
      // For now, we'll just add a dummy filter or assume 'summary' contains categories.
      query = query.ilike('summary', `%${category}%`); // Example: filter by category in summary
    }

    if (userLat && userLon) {
      // Placeholder for proximity sorting. This would ideally use PostGIS or a similar extension
      // For now, we'll just fetch all and sort on the client or add a dummy sort.
      // To implement proper proximity search, the 'activities' table needs 'latitude' and 'longitude' columns.
      // Example (conceptual, requires PostGIS setup and data):
      // query = query.order(
      //   supabase.raw(`ST_Distance(location_geom, ST_MakePoint(${userLon}, ${userLat}))`)
      // );
    }

    if (sortBy) {
      switch (sortBy) {
        case 'name_asc':
          query = query.order('name', { ascending: true });
          break;
        case 'name_desc':
          query = query.order('name', { ascending: false });
          break;
        case 'price_asc':
          query = query.order('price', { ascending: true });
          break;
        case 'price_desc':
          query = query.order('price', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false }); // Default sort
          break;
      }
    } else if (!userLat || !userLon) {
      query = query.order('created_at', { ascending: false }); // Default sort if no sortBy and no location
    }

    const { data: activities, error } = await query;

    if (error) {
      console.error('Error fetching activities:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(activities, { status: 200 });
  } catch (error: any) {
    console.error('Unexpected error:', error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
