CREATE TABLE services (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('advertising', 'building')),
  icon TEXT NOT NULL,
  features TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE portfolios (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('advertising', 'building')),
  image_url TEXT NOT NULL,
  client_name TEXT NOT NULL,
  completion_date DATE NOT NULL,
  location TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE pricing_packages (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('advertising', 'building')),
  price_range TEXT NOT NULL,
  features TEXT[] NOT NULL DEFAULT '{}',
  is_popular BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE testimonials (
  id BIGSERIAL PRIMARY KEY,
  client_name TEXT NOT NULL,
  company TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  project_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE contact_submissions (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  service_type TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample data
INSERT INTO services (name, description, category, icon, features) VALUES
('Baliho & Billboard', 'Pembuatan dan pemasangan baliho berkualitas tinggi dengan desain menarik', 'advertising', 'Billboard', ARRAY['Desain Custom', 'Material Berkualitas', 'Pemasangan Profesional', 'Maintenance']),
('Neon Box & LED Sign', 'Papan nama neon box dan LED sign untuk bisnis Anda', 'advertising', 'Lightbulb', ARRAY['LED Berkualitas', 'Hemat Energi', 'Tahan Cuaca', 'Garansi 2 Tahun']),
('Papan Nama', 'Berbagai jenis papan nama untuk kebutuhan bisnis dan institusi', 'advertising', 'FileText', ARRAY['Material Variatif', 'Desain Profesional', 'Instalasi Cepat', 'Harga Kompetitif']),
('Maintenance AC', 'Perawatan dan perbaikan sistem AC untuk gedung dan perkantoran', 'building', 'Wind', ARRAY['Teknisi Bersertifikat', 'Spare Part Original', 'Layanan 24/7', 'Kontrak Maintenance']),
('Sistem Elektrikal', 'Instalasi dan maintenance sistem elektrikal gedung', 'building', 'Zap', ARRAY['Standar SNI', 'Tim Ahli', 'Peralatan Modern', 'Safety First']),
('Maintenance Gedung', 'Perawatan menyeluruh untuk gedung perkantoran dan komersial', 'building', 'Building', ARRAY['Cleaning Service', 'Preventive Maintenance', 'Emergency Response', 'Laporan Berkala']);

INSERT INTO portfolios (title, description, category, image_url, client_name, completion_date, location) VALUES
('Billboard Mega Mall', 'Pemasangan billboard berukuran 8x4 meter di area strategis mall', 'advertising', '/api/placeholder/600/400', 'PT. Mega Mall Indonesia', '2024-01-15', 'Jakarta Selatan'),
('Neon Box Restoran Chain', 'Pembuatan 15 unit neon box untuk cabang restoran di Jabodetabek', 'advertising', '/api/placeholder/600/400', 'Restoran Nusantara', '2024-02-20', 'Jabodetabek'),
('Maintenance AC Perkantoran', 'Kontrak maintenance AC untuk gedung perkantoran 20 lantai', 'building', '/api/placeholder/600/400', 'PT. Prima Office Tower', '2024-03-10', 'Jakarta Pusat'),
('Sistem Elektrikal Hotel', 'Instalasi sistem elektrikal lengkap untuk hotel bintang 4', 'building', '/api/placeholder/600/400', 'Grand Hotel Jakarta', '2024-01-30', 'Jakarta Barat');

INSERT INTO pricing_packages (name, category, price_range, features, is_popular) VALUES
('Basic Advertising', 'advertising', 'Rp 5-15 Juta', ARRAY['Papan Nama Standar', 'Desain Sederhana', 'Material Dasar', 'Garansi 1 Tahun'], FALSE),
('Premium Advertising', 'advertising', 'Rp 15-50 Juta', ARRAY['Neon Box LED', 'Desain Custom', 'Material Premium', 'Garansi 2 Tahun', 'Maintenance 6 Bulan'], TRUE),
('Enterprise Advertising', 'advertising', 'Rp 50+ Juta', ARRAY['Billboard Besar', 'Desain Eksklusif', 'Material Terbaik', 'Garansi 3 Tahun', 'Maintenance 1 Tahun', 'Konsultasi Gratis'], FALSE),
('Basic Maintenance', 'building', 'Rp 10-25 Juta', ARRAY['AC Maintenance', 'Cleaning Rutin', 'Laporan Bulanan', 'Emergency Call'], FALSE),
('Premium Maintenance', 'building', 'Rp 25-75 Juta', ARRAY['Full Building Maintenance', 'Preventive Maintenance', 'Laporan Mingguan', '24/7 Support', 'Spare Part Included'], TRUE),
('Enterprise Maintenance', 'building', 'Rp 75+ Juta', ARRAY['Complete Facility Management', 'Predictive Maintenance', 'Daily Reports', 'Dedicated Team', 'All Inclusive', 'SLA Guarantee'], FALSE);

INSERT INTO testimonials (client_name, company, rating, comment, project_type) VALUES
('Budi Santoso', 'PT. Maju Bersama', 5, 'Pelayanan sangat profesional, hasil memuaskan dan tepat waktu. Tim sangat responsif terhadap kebutuhan kami.', 'Neon Box'),
('Sari Dewi', 'CV. Berkah Jaya', 5, 'Kualitas maintenance AC sangat baik, gedung kami selalu dalam kondisi optimal. Highly recommended!', 'AC Maintenance'),
('Ahmad Rahman', 'Hotel Grand Permata', 4, 'Sistem elektrikal yang dipasang sangat reliable. Tim teknisi sangat kompeten dan profesional.', 'Electrical System'),
('Linda Wijaya', 'Mall Central Plaza', 5, 'Billboard yang dipasang sangat eye-catching dan berkualitas tinggi. Proses dari desain hingga instalasi sangat smooth.', 'Billboard');
