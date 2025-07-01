import { NextResponse } from 'next/server';
import { supabase } from '../../../../utils/supabase/client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const { data: friends, error } = await supabase
      .from('friends')
      .select('*, friend_id(name, email)') // Assuming profiles table has name and email
      .eq('user_id', userId)
      .eq('status', 'accepted');

    if (error) {
      console.error('Error fetching friends:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(friends, { status: 200 });
  } catch (error: any) {
    console.error('Unexpected error:', error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { user_id, friend_id } = await request.json();

    if (!user_id || !friend_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if a friend request already exists or if they are already friends
    const { data: existingFriendship, error: existingError } = await supabase
      .from('friends')
      .select('*')
      .or(`and(user_id.eq.${user_id},friend_id.eq.${friend_id}),and(user_id.eq.${friend_id},friend_id.eq.${user_id})`);

    if (existingError) {
      console.error('Error checking existing friendship:', existingError.message);
      return NextResponse.json({ error: existingError.message }, { status: 500 });
    }

    if (existingFriendship && existingFriendship.length > 0) {
      return NextResponse.json({ error: 'Friendship already exists or request pending' }, { status: 409 });
    }

    const { data, error } = await supabase
      .from('friends')
      .insert([
        {
          user_id,
          friend_id,
          status: 'pending', // Initial status for a new friend request
        },
      ])
      .select();

    if (error) {
      console.error('Error sending friend request:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data[0], { status: 201 });
  } catch (error: any) {
    console.error('Unexpected error:', error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { user_id, friend_id, status } = await request.json();

    if (!user_id || !friend_id || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('friends')
      .update({ status })
      .eq('user_id', user_id)
      .eq('friend_id', friend_id)
      .select();

    if (error) {
      console.error('Error updating friend status:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'Friendship not found' }, { status: 404 });
    }

    return NextResponse.json(data[0], { status: 200 });
  } catch (error: any) {
    console.error('Unexpected error:', error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { user_id, friend_id } = await request.json();

    if (!user_id || !friend_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { error } = await supabase
      .from('friends')
      .delete()
      .eq('user_id', user_id)
      .eq('friend_id', friend_id);

    if (error) {
      console.error('Error deleting friend:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Friend removed successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Unexpected error:', error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
