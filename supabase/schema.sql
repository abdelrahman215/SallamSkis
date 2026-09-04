-- Sallam Skis Database Schema
-- Run this in your Supabase SQL Editor

-- Services
CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  benefits TEXT[] DEFAULT '{}',
  price TEXT,
  image_url TEXT,
  icon TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Appointments
CREATE TABLE IF NOT EXISTS appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (appointment_date, appointment_time)
);

-- Availability slots (for blocking dates/times or setting custom hours)
CREATE TABLE IF NOT EXISTS availability_slots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6),
  specific_date DATE,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_blocked BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gallery images
CREATE TABLE IF NOT EXISTS gallery_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  caption TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  review TEXT NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact messages
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(is_active);

-- Row Level Security
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public can read active services" ON services FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read active gallery" ON gallery_images FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read active testimonials" ON testimonials FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read availability" ON availability_slots FOR SELECT USING (true);

-- Public insert policies
CREATE POLICY "Public can create appointments" ON appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can send contact messages" ON contact_messages FOR INSERT WITH CHECK (true);

-- Public can read booked times (to prevent double booking on client)
CREATE POLICY "Public can read appointment times" ON appointments FOR SELECT USING (status != 'cancelled');

-- Admin policies (authenticated users)
CREATE POLICY "Admin full access services" ON services FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access appointments" ON appointments FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access availability" ON availability_slots FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access gallery" ON gallery_images FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access testimonials" ON testimonials FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access messages" ON contact_messages FOR ALL USING (auth.role() = 'authenticated');

-- Seed default services
INSERT INTO services (name, description, benefits, price, icon, image_url, sort_order) VALUES
  ('Jet Ski Rental', 'Premium Yamaha WaveRunner rentals for solo riders or groups.', ARRAY['Latest model WaveRunners', 'Safety gear included', 'Flexible hourly rates'], 'From $89/hr', 'waves', '/images/gallery-1.png', 1),
  ('Guided Tours', 'Explore hidden gems with experienced local guides.', ARRAY['Expert local guides', 'Scenic routes', 'Photo opportunities'], 'From $149/person', 'compass', '/images/gallery-3.png', 2),
  ('Group Adventures', 'Custom packages for birthdays, parties, and team outings.', ARRAY['Group discounts', 'Custom itineraries', 'Dedicated support'], 'Custom pricing', 'users', '/images/gallery-4.png', 3),
  ('Sunset Rides', 'Experience golden hour on the water — our most popular ride.', ARRAY['Golden hour timing', 'Premium locations', 'Unforgettable views'], 'From $119/person', 'sunset', '/images/gallery-5.png', 4)
ON CONFLICT DO NOTHING;

-- Seed testimonials
INSERT INTO testimonials (customer_name, review, rating, sort_order) VALUES
  ('Marcus T.', 'Best jet ski experience in Miami! Equipment was top-notch and staff made us feel like VIPs.', 5, 1),
  ('Sarah & James', 'Sunset ride for our anniversary was magical. Professional, fun, and worth every penny.', 5, 2),
  ('Diego R.', 'Bachelor party with 6 friends — Sallam Skis handled everything perfectly!', 5, 3),
  ('Emily K.', 'First time on a jet ski and guides were patient and encouraging. 10/10 recommend!', 5, 4)
ON CONFLICT DO NOTHING;
