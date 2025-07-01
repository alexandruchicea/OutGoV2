import { NextResponse } from 'next/server';
import { supabase } from '../../../../utils/supabase/client';

export async function POST(request: Request) {
  try {
    const { user_id, activity_id } = await request.json();

    if (!user_id || !activity_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('likes')
      .insert([
        {
          user_id,
          activity_id,
        },
      ])
      .select();

    if (error) {
      console.error('Error creating like:', error.message);
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
      .from('likes')
      .delete()
      .eq('user_id', user_id)
      .eq('activity_id', activity_id);

    if (error) {
      console.error('Error deleting like:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Like removed successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Unexpected error:', error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
