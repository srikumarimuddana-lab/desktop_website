-- =====================================================
-- SPINR PROMOTIONS CMS — TABLE
-- =====================================================
-- Creates the `promotions` table so admins can CRUD promotions
-- from the dashboard without editing code. The API layer falls
-- back to the static constants/promotions.js if Supabase has no
-- active row, so running this migration is safe even before seed.
-- =====================================================

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
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS promotions_status_idx ON public.promotions (status);
CREATE INDEX IF NOT EXISTS promotions_audience_idx ON public.promotions (audience);

-- keep updated_at fresh
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

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;

-- Public can read only 'active' promotions (used by /promotions/:slug)
DROP POLICY IF EXISTS "public_read_active_promotions" ON public.promotions;
CREATE POLICY "public_read_active_promotions"
  ON public.promotions FOR SELECT
  USING (status = 'active');

-- Authenticated users can do everything (admin enforced at API layer)
DROP POLICY IF EXISTS "admin_all_promotions" ON public.promotions;
CREATE POLICY "admin_all_promotions"
  ON public.promotions FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- SEED: carry over the existing driver-200-bonus promo
-- =====================================================
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
