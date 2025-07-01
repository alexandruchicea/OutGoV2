import { NextResponse } from 'next/server';
import { supabase } from '../../../../utils/supabase/client';

export async function POST(request: Request) {
  try {
    const { user_id, activity_id } = await request.json();

    if (!user_id || !activity_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('favorites')
      .insert([
        {
          user_id,
          activity_id,
        },
      ])
      .select();

    if (error) {
      console.error('Error adding to favorites:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data[0], { status: 201 });
  } catch (error: any) {
    console.error('Unexpected error:', error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { user_id, activity_id } = await request.json();

    if (!user_id || !activity_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user_id)
      .eq('activity_id', activity_id);

    if (error) {
      console.error('Error removing from favorites:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Removed from favorites successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Unexpected error:', error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');
    const activity_id = searchParams.get('activity_id');

    if (!user_id || !activity_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', user_id)
      .eq('activity_id', activity_id);

    if (error) {
      console.error('Error checking favorite status:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ isFavorite: data && data.length > 0 }, { status: 200 });
  } catch (error: any) {
    console.error('Unexpected error:', error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
