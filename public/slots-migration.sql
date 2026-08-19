-- ============================================================
-- AK Ayurveda — Slot Booking System Migration
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Create time_slots table
CREATE TABLE IF NOT EXISTS time_slots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_blocked BOOLEAN DEFAULT false,
  hold_until TIMESTAMPTZ DEFAULT NULL,
  hold_booking_id UUID DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(date, start_time)
);

-- 2. Add slot_id to appointments
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS slot_id UUID REFERENCES time_slots(id);

-- 3. Enable RLS + policies
ALTER TABLE time_slots ENABLE ROW LEVEL SECURITY;

-- Anyone can read slots (to see availability)
DROP POLICY IF EXISTS "Public can read slots" ON time_slots;
CREATE POLICY "Public can read slots" ON time_slots FOR SELECT USING (true);

-- Only service role can insert/update/delete
DROP POLICY IF EXISTS "Service role full access" ON time_slots;
CREATE POLICY "Service role full access" ON time_slots FOR ALL USING (auth.role() = 'service_role');

-- 4. Index for fast date lookups
CREATE INDEX IF NOT EXISTS idx_time_slots_date ON time_slots(date);

-- Done! Admin can now create slots via the Admin Panel → Slots tab.
