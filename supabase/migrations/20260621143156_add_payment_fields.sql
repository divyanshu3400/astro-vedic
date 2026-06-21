ALTER TABLE bookings ADD COLUMN payment_id TEXT;
ALTER TABLE bookings ADD COLUMN payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed'));
ALTER TABLE bookings ADD COLUMN payment_amount INTEGER;
ALTER TABLE bookings ADD COLUMN order_id TEXT;

CREATE INDEX idx_bookings_payment_status ON bookings(payment_status);
