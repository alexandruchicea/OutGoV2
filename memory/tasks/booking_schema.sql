CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
    booking_date DATE NOT NULL,
    booking_time TIME WITH TIME ZONE NOT NULL,
    status TEXT DEFAULT 'pending', -- e.g., 'pending', 'confirmed', 'cancelled', 'rescheduled'
    cancellation_policy_applied BOOLEAN DEFAULT FALSE,
    UNIQUE (user_id, activity_id, booking_date, booking_time)
);

-- Optional: Add a trigger to automatically update the 'updated_at' column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_bookings_updated_at
BEFORE UPDATE ON bookings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
