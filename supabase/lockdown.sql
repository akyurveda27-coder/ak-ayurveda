-- ============================================================================
-- AK Ayurveda — Supabase security lockdown
-- ============================================================================
-- Run this ONCE in Supabase → SQL Editor, AFTER setting these in Vercel:
--   ADMIN_PASSWORD             (your new admin panel password)
--   SUPABASE_SERVICE_ROLE_KEY  (Supabase → Settings → API → service_role key)
--
-- What it does: the public (anon) key can only READ published website content
-- and submit nothing. Every write, and every read of customer data, now has to
-- go through the password-protected admin API on the server.
-- ============================================================================

ALTER TABLE site_content  ENABLE ROW LEVEL SECURITY;
ALTER TABLE services      ENABLE ROW LEVEL SECURITY;
ALTER TABLE conditions    ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials  ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs          ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments  ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs         ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews       ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_slots    ENABLE ROW LEVEL SECURITY;

-- Remove every existing policy so no old permissive rule survives.
DO $$
DECLARE p RECORD;
BEGIN
  FOR p IN
    SELECT policyname, tablename FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN ('site_content','services','conditions','testimonials',
                        'faqs','appointments','blogs','reviews','time_slots')
  LOOP
    EXECUTE format('DROP POLICY %I ON public.%I', p.policyname, p.tablename);
  END LOOP;
END $$;

-- ── Public read: website content only ───────────────────────────────────────
CREATE POLICY "public read site_content" ON site_content FOR SELECT USING (true);
CREATE POLICY "public read services"     ON services     FOR SELECT USING (true);
CREATE POLICY "public read conditions"   ON conditions   FOR SELECT USING (true);
CREATE POLICY "public read faqs"         ON faqs         FOR SELECT USING (true);
CREATE POLICY "public read time_slots"   ON time_slots   FOR SELECT USING (true);
CREATE POLICY "public read active testimonials" ON testimonials FOR SELECT USING (is_active = true);
CREATE POLICY "public read published blogs"     ON blogs        FOR SELECT USING (published = true);

-- ── No public policy at all for appointments and reviews ────────────────────
-- Customer names, emails and phone numbers are readable only by the service
-- role (the admin API), never with the public key.

-- Verify: this should list only the SELECT policies created above.
SELECT tablename, policyname, cmd FROM pg_policies
WHERE schemaname = 'public' ORDER BY tablename;
