-- Add missing columns for custom code injection
ALTER TABLE public.seo_pages 
ADD COLUMN IF NOT EXISTS custom_head text,
ADD COLUMN IF NOT EXISTS custom_body_start text,
ADD COLUMN IF NOT EXISTS custom_body_end text;

-- Update RLS policies to ensure these new columns are accessible (the existing * policy should cover it, but just to be sure)
-- (No change needed if "using (true)" is used for select)
