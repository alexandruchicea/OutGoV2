import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '../../../../../utils/supabase/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = await createServerSupabaseClient();
    const { id: userId } = await params;

    const { data: favorites, error } = await supabase
      .from('favorites')
      .select('*') // Select all favorite fields
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching user favorites:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(favorites, { status: 200 });
  } catch (error: any) {
    console.error('Unexpected error:', error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
