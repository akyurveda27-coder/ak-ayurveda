-- AK Ayurveda — Supabase Schema & Seed Data
-- Run this in your Supabase SQL editor

-- ─── Tables ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS site_content (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT '🌿',
  sort_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS conditions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  icon TEXT DEFAULT '🌿',
  sort_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote TEXT NOT NULL,
  patient_name TEXT NOT NULL,
  city TEXT,
  stars INT DEFAULT 5,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  service TEXT,
  preferred_date DATE,
  message TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── RLS Policies ──────────────────────────────────────────────────────────
-- Enable Row Level Security (adjust as needed for production)

ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Allow public read on all content tables
CREATE POLICY "Public read site_content" ON site_content FOR SELECT USING (true);
CREATE POLICY "Public read services" ON services FOR SELECT USING (true);
CREATE POLICY "Public read conditions" ON conditions FOR SELECT USING (true);
CREATE POLICY "Public read testimonials" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Public read faqs" ON faqs FOR SELECT USING (true);

-- Allow public insert on appointments (booking form)
CREATE POLICY "Public insert appointments" ON appointments FOR INSERT WITH CHECK (true);

-- Allow full access from service role (admin operations from Next.js API)
CREATE POLICY "Service role full access site_content" ON site_content USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access services" ON services USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access conditions" ON conditions USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access testimonials" ON testimonials USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access faqs" ON faqs USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access appointments" ON appointments USING (auth.role() = 'service_role');

-- For development/testing: allow anon to do everything (remove in production)
-- CREATE POLICY "Anon full access" ON site_content USING (true) WITH CHECK (true);

-- ─── Seed Data ─────────────────────────────────────────────────────────────

-- Hero content
INSERT INTO site_content (key, value) VALUES (
  'hero',
  '{
    "heading": "Ancient Wisdom, Modern Healing",
    "subheading": "Experience the transformative power of authentic Ayurvedic medicine. Holistic treatments rooted in 5000 years of Vedic science, personalized for your unique constitution.",
    "cta1_text": "Book Appointment",
    "cta1_link": "#book-appointment",
    "cta2_text": "Explore Treatments",
    "cta2_link": "#services"
  }'::jsonb
) ON CONFLICT (key) DO NOTHING;

-- Stats
INSERT INTO site_content (key, value) VALUES (
  'stats',
  '{
    "stat1_value": "15+",
    "stat1_label": "Years Experience",
    "stat2_value": "8000+",
    "stat2_label": "Patients Treated",
    "stat3_value": "40+",
    "stat3_label": "Treatments",
    "stat4_value": "4.9/5",
    "stat4_label": "Patient Rating"
  }'::jsonb
) ON CONFLICT (key) DO NOTHING;

-- Doctor
INSERT INTO site_content (key, value) VALUES (
  'doctor',
  '{
    "name": "Dr. Anjali Kumar",
    "title": "Chief Physician & Founder",
    "degree": "BAMS, MD (Ayurveda)",
    "bio": "Dr. Anjali Kumar is a distinguished Ayurvedic physician with over 15 years of clinical experience. She completed her BAMS from Gujarat Ayurved University and pursued her MD specialization in Kayachikitsa (Internal Medicine). Her approach blends classical Ayurvedic principles with contemporary medical understanding, offering truly integrative healthcare.",
    "experience": "15+ years of clinical practice",
    "specialization": "Panchakarma, Chronic Disease Management, Women'\''s Health",
    "photo_url": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=80"
  }'::jsonb
) ON CONFLICT (key) DO NOTHING;

-- Contact
INSERT INTO site_content (key, value) VALUES (
  'contact',
  '{
    "address": "42, Ayurveda Lane, Koramangala, Bengaluru – 560034",
    "phone": "+91 98765 43210",
    "email": "care@akayurveda.in",
    "hours": "Mon–Sat: 9:00 AM – 7:00 PM",
    "facebook_url": "https://facebook.com",
    "instagram_url": "https://instagram.com",
    "twitter_url": "https://twitter.com",
    "youtube_url": "https://youtube.com"
  }'::jsonb
) ON CONFLICT (key) DO NOTHING;

-- Services
INSERT INTO services (name, description, icon, sort_order) VALUES
  ('Panchakarma', 'The classical five-action detoxification therapy that purifies the body, restores balance, and rejuvenates the entire system from within.', '🌿', 1),
  ('Abhyanga', 'Therapeutic full-body warm oil massage using medicated herbal oils to nourish tissues, improve circulation, and calm the nervous system.', '🫧', 2),
  ('Shirodhara', 'A continuous stream of warm medicated oil poured over the forehead — deeply relaxing, relieves mental stress, anxiety, and insomnia.', '💧', 3),
  ('Herbal Medicine', 'Personalized classical Ayurvedic formulations and herbal preparations crafted to address your specific health concerns and constitution.', '🌱', 4),
  ('Diet & Nutrition', 'Customized Ahara (dietary) guidance based on your Prakriti, season, and health goals — food as medicine.', '🥗', 5),
  ('Yoga & Pranayama', 'Therapeutic yoga sequences and breathwork practices designed to complement your Ayurvedic treatment plan.', '🧘', 6)
ON CONFLICT DO NOTHING;

-- Conditions
INSERT INTO conditions (name, icon, sort_order) VALUES
  ('Joint & Arthritis', '🦴', 1),
  ('Digestive Health', '🫁', 2),
  ('Skin Disorders', '✨', 3),
  ('Stress & Anxiety', '🧠', 4),
  ('Respiratory', '💨', 5),
  ('Women''s Health', '🌸', 6)
ON CONFLICT DO NOTHING;

-- Testimonials
INSERT INTO testimonials (quote, patient_name, city, stars, is_active) VALUES
  ('After years of struggling with arthritis, Dr. Anjali''s Panchakarma treatment gave me my life back. The pain has reduced by 80% and I feel younger than ever.', 'Ramesh Nair', 'Bengaluru', 5, true),
  ('Shirodhara has been transformative for my anxiety. I was skeptical at first, but after 3 sessions, my sleep improved dramatically and I feel genuinely calm.', 'Priya Sharma', 'Mumbai', 5, true),
  ('My digestive issues of 10 years were resolved with a customised herbal regimen and diet plan. The holistic approach here is truly unlike anything I''ve experienced.', 'Kavitha Menon', 'Chennai', 5, true),
  ('The Abhyanga massage combined with medicated oils has completely transformed my skin. My chronic eczema is 90% better. Dr. Kumar is exceptional.', 'Arjun Mehta', 'Pune', 5, true)
ON CONFLICT DO NOTHING;

-- FAQs
INSERT INTO faqs (question, answer, sort_order) VALUES
  ('What is Ayurveda?', 'Ayurveda is one of the world''s oldest holistic healing systems, developed more than 3,000 years ago in India. It is based on the belief that health and wellness depend on a delicate balance between the mind, body, and spirit.', 1),
  ('How long does a treatment session take?', 'Treatment duration varies by therapy. A consultation is typically 45–60 minutes. Panchakarma programs run 7–21 days. Individual therapies like Abhyanga or Shirodhara are usually 60–90 minutes.', 2),
  ('Is Ayurveda safe alongside modern medicine?', 'Yes, Ayurveda can be safely integrated with modern medicine when guided by a qualified practitioner. Always inform both your allopathic and Ayurvedic doctors about all medications you are taking.', 3),
  ('How many sessions will I need?', 'The number of sessions depends on your condition, severity, and constitution. Acute conditions may resolve in 3–5 sessions, while chronic conditions often require 2–3 months of treatment.', 4),
  ('Do you offer online consultations?', 'Yes, we offer teleconsultation for initial assessments, follow-ups, and dietary guidance. Hands-on Panchakarma therapies require in-person visits.', 5),
  ('What should I bring to my first appointment?', 'Please bring any previous medical reports, a list of current medications, and wear comfortable clothing. Arrive 10 minutes early to complete intake forms.', 6)
ON CONFLICT DO NOTHING;
