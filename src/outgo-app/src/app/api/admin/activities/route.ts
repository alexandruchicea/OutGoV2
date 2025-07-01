import { NextResponse } from 'next/server';
import { supabase } from '../../../../../utils/supabase/client';

export async function GET() {
  try {
    const { data: activities, error } = await supabase
      .from('activities')
      .select('*');

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

export async function POST(request: Request) {
  try {
    const { name, firm, summary, description, period_start, period_end, price, currency, location, image_url, merchant_id, status } = await request.json();

    const { data, error } = await supabase
      .from('activities')
      .insert([
        {
          name, firm, summary, description, period_start, period_end, price, currency, location, image_url, merchant_id, status
        },
      ])
      .select();

    if (error) {
      console.error('Error creating activity:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data[0], { status: 201 });
  } catch (error: any) {
    console.error('Unexpected error:', error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
