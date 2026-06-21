CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "insert_contact_message" ON contact_messages FOR INSERT
  TO anon, authenticated WITH CHECK (true);

CREATE POLICY "select_contact_messages" ON contact_messages FOR SELECT
  TO authenticated USING (true);

CREATE INDEX idx_contact_messages_created_at ON contact_messages(created_at DESC);
