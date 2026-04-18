-- =====================================================
-- SPINR PROMOTIONS — add SMS delivery tracking columns
-- =====================================================
-- Adds per-coupon delivery status so admins can see which
-- SMS went out, which failed, and which haven't been sent.
-- Safe to run multiple times.
-- =====================================================

ALTER TABLE public.promotion_coupons
  ADD COLUMN IF NOT EXISTS sms_status text NOT NULL DEFAULT 'not_sent'
    CHECK (sms_status IN ('not_sent','queued','sent','failed','skipped')),
  ADD COLUMN IF NOT EXISTS sms_error  text,
  ADD COLUMN IF NOT EXISTS sms_sent_at timestamptz;
