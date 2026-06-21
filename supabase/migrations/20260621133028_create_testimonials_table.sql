CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  avatar TEXT,
  service TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "insert_testimonial" ON testimonials FOR INSERT
  TO anon, authenticated WITH CHECK (true);

CREATE POLICY "select_approved_testimonials" ON testimonials FOR SELECT
  TO anon, authenticated USING (is_approved = TRUE);

CREATE POLICY "select_all_testimonials" ON testimonials FOR SELECT
  TO authenticated USING (true);

CREATE INDEX idx_testimonials_approved ON testimonials(is_approved);
