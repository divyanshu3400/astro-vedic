CREATE TABLE newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT TRUE,
  subscribed_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "insert_subscriber" ON newsletter_subscribers FOR INSERT
  TO anon, authenticated WITH CHECK (true);

CREATE POLICY "select_subscribers" ON newsletter_subscribers FOR SELECT
  TO authenticated USING (true);

CREATE UNIQUE INDEX idx_subscribers_email ON newsletter_subscribers(email);
