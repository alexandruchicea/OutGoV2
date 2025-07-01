CREATE TABLE activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    firm TEXT NOT NULL,
    summary TEXT,
    description TEXT,
    period_start TIMESTAMPTZ,
    period_end TIMESTAMPTZ,
    price NUMERIC(10, 2),
    currency TEXT,
    location TEXT,
    image_url TEXT,
    merchant_id UUID REFERENCES merchants(id),
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Optional: Add RLS policies if not already handled globally
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public activities are viewable by everyone."
  ON activities FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert activities."
  ON activities FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update their own activities."
  ON activities FOR UPDATE
  USING (auth.uid() = merchant_id); -- Assuming merchant_id is the user_id for activities

CREATE POLICY "Authenticated users can delete their own activities."
  ON activities FOR DELETE
  USING (auth.uid() = merchant_id); -- Assuming merchant_id is the user_id for activities