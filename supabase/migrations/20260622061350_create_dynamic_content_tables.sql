-- Services table
CREATE TABLE services (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  image TEXT NOT NULL,
  features TEXT[] NOT NULL,
  price_amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'INR',
  duration TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Astrologer profile table
CREATE TABLE astrologer_profile (
  id INTEGER PRIMARY KEY DEFAULT 1,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  experience TEXT NOT NULL,
  image TEXT NOT NULL,
  specializations TEXT[] NOT NULL,
  achievements TEXT[] NOT NULL,
  certifications TEXT[] NOT NULL,
  mission TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT single_profile CHECK (id = 1)
);

-- FAQ table
CREATE TABLE faqs (
  id SERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blogs table
CREATE TABLE blogs (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT,
  image TEXT NOT NULL,
  category TEXT NOT NULL,
  author TEXT NOT NULL,
  date DATE NOT NULL,
  read_time TEXT NOT NULL,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Zodiac signs table
CREATE TABLE zodiac_signs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  symbol TEXT NOT NULL,
  date_range TEXT NOT NULL,
  element TEXT NOT NULL,
  traits TEXT[] NOT NULL,
  display_order INTEGER DEFAULT 0
);

-- Daily horoscopes table
CREATE TABLE daily_horoscopes (
  id SERIAL PRIMARY KEY,
  zodiac_sign_id TEXT REFERENCES zodiac_signs(id),
  horoscope_date DATE NOT NULL,
  horoscope TEXT NOT NULL,
  lucky_color TEXT,
  lucky_number INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(zodiac_sign_id, horoscope_date)
);

-- Festivals table
CREATE TABLE festivals (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  festival_date TEXT NOT NULL,
  description TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

-- Enable RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE astrologer_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE zodiac_signs ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_horoscopes ENABLE ROW LEVEL SECURITY;
ALTER TABLE festivals ENABLE ROW LEVEL SECURITY;

-- RLS Policies (public read, authenticated write)
CREATE POLICY "services_public_read" ON services FOR SELECT TO public USING (is_active = true);
CREATE POLICY "services_authenticated_write" ON services FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "astrologer_public_read" ON astrologer_profile FOR SELECT TO public USING (true);
CREATE POLICY "astrologer_authenticated_write" ON astrologer_profile FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "faqs_public_read" ON faqs FOR SELECT TO public USING (is_active = true);
CREATE POLICY "faqs_authenticated_write" ON faqs FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "blogs_public_read" ON blogs FOR SELECT TO public USING (is_published = true);
CREATE POLICY "blogs_authenticated_write" ON blogs FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "zodiac_public_read" ON zodiac_signs FOR SELECT TO public USING (true);
CREATE POLICY "zodiac_authenticated_write" ON zodiac_signs FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "horoscopes_public_read" ON daily_horoscopes FOR SELECT TO public USING (true);
CREATE POLICY "horoscopes_authenticated_write" ON daily_horoscopes FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "festivals_public_read" ON festivals FOR SELECT TO public USING (is_active = true);
CREATE POLICY "festivals_authenticated_write" ON festivals FOR ALL TO authenticated USING (true) WITH CHECK (true);
