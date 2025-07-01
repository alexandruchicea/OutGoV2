import { NextResponse } from 'next/server';
import { supabase } from '../../../../../utils/supabase/client';

export async function POST(request: Request) {
  try {
    const { name, contact_email, description } = await request.json();

    if (!name || !contact_email) {
      return NextResponse.json({ error: 'Business name and contact email are required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('merchants')
      .insert([
        {
          name,
          contact_email,
          description,
          status: 'pending', // Default status for new submissions
        },
      ])
      .select();

    if (error) {
      console.error('Error submitting merchant business:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data[0], { status: 201 });
  } catch (error: any) {
    console.error('Unexpected error:', error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
