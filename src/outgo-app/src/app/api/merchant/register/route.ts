import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { name, contact_email, description, user_id } = await request.json();
  const supabase = createRouteHandlerClient({ cookies });

  try {
    // Check if a merchant record already exists for this user_id
    const { data: existingMerchant, error: existingMerchantError } = await supabase
      .from('merchants')
      .select('id')
      .eq('user_id', user_id)
      .single();

    if (existingMerchantError && existingMerchantError.code !== 'PGRST116') { // PGRST116 means no rows found
      throw existingMerchantError;
    }

    if (existingMerchant) {
      return NextResponse.json({ error: 'User already registered as a merchant.' }, { status: 409 });
    }

    const { data, error } = await supabase.from('merchants').insert([
      {
        name,
        contact_email,
        description,
        user_id,
      },
    ]);

    if (error) {
      throw error;
    }

    return NextResponse.json({ message: 'Merchant registered successfully!', data }, { status: 201 });
  } catch (error: any) {
    console.error('Error registering merchant:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}