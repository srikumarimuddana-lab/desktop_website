-- =====================================================
-- SPINR PROMOTIONS — ONE-CLICK MIGRATION
-- =====================================================
-- Paste this entire file into Supabase SQL Editor and click RUN.
-- It is idempotent — safe to re-run. Creates everything needed:
--   • promotions          (CMS-managed quest offers)
--   • promotion_coupons   (single-use codes, 24h TTL, SMS status)
--   • promotion_signups   (driver registrations)
-- Plus indexes, RLS policies, and the seed for driver-200-bonus.
-- =====================================================

-- -----------------------------------------------------
-- TABLE: promotions
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.promotions (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                text NOT NULL UNIQUE,
  audience            text NOT NULL DEFAULT 'driver' CHECK (audience IN ('driver','rider')),
  status              text NOT NULL DEFAULT 'draft'  CHECK (status IN ('active','draft')),
  title               text NOT NULL,
  short_description   text NOT NULL,
  hero_highlight      text NOT NULL,
  reward              numeric NOT NULL DEFAULT 0,
  goal_rides          integer NOT NULL DEFAULT 0,
  window_days         integer NOT NULL DEFAULT 30,
  city                text NOT NULL DEFAULT 'Saskatoon',
  start_date          date,
  end_date            date,
  how_it_works        jsonb NOT NULL DEFAULT '[]'::jsonb,
  terms               jsonb NOT NULL DEFAULT '[]'::jsonb,
  sms_template        text NOT NULL DEFAULT
    'Hi {name}! Spinr is offering you a ${reward} bonus for completing {goal_rides} rides in {window_days} days in {city}. Use code {code} at {link} — expires in 24 hours.',
  reminder_sms_template text NOT NULL DEFAULT
    'Reminder from Spinr: your ${reward} bonus code {code} expires in 12 hours. Register here before it''s gone: {link}',
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);
-- idempotent column add for re-runs after initial migration
ALTER TABLE public.promotions
  ADD COLUMN IF NOT EXISTS reminder_sms_template text NOT NULL DEFAULT
    'Reminder from Spinr: your ${reward} bonus code {code} expires in 12 hours. Register here before it''s gone: {link}';
CREATE INDEX IF NOT EXISTS promotions_status_idx ON public.promotions (status);
CREATE INDEX IF NOT EXISTS promotions_audience_idx ON public.promotions (audience);

CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS promotions_set_updated_at ON public.promotions;
CREATE TRIGGER promotions_set_updated_at
  BEFORE UPDATE ON public.promotions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- -----------------------------------------------------
-- TABLE: promotion_coupons
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.promotion_coupons (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code               text NOT NULL UNIQUE,
  promotion_slug     text NOT NULL,
  recipient_name     text,
  recipient_phone    text,
  status             text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','used')),
  expires_at         timestamptz NOT NULL,
  used_at            timestamptz,
  used_by_email      text,
  used_by_signup_id  uuid,
  created_at         timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.promotion_coupons
  ADD COLUMN IF NOT EXISTS sms_status text NOT NULL DEFAULT 'not_sent'
    CHECK (sms_status IN ('not_sent','queued','sent','failed','skipped')),
  ADD COLUMN IF NOT EXISTS sms_error  text,
  ADD COLUMN IF NOT EXISTS sms_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS reminder_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS reminder_sms_status text NOT NULL DEFAULT 'not_sent'
    CHECK (reminder_sms_status IN ('not_sent','queued','sent','failed','skipped')),
  ADD COLUMN IF NOT EXISTS reminder_sms_error text;

CREATE INDEX IF NOT EXISTS promotion_coupons_status_idx ON public.promotion_coupons (status);
CREATE INDEX IF NOT EXISTS promotion_coupons_promo_idx  ON public.promotion_coupons (promotion_slug);
CREATE INDEX IF NOT EXISTS promotion_coupons_expires_idx ON public.promotion_coupons (expires_at);

-- -----------------------------------------------------
-- TABLE: promotion_signups
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.promotion_signups (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference       text NOT NULL UNIQUE,
  coupon_code     text,
  promotion_slug  text NOT NULL,
  audience        text NOT NULL,
  full_name       text NOT NULL,
  email           text NOT NULL,
  phone           text NOT NULL,
  driver_id       text NOT NULL,
  city            text NOT NULL,
  goal_rides      integer NOT NULL,
  window_days     integer NOT NULL,
  reward_amount   numeric NOT NULL,
  status          text NOT NULL DEFAULT 'accepted',
  accepted_at     timestamptz NOT NULL DEFAULT now(),
  expires_at      timestamptz NOT NULL
);
-- driver_id is no longer required
ALTER TABLE public.promotion_signups ALTER COLUMN driver_id DROP NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS promotion_signups_promo_email_uniq
  ON public.promotion_signups (promotion_slug, email);
CREATE INDEX IF NOT EXISTS promotion_signups_promo_idx
  ON public.promotion_signups (promotion_slug);

-- -----------------------------------------------------
-- ROW LEVEL SECURITY
-- -----------------------------------------------------
ALTER TABLE public.promotions        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotion_coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotion_signups ENABLE ROW LEVEL SECURITY;

-- promotions
DROP POLICY IF EXISTS "public_read_active_promotions" ON public.promotions;
CREATE POLICY "public_read_active_promotions"
  ON public.promotions FOR SELECT
  USING (status = 'active');
DROP POLICY IF EXISTS "admin_all_promotions" ON public.promotions;
CREATE POLICY "admin_all_promotions"
  ON public.promotions FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- coupons
DROP POLICY IF EXISTS "public_read_coupon_by_code" ON public.promotion_coupons;
CREATE POLICY "public_read_coupon_by_code"
  ON public.promotion_coupons FOR SELECT USING (true);
DROP POLICY IF EXISTS "public_burn_coupon" ON public.promotion_coupons;
CREATE POLICY "public_burn_coupon"
  ON public.promotion_coupons FOR UPDATE
  USING (status = 'pending' AND expires_at > now())
  WITH CHECK (status IN ('pending','used'));
DROP POLICY IF EXISTS "admin_all_coupons" ON public.promotion_coupons;
CREATE POLICY "admin_all_coupons"
  ON public.promotion_coupons FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- signups
DROP POLICY IF EXISTS "public_insert_signup" ON public.promotion_signups;
CREATE POLICY "public_insert_signup"
  ON public.promotion_signups FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "admin_read_signups" ON public.promotion_signups;
CREATE POLICY "admin_read_signups"
  ON public.promotion_signups FOR SELECT TO authenticated USING (true);

-- -----------------------------------------------------
-- SEED: driver-200-bonus (only if missing)
-- -----------------------------------------------------
INSERT INTO public.promotions
  (slug, audience, status, title, short_description, hero_highlight,
   reward, goal_rides, window_days, city, how_it_works, terms)
VALUES (
  'driver-200-bonus',
  'driver',
  'active',
  'Complete 15 Rides, Earn $200',
  'Finish 15 trips in 30 days and we will deposit a $200 bonus on top of your regular earnings.',
  '$200 Bonus',
  200, 15, 30, 'Saskatoon',
  '[
    "Register for the quest using the form below with the email you use for your driver account.",
    "Accept the quest — your progress starts the moment we confirm your registration.",
    "Complete 15 paid rides in Saskatoon within 30 days of acceptance.",
    "The $200 bonus lands in your next weekly payout after you hit 15 trips."
  ]'::jsonb,
  '[
    "Open to approved Spinr drivers in Saskatoon only.",
    "Cancelled, no-show, and driver-cancelled trips do not count toward the 15 rides.",
    "Each driver can register for this quest once.",
    "Bonus is paid as a separate line item on your weekly payout.",
    "Spinr reserves the right to disqualify accounts found gaming the system (self-rides, fake trips, fraud)."
  ]'::jsonb
)
ON CONFLICT (slug) DO NOTHING;
