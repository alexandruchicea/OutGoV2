import { NextResponse } from 'next/server';
import { supabase } from '../../../../../utils/supabase/client';

export async function GET() {
  try {
    const { data: merchants, error } = await supabase
      .from('merchants')
      .select('*');

    if (error) {
      console.error('Error fetching merchants:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(merchants, { status: 200 });
  } catch (error: any) {
    console.error('Unexpected error:', error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
