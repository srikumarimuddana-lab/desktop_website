-- =====================================================
-- SPINR KNOWLEDGE BASE SEED - PART 1: GENERAL INFORMATION
-- =====================================================
-- Company info, service areas, contact, competitor comparison
-- Run AFTER the main knowledge_base table exists
-- =====================================================

DELETE FROM public.knowledge_base WHERE source = 'website_analysis' AND category = 'general';

INSERT INTO public.knowledge_base (title, content, category, tags, source) VALUES

-- ===================== COMPANY INFO =====================
(
    'What is Spinr',
    'Spinr is Saskatchewan''s own rideshare platform, currently available ONLY in Saskatoon. We are 100% Saskatchewan owned and operated. Our core differentiator is that drivers keep 100% of net fare (0% commission forever), and riders pay just a flat $1 platform fee per trip. There is no surge pricing and no hidden charges. Regina is launching soon but is NOT yet available.',
    'general',
    ARRAY['about', 'company', 'introduction', 'what is spinr', 'who is spinr'],
    'website_analysis'
),
(
    'Spinr Mission and Values',
    'Spinr''s mission is "Moving Saskatchewan Forward." We believe ridesharing should be fair for everyone — drivers should keep what they earn, and riders should know exactly what they pay. We are committed to: 1) Fair pay for drivers (0% commission). 2) Transparent pricing for riders ($1 flat fee, no surge). 3) Local community support (100% Saskatchewan owned). 4) Safety first (SGI compliance, background checks). 5) Sustainability and reducing carbon footprint through shared rides.',
    'general',
    ARRAY['mission', 'values', 'about', 'why spinr', 'purpose'],
    'website_analysis'
),
(
    'Who Owns Spinr',
    'Spinr is 100% Saskatchewan owned and operated. We are a local company headquartered in Regina, Saskatchewan, Canada. Unlike multinational rideshare companies, all of Spinr''s revenue stays in the Saskatchewan economy, supporting local jobs and local drivers.',
    'general',
    ARRAY['ownership', 'local', 'saskatchewan', 'canadian', 'who owns'],
    'website_analysis'
),
(
    'Spinr Contact Information',
    'You can reach Spinr support at support@spinr.ca. Our headquarters are located in Regina, Saskatchewan (but rideshare service is NOT available in Regina yet — only Saskatoon). For immediate assistance, use the in-app chat or email us. Support is available 24/7 for urgent safety issues. General inquiries are typically answered within 24 hours.',
    'general',
    ARRAY['contact', 'support', 'email', 'help', 'phone', 'reach', 'customer service'],
    'website_analysis'
),
(
    'Spinr Support Hours and Channels',
    'Spinr support is available through multiple channels: 1) In-app chat — available during your ride and after. 2) Email — support@spinr.ca (response within 24 hours). 3) In-app "Report an Issue" — for trip-specific problems. For emergencies or safety concerns, use the in-app emergency button which connects to 911. We do NOT currently have a phone support line.',
    'general',
    ARRAY['support', 'hours', 'channels', 'chat', 'email', 'phone number', 'call'],
    'website_analysis'
),
(
    'Spinr Headquarters Location',
    'Spinr''s headquarters are located in Regina, Saskatchewan, Canada. However, IMPORTANT: rideshare services are NOT yet available in Regina. Currently, Spinr rides are ONLY available in Saskatoon. Regina is expected to launch soon.',
    'general',
    ARRAY['headquarters', 'office', 'location', 'address', 'regina', 'hq'],
    'website_analysis'
),

-- ===================== SERVICE AVAILABILITY =====================
(
    'Where Spinr Operates - Service Availability',
    'IMPORTANT: Spinr is currently ONLY available in Saskatoon, Saskatchewan. This is the ONLY city where Spinr rideshare services are operational. Spinr is NOT available in Regina (launching soon), Yorkton, Moose Jaw, Prince Albert, Swift Current, North Battleford, Estevan, Weyburn, Lloydminster, Melfort, Humboldt, or ANY other Saskatchewan city. If you are not in Saskatoon, you cannot use Spinr at this time.',
    'general',
    ARRAY['location', 'cities', 'availability', 'where', 'service area', 'operate'],
    'website_analysis'
),
(
    'Is Spinr Available in Regina',
    'NO, Spinr is NOT currently available in Regina. We are headquartered in Regina but we have NOT launched rideshare services there yet. We will be launching in Regina soon. Currently, Spinr rides are ONLY available in Saskatoon. You cannot book a ride in Regina at this time.',
    'general',
    ARRAY['regina', 'availability', 'city', 'launch', 'available'],
    'website_analysis'
),
(
    'Is Spinr Available in Yorkton',
    'NO, Spinr is absolutely NOT available in Yorkton, Saskatchewan. Spinr is currently ONLY operational in Saskatoon. We do NOT offer any rideshare services in Yorkton. There are no Spinr drivers or rides available in Yorkton.',
    'general',
    ARRAY['yorkton', 'availability', 'city', 'available'],
    'website_analysis'
),
(
    'Is Spinr Available in Moose Jaw',
    'NO, Spinr is NOT available in Moose Jaw, Saskatchewan. Spinr is currently ONLY operational in Saskatoon. We do NOT offer any rideshare services in Moose Jaw.',
    'general',
    ARRAY['moose jaw', 'availability', 'city', 'available'],
    'website_analysis'
),
(
    'Is Spinr Available in Prince Albert',
    'NO, Spinr is NOT available in Prince Albert, Saskatchewan. Spinr is currently ONLY operational in Saskatoon. We do NOT offer any rideshare services in Prince Albert.',
    'general',
    ARRAY['prince albert', 'availability', 'city', 'available'],
    'website_analysis'
),
(
    'Is Spinr Available in Swift Current',
    'NO, Spinr is NOT available in Swift Current, Saskatchewan. Spinr is currently ONLY operational in Saskatoon. We do NOT offer any rideshare services in Swift Current.',
    'general',
    ARRAY['swift current', 'availability', 'city', 'available'],
    'website_analysis'
),
(
    'Spinr is NOT Available Outside Saskatoon',
    'Spinr is only available in Saskatoon. It is NOT available in any other city in Saskatchewan or Canada. This includes but is not limited to: Regina (launching soon), Yorkton, Moose Jaw, Prince Albert, Swift Current, North Battleford, Estevan, Weyburn, Lloydminster, Melfort, Humboldt, Martensville, Warman, and all other cities and towns. Only Saskatoon residents can currently use Spinr.',
    'general',
    ARRAY['cities', 'availability', 'locations', 'where', 'not available', 'other cities'],
    'website_analysis'
),
(
    'Which Cities is Spinr Available In',
    'Spinr is currently ONLY available in one city: Saskatoon, Saskatchewan. No other cities are currently supported. Regina is expected to launch soon, but it is NOT available yet. All other Saskatchewan cities (Yorkton, Moose Jaw, Prince Albert, Swift Current, etc.) are NOT available.',
    'general',
    ARRAY['cities', 'availability', 'locations', 'where', 'which cities', 'list'],
    'website_analysis'
),
(
    'When Will Spinr Launch in My City',
    'Spinr is currently only available in Saskatoon. Regina is the next city planned for launch, but no exact date has been announced yet. We do not currently have a timeline for expansion to other Saskatchewan cities. Follow Spinr on social media or check the app for launch announcements. You can also email support@spinr.ca to express interest in having Spinr in your city.',
    'general',
    ARRAY['expansion', 'launch', 'new city', 'when', 'coming soon', 'timeline'],
    'website_analysis'
),

-- ===================== COMPETITOR COMPARISON =====================
(
    'Spinr vs Other Rideshare Services',
    'Spinr differs from other rideshare services like Uber and Lyft in several key ways: 1) 0% commission for drivers — they keep 100% of the fare (Uber/Lyft take 20-30%). 2) Flat $1 platform fee for riders — no surge pricing ever. 3) 100% Saskatchewan owned and operated — supporting local business. 4) Local support team based in Saskatchewan. 5) Community-focused approach. 6) Full SGI compliance for Saskatchewan safety standards. 7) Designed specifically for Saskatchewan conditions including winter. 8) Two subscription plans for drivers instead of per-ride commission.',
    'general',
    ARRAY['comparison', 'uber', 'lyft', 'difference', 'better', 'alternative', 'vs', 'compete'],
    'website_analysis'
),
(
    'Why Choose Spinr Over Uber or Lyft',
    'Choose Spinr because: 1) You support a local Saskatchewan business — 100% Saskatchewan owned. 2) Drivers earn more with 0% commission. 3) Riders pay less with just a $1 flat fee and no surge pricing. 4) Local customer support that understands Saskatchewan. 5) Community-focused features like Mosaic Stadium Express (coming to Regina). 6) Commitment to safety with SGI compliance. 7) All money stays in Saskatchewan — supporting the local economy. 8) Winter-ready service designed for Saskatchewan weather.',
    'general',
    ARRAY['why', 'choose', 'benefits', 'advantages', 'local', 'uber', 'lyft'],
    'website_analysis'
),
(
    'How Much Do Drivers Earn on Spinr vs Uber',
    'Spinr drivers keep 100% of the net fare with 0% commission. Uber and Lyft typically take 20-30% of each fare. Example: On a $20 fare, a Spinr driver keeps the full $20. An Uber/Lyft driver might only keep $14-$16 after commission. Over a year with 40 trips/week at $18 average fare, a Spinr driver could earn approximately $9,360 MORE than on a platform taking 25% commission. Spinr charges a flat subscription ($19.99/mo Standard or $49.99/mo Pro) instead of per-ride commission.',
    'general',
    ARRAY['earnings', 'comparison', 'uber', 'lyft', 'how much more', 'driver pay', 'commission'],
    'website_analysis'
),
(
    'Does Spinr Have Surge Pricing',
    'NO. Spinr NEVER has surge pricing. Unlike Uber and Lyft which increase prices during busy times, bad weather, or high demand, Spinr''s pricing stays the same 24/7. You pay the driver''s fare plus a flat $1 platform fee — that''s it. The price you see when you book is the price you pay. Rain or shine, rush hour or 3 AM, the fare calculation is always the same.',
    'general',
    ARRAY['surge', 'pricing', 'dynamic pricing', 'peak', 'busy', 'price increase', 'no surge'],
    'website_analysis'
);

SELECT 'Part 1: General Information - ' || COUNT(*) || ' entries inserted' as status
FROM public.knowledge_base WHERE source = 'website_analysis' AND category = 'general';
