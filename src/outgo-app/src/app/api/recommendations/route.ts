import { NextResponse } from 'next/server';
import { supabase } from '../../../utils/supabase/client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Fetch user preferences
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('preferences')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Error fetching user profile for recommendations:', profileError.message);
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    let userPreferences = {};
    if (profile?.preferences) {
      try {
        userPreferences = JSON.parse(profile.preferences);
      } catch (e) {
        console.error('Error parsing user preferences:', e);
      }
    }

    let query = supabase.from('activities').select('*');

    // Apply preference-based filtering (simple example)
    const preferredCategories: string[] = [];
    if ((userPreferences as any).outdoors) preferredCategories.push('outdoors');
    if ((userPreferences as any).arts) preferredCategories.push('arts');
    if ((userPreferences as any).food) preferredCategories.push('food');

    if (preferredCategories.length > 0) {
      // This is a simplified approach. In a real app, you'd have a proper category system.
      // Here, we're just checking if the summary contains any of the preferred categories.
      const categoryFilters = preferredCategories.map(cat => `summary.ilike.%${cat}%`).join(',');
      query = query.or(categoryFilters);
    }

    // Fetch activities based on preferences, or just popular ones if no preferences
    const { data: activities, error: activitiesError } = await query.limit(5);

    if (activitiesError) {
      console.error('Error fetching recommended activities:', activitiesError.message);
      return NextResponse.json({ error: activitiesError.message }, { status: 500 });
    }

    return NextResponse.json(activities, { status: 200 });
  } catch (error: any) {
    console.error('Unexpected error:', error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
