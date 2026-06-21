-- Drop existing insecure policies
DROP POLICY IF EXISTS insert_booking ON bookings;
DROP POLICY IF EXISTS update_bookings ON bookings;
DROP POLICY IF EXISTS insert_contact_message ON contact_messages;
DROP POLICY IF EXISTS insert_subscriber ON newsletter_subscribers;
DROP POLICY IF EXISTS insert_testimonial ON testimonials;

-- Bookings: Allow insert with required field validation
CREATE POLICY "insert_booking" ON bookings FOR INSERT
  TO anon, authenticated 
  WITH CHECK (
    name IS NOT NULL 
    AND length(name) >= 2 
    AND phone IS NOT NULL 
    AND length(phone) >= 10
    AND email IS NOT NULL 
    AND email ~ '^[^@]+@[^@]+\.[^@]+$'
    AND birth_date IS NOT NULL
    AND birth_time IS NOT NULL
    AND birth_place IS NOT NULL
    AND consultation_type IS NOT NULL
    AND preferred_date IS NOT NULL
  );

-- Bookings: Update restricted to service role (admin)
CREATE POLICY "update_bookings" ON bookings FOR UPDATE
  TO authenticated 
  USING (auth.jwt() ->> 'role' = 'service_role')
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- Contact messages: Allow insert with validation
CREATE POLICY "insert_contact_message" ON contact_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    name IS NOT NULL 
    AND length(name) >= 2
    AND email IS NOT NULL 
    AND email ~ '^[^@]+@[^@]+\.[^@]+$'
    AND subject IS NOT NULL
    AND length(subject) >= 3
    AND message IS NOT NULL
    AND length(message) >= 10
  );

-- Newsletter: Allow insert with email validation
CREATE POLICY "insert_subscriber" ON newsletter_subscribers FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    email IS NOT NULL 
    AND email ~ '^[^@]+@[^@]+\.[^@]+$'
    AND is_active = TRUE
  );

-- Testimonials: Allow insert with required field validation
CREATE POLICY "insert_testimonial" ON testimonials FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    name IS NOT NULL 
    AND length(name) >= 2
    AND location IS NOT NULL
    AND rating IS NOT NULL 
    AND rating >= 1 
    AND rating <= 5
    AND comment IS NOT NULL
    AND length(comment) >= 10
    AND service IS NOT NULL
    AND is_approved = FALSE
  );
