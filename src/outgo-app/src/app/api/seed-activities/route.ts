import { createServerSupabaseClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = createServerSupabaseClient();

  const activities = [
    {
      id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      name: 'City Bike Tour',
      firm: 'Urban Adventures',
      summary: 'Explore the city on two wheels!',
      description: 'Join us for a fun and informative bike tour through the historic streets of the city. Discover hidden gems and iconic landmarks.',
      period_start: '2025-07-10T09:00:00Z',
      period_end: '2025-07-10T12:00:00Z',
      price: 35.00,
      currency: 'USD',
      location: 'Downtown Plaza',
      image_url: 'https://example.com/bike-tour.jpg',
      merchant_id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      status: 'active',
    },
    {
      id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
      name: 'Sunset Kayaking',
      firm: 'Water Sports Co.',
      summary: 'Paddle into the sunset!',
      description: 'Experience the tranquility of the lake as you paddle into a breathtaking sunset. All skill levels welcome.',
      period_start: '2025-07-15T18:30:00Z',
      period_end: '2025-07-15T20:30:00Z',
      price: 50.00,
      currency: 'USD',
      location: 'Lakeview Marina',
      image_url: 'https://example.com/kayaking.jpg',
      merchant_id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      status: 'active',
    },
    {
      id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
      name: 'Cooking Class: Italian Pasta',
      firm: 'Culinary Arts Studio',
      summary: 'Learn to make authentic Italian pasta from scratch!',
      description: 'Our expert chefs will guide you through the process of making delicious homemade pasta and classic sauces.',
      period_start: '2025-07-20T17:00:00Z',
      period_end: '2025-07-20T20:00:00Z',
      price: 75.00,
      currency: 'USD',
      location: 'Arts District Kitchen',
      image_url: 'https://example.com/pasta-class.jpg',
      merchant_id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      status: 'active',
    },
  ];

  const { data, error } = await supabase.from('activities').insert(activities);

  if (error) {
    console.error('Error inserting activities:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Activities seeded successfully', data });
}