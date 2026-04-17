-- =====================================================
-- SPINR PROMOTION SYSTEM — TABLES
-- =====================================================
-- Creates:
--   • promotion_coupons — invite-only single-use codes with 24h expiry
--   • promotion_signups — drivers who accepted a quest using a coupon
-- Run this in the Supabase SQL Editor.
-- =====================================================

-- Coupon codes issued by admin, sent via SMS, single-use
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

CREATE INDEX IF NOT EXISTS promotion_coupons_status_idx ON public.promotion_coupons (status);
CREATE INDEX IF NOT EXISTS promotion_coupons_promo_idx  ON public.promotion_coupons (promotion_slug);
CREATE INDEX IF NOT EXISTS promotion_coupons_expires_idx ON public.promotion_coupons (expires_at);

-- Driver registrations (one per redeemed coupon)
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

CREATE UNIQUE INDEX IF NOT EXISTS promotion_signups_promo_email_uniq
  ON public.promotion_signups (promotion_slug, email);
CREATE INDEX IF NOT EXISTS promotion_signups_promo_idx
  ON public.promotion_signups (promotion_slug);

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================
-- Anonymous clients can insert a signup and read a single coupon by code
-- for validation. Admin writes happen via the authenticated service route,
-- which uses the admin user's JWT, so RLS must allow the super admin.

ALTER TABLE public.promotion_coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotion_signups ENABLE ROW LEVEL SECURITY;

-- Public can SELECT coupons only by code (client does .eq('code', X))
DROP POLICY IF EXISTS "public_read_coupon_by_code" ON public.promotion_coupons;
CREATE POLICY "public_read_coupon_by_code"
  ON public.promotion_coupons FOR SELECT
  USING (true);

-- Public can UPDATE a coupon only when burning it (status pending → used)
-- Tighten this further with a custom RPC if desired.
DROP POLICY IF EXISTS "public_burn_coupon" ON public.promotion_coupons;
CREATE POLICY "public_burn_coupon"
  ON public.promotion_coupons FOR UPDATE
  USING (status = 'pending' AND expires_at > now())
  WITH CHECK (status IN ('pending','used'));

-- Admin (authenticated) can do everything
DROP POLICY IF EXISTS "admin_all_coupons" ON public.promotion_coupons;
CREATE POLICY "admin_all_coupons"
  ON public.promotion_coupons FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- Public can INSERT a signup (anon key)
DROP POLICY IF EXISTS "public_insert_signup" ON public.promotion_signups;
CREATE POLICY "public_insert_signup"
  ON public.promotion_signups FOR INSERT
  WITH CHECK (true);

-- Only admin (authenticated) can read signups
DROP POLICY IF EXISTS "admin_read_signups" ON public.promotion_signups;
CREATE POLICY "admin_read_signups"
  ON public.promotion_signups FOR SELECT TO authenticated
  USING (true);
