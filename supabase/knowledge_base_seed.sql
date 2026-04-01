-- =====================================================
-- SPINR KNOWLEDGE BASE - COMPREHENSIVE SEED DATA
-- =====================================================
-- 169 entries covering ALL rider, driver, safety, policy topics
-- Run this in Supabase SQL Editor to populate the knowledge base
-- AFTER running this, run: node scripts/generate-embeddings.js
-- =====================================================
-- This is a combined file. Individual category files are in supabase/seeds/
-- =====================================================

-- Clear existing entries to avoid duplicates
DELETE FROM public.knowledge_base WHERE source = 'website_analysis';

INSERT INTO public.knowledge_base (title, content, category, tags, source) VALUES
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
FROM public.knowledge_base WHERE source = 'website_analysis' AND category = 'general';

INSERT INTO public.knowledge_base (title, content, category, tags, source) VALUES
(
    'How to Get Started as a Spinr Rider',
    'To get started as a Spinr rider: 1) Download the Spinr app from the Apple App Store or Google Play Store. 2) Create your account using your phone number or email. 3) Verify your identity with a valid phone number via SMS code. 4) Add a payment method (credit or debit card). 5) Set your pickup location and destination. 6) Confirm your ride and enjoy! You must be in Saskatoon to request a ride, as Spinr is currently only available in Saskatoon.',
    'rider',
    ARRAY['getting started', 'new rider', 'sign up', 'download', 'app', 'register', 'how to'],
    'website_analysis'
),
(
    'Spinr Rider App Download',
    'The Spinr rider app is available for free download on both the Apple App Store (iOS) and Google Play Store (Android). Search for "Spinr" to find and install the app. You need a smartphone with iOS 14+ or Android 8+ to use the app. The app is free to download — you only pay when you take a ride.',
    'rider',
    ARRAY['app', 'download', 'ios', 'android', 'install', 'phone', 'getting started'],
    'website_analysis'
),
(
    'Minimum Age to Ride with Spinr',
    'You must be at least 18 years old to create a Spinr account and ride independently. Riders under 18 are not permitted to ride alone. Minors can ride when accompanied by a parent or legal guardian who has a Spinr account. Unaccompanied minors will not be transported, and drivers have the right to cancel such rides.',
    'rider',
    ARRAY['age', 'minimum age', 'how old', 'minor', 'child', 'teenager', 'getting started'],
    'website_analysis'
),
(
    'How to Book a Spinr Ride',
    'To book a ride with Spinr: 1) Open the Spinr app. 2) Enter your pickup location (or use GPS to auto-detect). 3) Enter your destination. 4) Review the upfront pricing and estimated arrival time. 5) Choose your ride type if multiple options are available. 6) Confirm your ride. 7) Wait for a driver to accept — you''ll see their name, photo, vehicle details, and real-time location. You must be in Saskatoon to book a ride.',
    'rider',
    ARRAY['booking', 'ride', 'how to', 'book', 'request', 'order'],
    'website_analysis'
),
(
    'Spinr Pre-Booking and Scheduled Rides',
    'Spinr allows you to pre-book rides up to 7 days in advance. This is perfect for airport trips, appointments, early morning flights, or any planned travel. To schedule a ride: 1) Open the app and enter your destination as normal. 2) Tap "Schedule" instead of "Ride Now". 3) Select your preferred pickup date and time. 4) Confirm your booking. Your driver will be assigned and will arrive at the scheduled time.',
    'rider',
    ARRAY['pre-book', 'schedule', 'advance', 'booking', 'appointment', 'scheduled ride', 'future ride'],
    'website_analysis'
),
(
    'How Driver Matching Works',
    'When you request a ride, Spinr''s smart algorithm finds the closest available driver for the fastest pickup. The system considers: 1) Driver proximity to your pickup location. 2) Driver availability and current status. 3) Estimated time of arrival. Once matched, you''ll see your driver''s name, photo, vehicle make/model/color, and license plate number. You can track their approach in real-time on the map.',
    'rider',
    ARRAY['matching', 'algorithm', 'how it works', 'driver assignment', 'booking'],
    'website_analysis'
),
(
    'Estimated Time of Arrival (ETA)',
    'When you request a ride, the app shows the estimated time for your driver to reach your pickup location. This ETA is based on the driver''s current location and traffic conditions. Once your driver is matched, you can track their real-time location on the map. You''ll receive a notification when your driver is approaching and when they arrive at your pickup point.',
    'rider',
    ARRAY['eta', 'arrival time', 'how long', 'wait time', 'when will driver arrive', 'booking'],
    'website_analysis'
),
(
    'Can I Add Multiple Stops to My Ride',
    'Spinr supports adding multiple stops to your ride. When booking, you can add intermediate stops between your pickup and final destination. This is useful for picking up friends, making a quick stop, or running errands along the way. Additional stops may affect the total fare since the route distance and time will increase. Each stop has a brief wait time included.',
    'rider',
    ARRAY['multiple stops', 'stops', 'add stop', 'intermediate', 'extra stop', 'booking'],
    'website_analysis'
),
(
    'Can I Order a Ride for Someone Else',
    'Yes, you can order a Spinr ride for someone else. When booking a ride, you can change the pickup location to where the other person is located. Make sure to: 1) Let the other person know a ride is coming and share the driver details. 2) Provide accurate pickup instructions. 3) Note that the fare will be charged to your payment method. This is useful for ordering rides for family members, friends, or colleagues.',
    'rider',
    ARRAY['someone else', 'other person', 'order for', 'third party', 'family', 'friend', 'booking'],
    'website_analysis'
),
(
    'What If My Driver Is Late or Does Not Arrive',
    'If your driver is taking longer than expected: 1) Check the app for real-time driver location and updated ETA. 2) Contact your driver via the in-app messaging or call feature. 3) If the driver is significantly delayed, you can cancel the ride for free (no fee applies if the driver hasn''t arrived within the estimated time). 4) Request a new ride. If you experience persistent issues, contact support@spinr.ca for assistance.',
    'rider',
    ARRAY['late', 'driver late', 'not arriving', 'delayed', 'waiting', 'no show driver', 'booking'],
    'website_analysis'
),
(
    'Ride Tracking and Sharing',
    'Spinr allows you to track your ride in real-time. You can see your driver''s location as they approach, track your route during the trip, and share your ride status with friends and family for added safety. To share: tap the "Share Ride" button during your trip to send a live tracking link via text message or other apps. Your contacts can follow your ride on a map without needing the Spinr app.',
    'rider',
    ARRAY['tracking', 'real-time', 'location', 'share', 'map', 'share ride', 'live', 'booking'],
    'website_analysis'
),
(
    'How to Contact Your Driver',
    'Once matched with a driver, you can contact them through the Spinr app. Options include: 1) In-app messaging — send text messages to your driver. 2) In-app call — call your driver through the app (your phone number stays private). Communication is anonymous — neither you nor the driver see each other''s personal phone numbers. This protects your privacy while allowing easy communication about pickup details.',
    'rider',
    ARRAY['contact driver', 'call', 'message', 'communicate', 'anonymous', 'phone', 'booking'],
    'website_analysis'
),
(
    'Can I Change My Destination During a Ride',
    'Yes, you can change your destination during an active ride. Simply tap on the destination in the app and enter a new address. The fare will be recalculated based on the new route. Your driver will be notified of the route change. Note that changing the destination may increase or decrease the fare depending on the new distance and estimated time.',
    'rider',
    ARRAY['change destination', 'route change', 'mid-trip', 'update destination', 'booking'],
    'website_analysis'
),
(
    'Late Night and Early Morning Rides',
    'Spinr operates 24/7 in Saskatoon. You can request rides at any time of day or night. Late night rides have the same pricing as daytime rides — there is NO surge pricing regardless of the hour. Driver availability may vary during very late or very early hours, so pre-booking is recommended for guaranteed pickup during off-peak times like 2-5 AM.',
    'rider',
    ARRAY['late night', 'early morning', 'overnight', '24/7', 'hours', 'availability', 'booking'],
    'website_analysis'
),
(
    'How Much Does a Spinr Ride Cost',
    'With Spinr, you pay the driver''s rate plus a flat $1 platform fee. There is NO surge pricing — the price you see is the price you pay. You get upfront pricing before confirming your ride, so there are no surprises. The fare is calculated based on: 1) Base fare (starting rate). 2) Per-kilometer rate for distance. 3) Per-minute rate for time. Plus a flat $1 Spinr platform fee. That''s it — no hidden fees.',
    'rider',
    ARRAY['pricing', 'cost', 'fare', 'fee', 'how much', 'price', 'rate'],
    'website_analysis'
),
(
    'Spinr Upfront Pricing - No Surge',
    'Spinr shows you the exact fare before you confirm your ride. There are no hidden charges or surprise fees. The price includes the driver''s rate plus a flat $1 platform fee. What you see is what you pay. Unlike Uber and Lyft, Spinr NEVER has surge pricing — the fare stays the same regardless of time, demand, or weather. Rain, snow, rush hour, game day — the price never goes up.',
    'rider',
    ARRAY['pricing', 'upfront', 'transparent', 'fare', 'cost', 'no surge', 'surge'],
    'website_analysis'
),
(
    'What is the $1 Platform Fee',
    'The $1 platform fee is a flat charge added to every Spinr ride. This fee goes to Spinr to cover platform operations, technology, customer support, and insurance. It is NOT a tip and does NOT go to the driver. The fee is always exactly $1 — it does not change based on distance, time, or demand. This is how Spinr funds its operations while allowing drivers to keep 100% of the fare.',
    'rider',
    ARRAY['platform fee', '$1', 'fee', 'charge', 'what is', 'pricing'],
    'website_analysis'
),
(
    'How Spinr Fare is Calculated',
    'Your Spinr fare is calculated using: 1) Base fare — a fixed starting amount. 2) Distance rate — charged per kilometer driven. 3) Time rate — charged per minute of trip duration. 4) Plus the flat $1 platform fee. The total is shown to you upfront BEFORE you confirm the ride. There is no surge pricing, no peak pricing, no dynamic pricing. The fare formula is the same 24 hours a day, 7 days a week.',
    'rider',
    ARRAY['fare calculation', 'how calculated', 'base fare', 'per km', 'per minute', 'formula', 'pricing'],
    'website_analysis'
),
(
    'Are There Any Hidden Fees',
    'No. Spinr has completely transparent pricing. You pay: 1) The driver''s fare (based on distance + time). 2) A flat $1 platform fee. That''s it. There are NO: surge fees, booking fees, service fees, safety fees, busy-area fees, or any other hidden charges. The only additional charges that could apply are: cancellation fees (if you cancel late), no-show fees, or cleaning fees (in case of vehicle damage/mess).',
    'rider',
    ARRAY['hidden fees', 'extra charges', 'additional fees', 'transparent', 'pricing'],
    'website_analysis'
),
(
    'Fare Estimate Before Booking',
    'You can see the estimated fare before confirming your ride. In the Spinr app, enter your pickup and destination — the app will show you the estimated fare including the $1 platform fee. This estimate is locked in when you confirm, so you won''t pay more than what was quoted (unless you change the destination or add stops during the ride).',
    'rider',
    ARRAY['estimate', 'fare estimate', 'price estimate', 'how much will it cost', 'pricing'],
    'website_analysis'
);
FROM public.knowledge_base WHERE source = 'website_analysis' AND category = 'rider';

INSERT INTO public.knowledge_base (title, content, category, tags, source) VALUES
(
    'Payment Methods Accepted by Spinr',
    'Spinr accepts the following payment methods: 1) Visa (credit and debit). 2) Mastercard (credit and debit). 3) American Express. 4) Prepaid cards. 5) Apple Pay (where available). 6) Google Pay (where available). Cash payments are NOT currently accepted. You can add multiple payment methods to your account and set a default card. Payment is processed automatically at the end of each trip.',
    'rider',
    ARRAY['payment', 'methods', 'credit card', 'debit card', 'visa', 'mastercard', 'cash', 'wallet', 'apple pay', 'google pay'],
    'website_analysis'
),
(
    'Does Spinr Accept Cash',
    'No, Spinr does NOT accept cash payments. All rides must be paid electronically through the app using a credit card, debit card, or mobile payment (Apple Pay/Google Pay). This ensures: 1) Safer rides with no cash handling. 2) Automatic payment processing. 3) Digital receipts for every trip. 4) Easy refund processing if needed.',
    'rider',
    ARRAY['cash', 'payment', 'cash payment', 'pay cash', 'no cash'],
    'website_analysis'
),
(
    'How Payment Works on Spinr',
    'When you complete a ride, payment is automatically charged to your default payment method. You receive a receipt via email and in-app showing the fare breakdown: driver''s rate + $1 platform fee. There are no surge charges, tips are optional, and there are no hidden fees. You can view all your trip receipts in the app under Trip History.',
    'rider',
    ARRAY['payment', 'how it works', 'receipt', 'automatic', 'charge', 'billing'],
    'website_analysis'
),
(
    'How to Add or Update Payment Method',
    'To manage payment methods in the Spinr app: 1) Open the app. 2) Go to Settings > Wallet/Payment Methods. 3) Tap "Add Payment Method" to add a new card. 4) Enter your card details and save. To set a default: tap on any saved card and select "Set as Default". To remove: swipe left on a card or tap to edit and select remove. Your default card will be charged automatically for each ride.',
    'rider',
    ARRAY['payment', 'wallet', 'card', 'update', 'credit card', 'debit card', 'change card', 'add card', 'remove card'],
    'website_analysis'
),
(
    'Payment Failed or Declined',
    'If your payment fails: 1) Check that your card details are correct in Settings > Wallet. 2) Make sure your card has sufficient funds. 3) Try a different payment method. 4) Check if your bank is blocking the transaction — some banks flag rideshare charges as unusual activity. 5) Contact your bank to authorize the transaction. 6) Make sure your card is not expired. If issues persist, email support@spinr.ca for help.',
    'rider',
    ARRAY['payment', 'failed', 'declined', 'error', 'card', 'transaction', 'not working', 'rejected'],
    'website_analysis'
),
(
    'Trip Receipts and History',
    'You can view all your past rides in the Trip History section of the app. Each trip shows: date, time, pickup/dropoff locations, route taken, fare breakdown (driver rate + platform fee), driver name, vehicle info, and payment method used. You can download or email receipts for any past trip. This is useful for expense reporting, record-keeping, or disputing charges.',
    'rider',
    ARRAY['history', 'trips', 'past rides', 'receipts', 'invoice', 'record', 'receipt'],
    'website_analysis'
),
(
    'How to Tip Your Driver',
    'Tipping is optional but appreciated. After your ride ends, the app will prompt you to rate your driver and offer the option to add a tip. You can tip: 1) Immediately after the ride via the in-app prompt. 2) Later from your Trip History by selecting the trip and tapping "Add Tip". 100% of the tip goes directly to your driver — Spinr does not take any cut of tips. Suggested tip amounts are shown, or you can enter a custom amount.',
    'rider',
    ARRAY['tip', 'tipping', 'gratuity', 'tip driver', 'how to tip'],
    'website_analysis'
),
(
    'Does the Driver Get 100% of the Tip',
    'Yes, 100% of your tip goes directly to the driver. Spinr does NOT take any percentage or cut from tips. Tips are in addition to the fare and are processed through the app to the driver''s account.',
    'rider',
    ARRAY['tip', 'driver tip', 'tip percentage', 'keep tip'],
    'website_analysis'
),
(
    'How to Use Promo Codes',
    'To apply a promo code in Spinr: 1) Open the app and go to Settings > Wallet or Promotions. 2) Tap "Add Promo Code" or "Enter Code". 3) Type or paste your promo code. 4) Tap Apply. If the code is valid, the discount will be automatically applied to your next eligible ride(s). Promo codes may have expiration dates, minimum fare requirements, or be limited to specific ride types. Check the terms of each promotion.',
    'rider',
    ARRAY['promo', 'promo code', 'discount', 'coupon', 'promotion', 'code'],
    'website_analysis'
),
(
    'Where to Find Spinr Promo Codes',
    'You can find Spinr promo codes through: 1) New user welcome promotions (check your email after signing up). 2) Spinr social media accounts. 3) Local Saskatchewan events and partnerships. 4) Referral program — share your referral code with friends. 5) Seasonal promotions. Follow Spinr on social media and check your email for the latest offers.',
    'rider',
    ARRAY['promo', 'find promo', 'discount', 'offers', 'deals', 'free ride'],
    'website_analysis'
),
(
    'Wrong Charge or Fare Dispute',
    'If you believe you were overcharged or the fare is incorrect: 1) Go to Trip History in the app. 2) Select the trip in question. 3) Tap "Report an Issue" or "Dispute Fare". 4) Describe the problem (e.g., wrong route, incorrect fare, double charge). 5) Submit your dispute. Our team will review and respond within 48 hours. Common reasons for fare adjustments include: route detours, GPS errors, or trip not ending properly. You can also email support@spinr.ca with your trip details.',
    'rider',
    ARRAY['wrong charge', 'overcharged', 'dispute', 'fare dispute', 'incorrect fare', 'billing error'],
    'website_analysis'
),
(
    'Ride Cancellation Policy',
    'You can cancel a ride for free within the first 2 minutes after a driver accepts your request. After the free cancellation window, a cancellation fee may apply to compensate the driver for their time and fuel. You can also cancel for free if your driver hasn''t arrived within the estimated arrival time. The cancellation fee amount will be shown before you confirm the cancellation. To cancel: tap "Cancel Ride" in the app before your driver arrives.',
    'rider',
    ARRAY['cancel', 'cancellation', 'fee', 'policy', 'cancel ride', 'free cancellation'],
    'website_analysis'
),
(
    'How to Cancel a Ride',
    'To cancel a ride: 1) Open the Spinr app while the ride is pending/driver is en route. 2) Tap on the active ride card. 3) Tap "Cancel Ride". 4) Select a reason for cancellation (optional). 5) Confirm cancellation. If you cancel within 2 minutes of booking, there is no fee. After 2 minutes, the app will show if a cancellation fee applies before you confirm.',
    'rider',
    ARRAY['cancel', 'how to cancel', 'cancel ride', 'stop ride'],
    'website_analysis'
),
(
    'No-Show Policy for Riders',
    'If your driver arrives at the pickup location and you do not show up within 5 minutes, the ride may be cancelled and a no-show fee may be charged to your payment method. To avoid no-show fees: 1) Be ready at your pickup location. 2) Watch for your driver in the app. 3) Communicate with your driver if you need extra time. 4) Make sure your pickup pin is accurate.',
    'rider',
    ARRAY['no-show', 'no show', 'missed ride', 'penalty', 'fee', 'wait time', 'not there'],
    'website_analysis'
),
(
    'Waiting Time Charges',
    'Your driver will wait at the pickup location for up to 5 minutes. If you are not ready and keep the driver waiting beyond this period, a per-minute waiting time charge may be applied to your fare. The waiting time rate is minimal but compensates drivers for their time. To avoid waiting charges, be at your pickup location when your driver arrives.',
    'rider',
    ARRAY['waiting', 'wait time', 'waiting charge', 'wait fee', 'late pickup'],
    'website_analysis'
),
(
    'How to Request a Refund',
    'To request a refund for a trip: 1) Go to your Trip History in the app. 2) Select the specific trip. 3) Tap "Report an Issue". 4) Choose the appropriate issue category (e.g., "Charged incorrectly", "Driver took wrong route", "Trip not completed"). 5) Submit your refund request with details. Refunds are typically processed within 5-7 business days back to your original payment method. You can also contact support@spinr.ca for assistance.',
    'rider',
    ARRAY['refund', 'money back', 'dispute', 'overcharged', 'get refund'],
    'website_analysis'
),
(
    'How Long Does a Refund Take',
    'Refunds are typically processed within 5-7 business days after approval. The refund goes back to the original payment method used for the ride. Processing times may vary depending on your bank or card provider. If you haven''t received your refund after 10 business days, please contact your bank first, then email support@spinr.ca with your trip details and refund reference.',
    'rider',
    ARRAY['refund', 'how long', 'refund time', 'waiting for refund', 'refund status'],
    'website_analysis'
),
(
    'Cleaning Fee Policy',
    'A cleaning fee may be charged if a rider causes a mess in the vehicle during a ride. This includes spills, vomit, food/drink messes, or other significant messes that require the driver to clean the vehicle before accepting the next ride. The fee amount depends on the severity of the mess and may range from $20 to $150. Drivers must submit photo evidence to Spinr for a cleaning fee to be applied.',
    'rider',
    ARRAY['cleaning fee', 'mess', 'vomit', 'spill', 'damage', 'dirty'],
    'website_analysis'
),
(
    'Damage to Vehicle Policy',
    'Riders are responsible for any damage caused to the driver''s vehicle during a ride. This includes damage to seats, doors, windows, or any other part of the vehicle. Damage fees will be assessed based on repair costs and photo evidence submitted by the driver. For significant damage, Spinr may pursue additional compensation. Please treat your driver''s vehicle with respect.',
    'rider',
    ARRAY['damage', 'vehicle damage', 'broken', 'repair', 'liability'],
    'website_analysis'
),
(
    'Lost Items During a Ride',
    'If you left an item in your Spinr ride: 1) Go to Trip History in the app. 2) Select the relevant trip. 3) Tap "Lost Item" to contact your driver directly. 4) Arrange a pickup if the driver has your item. A small return fee may apply to compensate the driver for their time. If you cannot reach the driver, email support@spinr.ca with your trip details and a description of the lost item. Act quickly — the sooner you report it, the better the chance of recovery.',
    'rider',
    ARRAY['lost', 'item', 'forgot', 'left behind', 'found', 'belongings', 'lost and found'],
    'website_analysis'
);

INSERT INTO public.knowledge_base (title, content, category, tags, source) VALUES
(
    'Rider Safety Features',
    'Spinr prioritizes rider safety with multiple features: 1) Driver identity verification — see driver name, photo, and vehicle details before pickup. 2) Real-time ride tracking — share your trip with friends/family. 3) In-app emergency button — quickly contact 911 with auto-shared location. 4) Trip recording capability. 5) Two-way rating system. 6) All drivers pass RCMP background checks and vehicle inspections. 7) Anonymous communication — your phone number is never shared with the driver. 8) $2M commercial liability insurance on every active ride.',
    'safety',
    ARRAY['safety', 'features', 'security', 'protection', 'rider safety', 'emergency'],
    'website_analysis'
),
(
    'Safety Tips for Riders',
    'For your safety when riding with Spinr: 1) Always verify your driver''s name, photo, and license plate before getting in. 2) Use the "Share ride status" feature to let friends/family track your trip. 3) Sit in the back seat for added safety. 4) Always wear your seatbelt. 5) Keep your phone charged and accessible. 6) Trust your instincts — if something feels wrong, don''t get in the vehicle. 7) Use the in-app emergency button if needed. 8) Never share personal information with your driver beyond what''s needed for the trip.',
    'safety',
    ARRAY['safety', 'tips', 'riders', 'verification', 'tracking', 'advice', 'rider safety'],
    'website_analysis'
),
(
    'Emergency Features in Spinr App',
    'Spinr includes emergency features in the app: 1) Emergency button — tap to quickly contact 911; your location and trip details are automatically shared with emergency responders. 2) Share ride — send a live tracking link to trusted contacts. 3) GPS tracking — your entire trip is recorded with GPS coordinates. 4) Anonymous contact — your personal phone number is never shared. If you feel unsafe during a ride, use the emergency button immediately. You can also end the ride and exit the vehicle at any safe location.',
    'safety',
    ARRAY['emergency', 'safety', 'button', '911', 'help', 'urgent', 'panic', 'sos'],
    'website_analysis'
),
(
    'How to Report a Safety Incident',
    'To report a safety incident: 1) In the app, go to Trip History and select the relevant trip. 2) Tap "Report an Issue" > "Safety Concern". 3) Describe what happened in detail. 4) Submit the report. For immediate emergencies, call 911 directly or use the in-app emergency button. You can also email support@spinr.ca with "SAFETY" in the subject line for priority handling. All safety reports are taken seriously and investigated promptly.',
    'safety',
    ARRAY['report', 'incident', 'safety concern', 'complaint', 'issue', 'problem'],
    'website_analysis'
),
(
    'How to Verify Your Spinr Driver',
    'Before getting into any Spinr vehicle, ALWAYS verify: 1) Driver''s name — matches what the app shows. 2) Driver''s photo — matches the person in the vehicle. 3) Vehicle make, model, and color — matches the app description. 4) License plate number — matches the app. Ask your driver "Who are you picking up?" instead of giving your name. If ANY detail doesn''t match, DO NOT get in the vehicle and report it immediately through the app.',
    'safety',
    ARRAY['verify', 'driver identity', 'check', 'license plate', 'safety', 'confirm driver'],
    'website_analysis'
),
(
    'SGI Safety Standards Compliance',
    'Spinr complies with Saskatchewan Government Insurance (SGI) safety standards. All drivers must pass: 1) RCMP criminal record check. 2) Vulnerable sector check. 3) Clean driving abstract review. 4) Annual SGI mechanical safety inspection for vehicles. Our safety protocols meet or exceed provincial requirements for rideshare services (Transportation Network Companies) in Saskatchewan.',
    'safety',
    ARRAY['sgi', 'standards', 'compliance', 'saskatchewan', 'government', 'insurance', 'regulations', 'tnc'],
    'website_analysis'
),
(
    'Driver Background Check Process',
    'Every Spinr driver must pass a thorough screening before being approved: 1) RCMP criminal record check — identifies any criminal history. 2) Vulnerable sector check — enhanced screening for working with the public. 3) Driving abstract review — verifies a clean driving record with no major infractions. 4) Identity verification — confirms the driver is who they say they are. Background checks must be renewed periodically. Any serious offence results in immediate removal from the platform.',
    'safety',
    ARRAY['background check', 'criminal check', 'rcmp', 'screening', 'driver vetting', 'safety'],
    'website_analysis'
),
(
    'Zero Tolerance Drug and Alcohol Policy',
    'Spinr maintains a strict zero-tolerance policy for drug and alcohol use while driving. Any confirmed report of a driver under the influence results in immediate and permanent removal from the platform. If you suspect your driver is impaired: 1) Ask them to stop the vehicle in a safe location. 2) Exit the vehicle. 3) Use the in-app emergency button or call 911. 4) Report the incident through the app. Your safety is our top priority.',
    'safety',
    ARRAY['drugs', 'alcohol', 'zero tolerance', 'impaired', 'dui', 'drunk', 'intoxicated', 'safety'],
    'website_analysis'
),
(
    'Vehicle Insurance During Rides',
    'Every active Spinr ride is covered by $2 million in commercial liability insurance. This coverage is active from the moment a driver accepts your ride until you are safely dropped off. This is in addition to the driver''s personal auto insurance. In the event of an accident during a ride, you are covered by this commercial policy.',
    'safety',
    ARRAY['insurance', 'coverage', 'liability', '$2m', 'accident', 'protection', 'safety'],
    'website_analysis'
),
(
    'Rate Your Driver or Rider',
    'After each ride, both riders and drivers can rate each other on a 5-star scale and leave optional feedback. Ratings help maintain quality service. To rate: the app will prompt you after the ride ends. You can also rate later from Trip History. Tips for rating: 5 stars = excellent service, safe driving, clean vehicle. Lower ratings should reflect genuine issues. Repeatedly low-rated drivers may receive warnings or be removed from the platform.',
    'rider',
    ARRAY['rating', 'feedback', 'driver', 'review', 'stars', 'rate', 'score'],
    'website_analysis'
),
(
    'What Happens If I Get a Low Rating as a Rider',
    'Riders also have ratings on Spinr. Drivers rate riders after each trip. If your rider rating drops too low, it may become harder to get rides as drivers can see your rating. To maintain a good rating: 1) Be ready at the pickup location. 2) Be respectful and courteous. 3) Keep the vehicle clean. 4) Wear your seatbelt. 5) Don''t slam doors. 6) Don''t eat or drink without asking. If you believe a rating is unfair, contact support@spinr.ca.',
    'rider',
    ARRAY['rider rating', 'low rating', 'my rating', 'passenger rating', 'improve rating'],
    'website_analysis'
),
(
    'Wheelchair Accessible Rides',
    'Spinr is committed to accessibility. We are working to add wheelchair-accessible vehicle options to the platform. Currently, riders who need wheelchair-accessible vehicles should contact support@spinr.ca in advance so we can help coordinate an accessible ride. If you have accessibility needs, please mention them when booking so your driver can prepare.',
    'rider',
    ARRAY['wheelchair', 'accessible', 'accessibility', 'disability', 'mobility', 'handicap'],
    'website_analysis'
),
(
    'Service Animal Policy',
    'Spinr has a strict service animal policy in compliance with Saskatchewan human rights law. Drivers MUST accommodate riders with service animals. Service animals are allowed in all Spinr vehicles at no extra charge. Drivers who refuse to transport a rider with a service animal will face consequences including potential deactivation. You do not need to notify the driver in advance about your service animal.',
    'rider',
    ARRAY['service animal', 'guide dog', 'disability', 'animal', 'service dog', 'policy'],
    'website_analysis'
),
(
    'Pet Policy',
    'Pets (non-service animals) are allowed at the driver''s discretion. If you need to bring a pet, it is recommended to: 1) Note it in the ride request or message your driver. 2) Use a pet carrier for smaller animals. 3) Keep your pet restrained and calm. 4) Clean up any pet hair or mess. Drivers are not required to accept pets (except service animals). A cleaning fee may apply if your pet creates a mess in the vehicle.',
    'rider',
    ARRAY['pet', 'dog', 'cat', 'animal', 'bring pet', 'pet allowed'],
    'website_analysis'
),
(
    'Child Car Seat Policy',
    'Saskatchewan law requires children to be properly secured in appropriate car seats or booster seats based on their age, weight, and height. Spinr drivers are NOT required to provide car seats. If you are traveling with a child who needs a car seat, you must bring your own and install it yourself. It is the rider''s responsibility to ensure children are properly restrained according to Saskatchewan law.',
    'rider',
    ARRAY['car seat', 'child seat', 'booster', 'baby seat', 'child', 'infant', 'kids'],
    'website_analysis'
),
(
    'Maximum Number of Passengers',
    'The maximum number of passengers in a standard Spinr ride is determined by the number of available seatbelts in the vehicle (typically 4 passengers for a standard sedan). Every passenger must have their own seatbelt. Do not exceed the vehicle''s seatbelt capacity. If you have a larger group, consider booking multiple rides.',
    'rider',
    ARRAY['passengers', 'maximum', 'how many', 'group', 'capacity', 'seatbelts', 'people'],
    'website_analysis'
),
(
    'Luggage and Large Items',
    'Standard Spinr vehicles can accommodate typical luggage (1-2 suitcases plus carry-on bags). For large items or extra luggage, consider messaging your driver before pickup to confirm trunk space. Items that are excessively large, dangerous, or that could damage the vehicle may not be accommodated. Drivers have the right to decline items that pose a safety risk or don''t fit in their vehicle.',
    'rider',
    ARRAY['luggage', 'suitcase', 'bags', 'large items', 'trunk', 'storage'],
    'website_analysis'
),
(
    'Smoking and Vaping Policy',
    'Smoking and vaping are strictly prohibited in all Spinr vehicles. This applies to both riders and drivers. This includes cigarettes, e-cigarettes, vapes, cannabis, and any other smoking/vaping devices. Violation may result in a cleaning fee charged to the rider and/or account suspension.',
    'rider',
    ARRAY['smoking', 'vaping', 'cigarette', 'no smoking', 'cannabis', 'policy'],
    'website_analysis'
),
(
    'Alcohol Consumption in Vehicle',
    'Open alcohol containers and drinking alcohol in the vehicle are NOT permitted during Spinr rides. This is consistent with Saskatchewan law regarding open liquor in vehicles. You may transport sealed, unopened alcohol as a passenger. Intoxicated riders who are disruptive or pose a safety risk may have their ride cancelled by the driver.',
    'rider',
    ARRAY['alcohol', 'drinking', 'open container', 'liquor', 'beer', 'drunk', 'intoxicated'],
    'website_analysis'
),
(
    'Unaccompanied Minors Policy',
    'Spinr does NOT permit unaccompanied minors (anyone under 18) to ride without an adult. Drivers have the right and obligation to cancel rides where the passenger appears to be a minor without adult supervision. No cancellation fee will be charged to the driver in this case. Parents should NOT request rides for their children unless an adult will be accompanying them in the vehicle.',
    'rider',
    ARRAY['minor', 'child', 'unaccompanied', 'under 18', 'teenager', 'kids alone'],
    'website_analysis'
);

INSERT INTO public.knowledge_base (title, content, category, tags, source) VALUES
(
    'How to Become a Spinr Driver',
    'To become a Spinr driver: 1) Download the Spinr Driver app from the App Store or Google Play. 2) Create a driver account. 3) Submit required documents: valid Saskatchewan driver''s license, vehicle registration, proof of commercial auto insurance, and criminal record/background check. 4) Pass the vehicle inspection. 5) Complete the online onboarding. 6) Get approved and start accepting rides. You must be in Saskatoon to drive, as Spinr is currently only available there. The process can be completed in as little as 24 hours.',
    'driver',
    ARRAY['apply', 'become', 'driver', 'sign up', 'register', 'how to', 'start driving', 'onboarding'],
    'website_analysis'
),
(
    'Driver Onboarding Process and Timeline',
    'The Spinr driver onboarding process: 1) Sign up online (2 minutes). 2) Upload documents through the secure portal (driver''s license, vehicle registration, proof of insurance). 3) Background check processing (typically 1-5 business days). 4) Vehicle inspection (schedule at an SGI-approved facility). 5) Account approval. 6) Download the driver app and go online. Most drivers are approved and driving within 1-7 days depending on background check and inspection timing.',
    'driver',
    ARRAY['onboarding', 'process', 'timeline', 'how long', 'approval', 'steps', 'start'],
    'website_analysis'
),
(
    'How to Check Driver Application Status',
    'To check your driver application status: 1) Open the Spinr Driver app. 2) Go to your profile/account section. 3) View the "Application Status" page showing each step and its status. Stages include: Documents Received, Background Check In Progress, Background Check Approved, Vehicle Inspection Pending, Approved. If your application is taking longer than expected, email support@spinr.ca with your name and email.',
    'driver',
    ARRAY['application status', 'check status', 'pending', 'approved', 'how long', 'waiting'],
    'website_analysis'
),
(
    'Driver Requirements and Eligibility',
    'To drive with Spinr you must: 1) Be at least 21 years old. 2) Have a valid Saskatchewan driver''s license (Class 5 or higher) for at least 1 year. 3) Have at least 1 year of driving experience. 4) Pass a comprehensive RCMP criminal record check and vulnerable sector check. 5) Have a clean driving abstract (no major infractions). 6) Have a vehicle that meets Spinr''s requirements. 7) Have valid commercial auto insurance (rideshare endorsement). 8) Be located in Saskatoon (only city currently operational).',
    'driver',
    ARRAY['requirements', 'eligibility', 'qualifications', 'license', 'age', 'documents', 'who can drive'],
    'website_analysis'
),
(
    'How Old Do I Need to Be to Drive for Spinr',
    'You must be at least 21 years old to drive with Spinr. This age requirement ensures drivers have sufficient driving maturity and experience. You must also have held a valid Saskatchewan driver''s license (Class 5 or higher) for at least 1 year.',
    'driver',
    ARRAY['age', 'minimum age', 'how old', '21', 'age requirement'],
    'website_analysis'
),
(
    'Driver License Requirements',
    'To drive with Spinr, you need: 1) A valid Saskatchewan Class 5 (or higher) driver''s license. 2) The license must have been held for at least 1 year. 3) A clean driving abstract with no major infractions (e.g., no DUIs, no reckless driving). Learner''s permits and Novice (Class 7) licenses are NOT accepted. If you have an out-of-province license, you must obtain a Saskatchewan license first.',
    'driver',
    ARRAY['license', 'class 5', 'driver license', 'driving license', 'permit', 'requirements'],
    'website_analysis'
),
(
    'Required Documents for Spinr Drivers',
    'To drive with Spinr, you need to submit: 1) Valid Saskatchewan driver''s license (Class 5 or higher). 2) Current vehicle registration in your name. 3) Proof of commercial auto insurance with rideshare endorsement (standard personal insurance is NOT sufficient). 4) RCMP criminal record check clearance. 5) Vulnerable sector check clearance. 6) Vehicle safety inspection certificate from an SGI-approved facility. Upload all documents through the Spinr Driver app during onboarding.',
    'driver',
    ARRAY['documents', 'license', 'registration', 'insurance', 'background check', 'paperwork', 'required'],
    'website_analysis'
),
(
    'Vehicle Requirements for Spinr Drivers',
    'Your vehicle must meet these requirements: 1) Maximum 10 years old (from current year). 2) Have 4 doors. 3) Have 5 or more seatbelts. 4) Be in good mechanical and cosmetic condition. 5) Pass an annual SGI mechanical safety inspection. 6) Have valid registration and commercial auto insurance. 7) Be clean and well-maintained for rider comfort. Motorcycles, scooters, 2-door vehicles, and commercial trucks are NOT accepted. Winter tires are recommended seasonally.',
    'driver',
    ARRAY['vehicle', 'requirements', 'car', 'inspection', 'age', 'condition', 'make', 'model', 'year'],
    'website_analysis'
),
(
    'Vehicle Inspection Requirements',
    'All Spinr vehicles must pass an SGI (Saskatchewan Government Insurance) mechanical safety inspection: 1) Initial inspection required before approval. 2) Annual re-inspection required every 12 months. 3) Inspection must be done at an SGI-approved inspection facility. 4) Covers brakes, tires, lights, steering, suspension, exhaust, and overall safety. 5) You pay for the inspection cost. 6) If your vehicle fails, you must complete repairs and re-inspect before driving on the platform.',
    'driver',
    ARRAY['inspection', 'vehicle inspection', 'sgi', 'safety inspection', 'mechanical', 'annual'],
    'website_analysis'
),
(
    'What If My Vehicle Fails Inspection',
    'If your vehicle fails the SGI safety inspection: 1) The inspection report will detail what needs to be fixed. 2) Complete the required repairs at a mechanic of your choice. 3) Return to an SGI-approved facility for a re-inspection. 4) Once passed, upload the new inspection certificate to the Spinr app. You cannot drive on the platform until your vehicle passes inspection. Common failure reasons: worn brakes, tire tread depth, light bulbs out, suspension issues.',
    'driver',
    ARRAY['failed inspection', 'vehicle failed', 'repair', 'fix', 're-inspect', 'not passed'],
    'website_analysis'
),
(
    'Can I Use a Leased or Financed Vehicle',
    'Yes, you can use a leased or financed vehicle to drive with Spinr, as long as: 1) The vehicle meets all Spinr requirements (age, doors, condition). 2) Your lease/finance agreement does not prohibit rideshare use. 3) You have commercial auto insurance with a rideshare endorsement. Check with your leasing company or lender to confirm rideshare use is permitted under your agreement.',
    'driver',
    ARRAY['leased', 'financed', 'lease', 'financing', 'car payment', 'rental'],
    'website_analysis'
),
(
    'How to Update Vehicle Information',
    'If you change vehicles or need to update vehicle information: 1) Go to the Driver app > Settings > Vehicle. 2) Update your vehicle details (make, model, year, color, license plate). 3) Upload new vehicle registration. 4) Upload a new SGI inspection certificate for the new vehicle. 5) Wait for approval before driving with the new vehicle. You must update your insurance to cover the new vehicle as well.',
    'driver',
    ARRAY['update vehicle', 'new car', 'change vehicle', 'swap vehicle', 'vehicle info'],
    'website_analysis'
),
(
    'Driver Insurance Requirements',
    'Spinr drivers MUST have commercial auto insurance with a rideshare endorsement. Standard personal auto insurance does NOT cover rideshare driving and will leave you personally liable. In Saskatchewan, SGI offers a rideshare endorsement (TNP endorsement) that you can add to your existing policy. Contact SGI or your insurance broker to add rideshare coverage. Driving without proper insurance can result in: 1) Deactivation from Spinr. 2) Personal liability in an accident. 3) Insurance claim denial.',
    'driver',
    ARRAY['insurance', 'coverage', 'commercial', 'sgi', 'rideshare insurance', 'policy', 'tnp', 'endorsement'],
    'website_analysis'
),
(
    'Spinr Commercial Liability Insurance',
    'Spinr provides $2 million in commercial liability insurance coverage during active rides. This coverage kicks in from the moment you accept a ride until the rider is dropped off. IMPORTANT: This does NOT replace your personal rideshare insurance — you must still have your own commercial/rideshare insurance policy. Spinr''s insurance covers third-party liability during active trips. Contact SGI for personal rideshare endorsement details.',
    'driver',
    ARRAY['commercial insurance', '$2m', 'liability', 'coverage', 'spinr insurance', 'during ride'],
    'website_analysis'
),
(
    'Background Check Process for Drivers',
    'The Spinr background check process includes: 1) RCMP criminal record check — screens for criminal history. 2) Vulnerable sector check — enhanced screening for safety of the public. 3) Driving abstract review — verifies your driving history and record. Processing typically takes 1-5 business days. You may need to visit a local police service or RCMP detachment to initiate the check. The cost of background checks is the driver''s responsibility. Checks must be renewed periodically.',
    'driver',
    ARRAY['background check', 'criminal record', 'rcmp', 'vulnerable sector', 'screening', 'how long'],
    'website_analysis'
),
(
    'What Disqualifies Me from Driving',
    'You may be disqualified from driving with Spinr if: 1) You have serious criminal convictions (violent crimes, sexual offences, etc.). 2) You have DUI/DWI convictions. 3) Your driving abstract shows major infractions or too many demerit points. 4) You fail the vehicle inspection and don''t complete repairs. 5) You don''t have proper insurance. 6) You are under 21 years old. 7) You don''t have a Class 5 SK license held for 1+ year. Specific disqualification criteria may vary — contact support@spinr.ca for questions.',
    'driver',
    ARRAY['disqualified', 'rejected', 'criminal record', 'dui', 'not approved', 'denied'],
    'website_analysis'
);

INSERT INTO public.knowledge_base (title, content, category, tags, source) VALUES
(
    'Driver Earnings and Commission',
    'With Spinr, drivers keep 100% of the net fare. Spinr charges 0% commission — now and forever. This is our fundamental promise. We make money through the flat $1 fee charged to riders and optional driver subscriptions, not by taking from driver earnings. Every dollar of the fare you earn is yours to keep. Compare this to Uber/Lyft which take 20-30% of your earnings.',
    'driver',
    ARRAY['earnings', 'commission', '0%', 'pay', 'money', 'income', 'zero commission', 'how much'],
    'website_analysis'
),
(
    'How Driver Fares are Calculated',
    'Driver fares on Spinr are calculated based on: 1) Base fare — a fixed starting amount for accepting the ride. 2) Per-kilometer rate — for distance driven during the trip. 3) Per-minute rate — for time spent on the trip. Drivers keep 100% of this fare with 0% commission. Riders see the upfront price and pay the fare plus a flat $1 platform fee. There is no surge pricing that would increase or decrease the fare. Average fare is approximately $18 per trip.',
    'driver',
    ARRAY['fare', 'calculation', 'rate', 'pricing', 'how much', 'per km', 'per minute', 'base fare'],
    'website_analysis'
),
(
    'Average Driver Earnings Per Trip',
    'The average Spinr fare is approximately $18 per trip. Since Spinr charges 0% commission, you keep the full $18. At 40 trips per week, that''s approximately $720/week or $37,440/year. On a competitor platform taking 25% commission, the same 40 trips would earn you only $540/week — that''s $180 less per week or $9,360 less per year. Your actual earnings will vary based on trip distance, duration, and local demand.',
    'driver',
    ARRAY['average earnings', 'how much', 'per trip', 'weekly earnings', 'income estimate'],
    'website_analysis'
),
(
    'Spinr Driver Subscription Plans Overview',
    'Spinr offers two subscription plans for drivers. BOTH are FREE for the first 6 months: 1) Standard Driver — $19.99/month (after trial). Limited to 5 rides per day. Includes 100% fare retention, weekly payouts, standard support, basic app features. 2) Pro Driver — $49.99/month (after trial). UNLIMITED rides. Includes 100% fare retention, weekly payouts, priority 24/7 support, advanced heatmaps for finding riders. Both plans can be cancelled anytime.',
    'driver',
    ARRAY['subscription', 'plan', 'premium', 'membership', 'monthly', 'standard', 'pro', 'pricing'],
    'website_analysis'
),
(
    'Standard Driver Plan Details',
    'The Standard Driver plan costs $19.99/month (FREE for the first 6 months). It includes: 1) Keep 100% of all fares (0% commission). 2) Limited to 5 rides per day maximum (resets daily). 3) Weekly payouts to your bank account. 4) Standard customer support. 5) Basic app features. This plan is ideal for part-time drivers or those who want to try Spinr with lower costs. Cancel anytime with no penalty.',
    'driver',
    ARRAY['standard plan', '$19.99', 'basic', '5 rides', 'part time', 'subscription'],
    'website_analysis'
),
(
    'Pro Driver Plan Details',
    'The Pro Driver plan costs $49.99/month (FREE for the first 6 months). It includes: 1) Keep 100% of all fares (0% commission). 2) UNLIMITED rides — drive as much as you want with no daily cap. 3) Weekly payouts to your bank account. 4) Priority 24/7 customer support. 5) Advanced heatmaps showing rider demand areas. This plan is ideal for full-time drivers who want maximum earning potential. Most popular plan. Cancel anytime.',
    'driver',
    ARRAY['pro plan', '$49.99', 'unlimited', 'premium', 'full time', 'heatmaps', 'subscription'],
    'website_analysis'
),
(
    '6-Month Free Trial for Drivers',
    'ALL new Spinr drivers get 6 months completely FREE on any subscription plan. During the free trial: 1) You pay $0/month. 2) You keep 100% of all fares. 3) All plan features are fully available. After 6 months, billing begins at $19.99/month (Standard) or $49.99/month (Pro). You can switch plans or cancel at any time. There are no commitments or contracts — cancel before the trial ends if you don''t want to continue.',
    'driver',
    ARRAY['free trial', '6 months', 'free', 'trial period', 'no cost', 'try free'],
    'website_analysis'
),
(
    'How to Choose Between Standard and Pro Plans',
    'Choose Standard ($19.99/mo) if: you drive part-time, do fewer than 5 rides per day, or want the lowest cost. Choose Pro ($49.99/mo) if: you drive full-time, want unlimited rides, need priority support, or want heatmaps to find riders. Break-even analysis: You only need about 5 rides in a month to cover the Standard subscription, or about 12 rides to cover Pro. Both plans are free for 6 months so you can try before you pay.',
    'driver',
    ARRAY['which plan', 'compare plans', 'standard vs pro', 'choose plan', 'best plan'],
    'website_analysis'
),
(
    'How to Cancel Driver Subscription',
    'To cancel your Spinr driver subscription: 1) Open the Driver app. 2) Go to Settings > Subscription. 3) Tap "Cancel Subscription". 4) Confirm cancellation. Your subscription remains active until the end of the current billing period. After cancellation, you will no longer be able to accept rides once the period expires. You can resubscribe at any time. During the 6-month free trial, cancelling means you won''t be charged when the trial ends.',
    'driver',
    ARRAY['cancel subscription', 'unsubscribe', 'stop paying', 'end subscription', 'cancel plan'],
    'website_analysis'
),
(
    'Can I Switch Between Standard and Pro Plans',
    'Yes, you can switch between Standard and Pro plans at any time. Go to the Driver app > Settings > Subscription > Change Plan. When upgrading from Standard to Pro, the change takes effect immediately and you''ll be charged the prorated difference. When downgrading from Pro to Standard, the change takes effect at the start of your next billing cycle.',
    'driver',
    ARRAY['switch plan', 'upgrade', 'downgrade', 'change plan', 'standard to pro', 'pro to standard'],
    'website_analysis'
),
(
    'What Happens After the 6-Month Free Trial',
    'After the 6-month free trial ends: 1) Billing begins automatically at your plan rate ($19.99/mo Standard or $49.99/mo Pro). 2) You will be notified before billing starts. 3) Your payment method on file will be charged. 4) You can cancel before the trial ends to avoid charges. 5) You can switch plans before or after the trial. If no payment method is on file, your account will be paused until payment is set up.',
    'driver',
    ARRAY['after trial', 'trial ends', 'billing starts', 'first charge', 'post trial'],
    'website_analysis'
),
(
    'Driver Weekly Payouts',
    'Spinr processes driver payouts every week. Your earnings are deposited directly into your bank account every Tuesday. The pay period runs Monday to Sunday. To set up direct deposit: go to the Driver app > Settings > Bank Account and enter your banking information (institution number, transit number, account number). Since drivers keep 100% of net fare with 0% commission, you receive all the money you''ve earned from fares.',
    'driver',
    ARRAY['payout', 'payment', 'weekly', 'tuesday', 'bank', 'deposit', 'earnings', 'direct deposit', 'when paid'],
    'website_analysis'
),
(
    'How to Set Up Direct Deposit',
    'To receive your earnings, set up direct deposit: 1) Open the Driver app. 2) Go to Settings > Bank Account / Payout Settings. 3) Enter your bank details: institution number (3 digits), transit/branch number (5 digits), and account number. 4) Save and verify. Payouts are processed every Tuesday for the previous week''s earnings (Monday-Sunday). Make sure your banking information is correct to avoid payout delays.',
    'driver',
    ARRAY['direct deposit', 'bank account', 'setup', 'bank details', 'payout setup', 'institution number'],
    'website_analysis'
),
(
    'Why Is My Payout Delayed',
    'Payouts may be delayed if: 1) Your bank information is incorrect or incomplete. 2) Your bank account was recently changed. 3) There is a hold on your account for pending investigation. 4) A statutory holiday falls on the payout day (Tuesday). 5) Your account is under review. If your payout is delayed beyond 3 business days from Tuesday, contact support@spinr.ca with your account details.',
    'driver',
    ARRAY['payout delayed', 'late payment', 'no payout', 'missing payment', 'payment delay'],
    'website_analysis'
),
(
    'How Tips Work for Drivers',
    'Riders can tip you through the Spinr app after their ride. You receive 100% of all tips — Spinr does NOT take any cut. Tips are included in your weekly payout. You can view your tip earnings in the Driver app under Earnings. Tips are separate from fares and are not affected by your subscription plan. Being friendly, safe, and keeping a clean vehicle are great ways to earn more tips.',
    'driver',
    ARRAY['tips', 'tipping', 'gratuity', 'tip earnings', '100% tips'],
    'website_analysis'
),
(
    'Driver Bonuses and Incentives',
    'Spinr may offer bonuses and incentives to drivers from time to time. These may include: 1) Sign-up bonuses for new drivers. 2) Referral bonuses for bringing new drivers to the platform. 3) Peak hour bonuses during high-demand periods. 4) Ride completion bonuses for completing a certain number of rides. 5) Event-based incentives (e.g., game day bonuses). Check the Driver app regularly for available promotions and bonus opportunities.',
    'driver',
    ARRAY['bonuses', 'incentives', 'promotions', 'extra earnings', 'referral', 'sign up bonus'],
    'website_analysis'
),
(
    'Driver Referral Program',
    'Earn money by referring new drivers to Spinr. When you refer a friend and they complete a certain number of rides, both you and your friend may receive a referral bonus. To refer: 1) Open the Driver app. 2) Go to Settings > Referrals. 3) Share your unique referral code or link. 4) Your friend signs up using your code. 5) Once they meet the requirements, both of you receive the bonus. Check the app for current referral bonus amounts.',
    'driver',
    ARRAY['referral', 'refer a friend', 'referral code', 'referral bonus', 'invite driver'],
    'website_analysis'
);

INSERT INTO public.knowledge_base (title, content, category, tags, source) VALUES
(
    'Driver Tax Information',
    'As a Spinr driver, you are an independent contractor, NOT an employee. You are responsible for: 1) Reporting your rideshare income on your tax return (T1 General). 2) Keeping records of your earnings, expenses, and mileage. 3) Potentially collecting and remitting GST/HST if you earn over $30,000 per year in rideshare income. 4) Tracking deductible expenses such as gas, vehicle maintenance, insurance, phone costs, and car washes. Spinr provides annual earnings summaries to help with tax filing. Consult a tax professional for personalized advice.',
    'driver',
    ARRAY['tax', 'income', 'gst', 'hst', 'deductions', 'independent contractor', 'tax filing', 'taxes'],
    'website_analysis'
),
(
    'Independent Contractor Status',
    'Spinr drivers are independent contractors, NOT employees. This means: 1) You set your own hours — Spinr does not dictate when you work. 2) You use your own vehicle. 3) You are responsible for your own taxes. 4) You do not receive employee benefits (health insurance, vacation pay, CPP contributions from Spinr). 5) You can drive for other platforms simultaneously. 6) You can accept or decline any ride request. This independent contractor relationship is outlined in the Driver Agreement.',
    'driver',
    ARRAY['independent contractor', 'employee', 'self-employed', 'contractor', 'employment status'],
    'website_analysis'
),
(
    'GST/HST for Rideshare Drivers',
    'If your annual rideshare income exceeds $30,000 CAD, you are required to register for GST/HST with the Canada Revenue Agency (CRA). Once registered, you must: 1) Collect GST/HST on your rideshare fares. 2) File regular GST/HST returns. 3) Remit the collected tax to CRA. You can also claim Input Tax Credits (ITCs) on business expenses. If you earn under $30,000, registration is optional. Consult a tax professional for your specific situation.',
    'driver',
    ARRAY['gst', 'hst', 'sales tax', '$30000', 'cra', 'tax registration', 'tax threshold'],
    'website_analysis'
),
(
    'Tax Deductible Expenses for Drivers',
    'Common tax-deductible expenses for Spinr drivers include: 1) Fuel/gas costs (business portion). 2) Vehicle maintenance and repairs (business portion). 3) Commercial auto insurance premiums. 4) Car washes. 5) Phone and data plan (business portion). 6) Vehicle depreciation. 7) Parking fees related to rideshare. 8) SGI vehicle inspection fees. 9) Background check fees. Keep all receipts and track your mileage. The CRA allows either the simplified method (per-km rate) or the detailed method (actual expenses) for vehicle costs. Consult a tax professional.',
    'driver',
    ARRAY['deductions', 'expenses', 'tax deductible', 'write off', 'fuel', 'mileage', 'receipts'],
    'website_analysis'
),
(
    'Spinr Annual Earnings Summary',
    'Spinr provides an annual earnings summary to help with tax filing. This document shows your total fare earnings, tips, bonuses, and subscription costs for the tax year. You can access it in the Driver app under Settings > Tax Documents or Earnings > Annual Summary. This summary is typically available in February for the previous tax year. Save this document for your tax records.',
    'driver',
    ARRAY['earnings summary', 'tax document', 'annual summary', 't4a', 'income statement', 'tax records'],
    'website_analysis'
),
(
    'How to Accept and Decline Rides',
    'When a ride request comes in: 1) You''ll hear a notification and see ride details (pickup location, estimated distance, estimated fare). 2) Tap "Accept" to take the ride, or let it time out / tap "Decline" to skip it. 3) Once accepted, navigate to the rider''s pickup location. 4) Confirm pickup when the rider is in the car. 5) Follow the route to the destination. 6) End the trip when you arrive. You are not required to accept every ride — as an independent contractor, you choose which rides to take.',
    'driver',
    ARRAY['accept ride', 'decline ride', 'ride request', 'how to drive', 'accept', 'reject'],
    'website_analysis'
),
(
    'Best Times to Drive with Spinr',
    'Peak demand times in Saskatoon typically include: 1) Morning rush hour (7-9 AM) — commuters. 2) Lunch hour (11:30 AM - 1:30 PM). 3) Evening rush hour (4-7 PM) — commuters. 4) Friday and Saturday nights (9 PM - 2 AM) — nightlife. 5) Saskatchewan Roughriders game days (before and after games). 6) Special events, concerts, and festivals. 7) Bad weather days — more people need rides. Pro plan drivers have access to advanced heatmaps showing real-time demand areas.',
    'driver',
    ARRAY['peak hours', 'best times', 'busy times', 'when to drive', 'demand', 'heatmap'],
    'website_analysis'
),
(
    'Safety Tips for Spinr Drivers',
    'For driver safety: 1) Verify rider identity — check the rider''s name. 2) Follow all traffic laws and drive defensively. 3) Keep your vehicle well-maintained and clean. 4) Use in-app navigation for optimal routes. 5) Report any safety concerns through the app immediately. 6) Do not drive while fatigued — take regular breaks. 7) Keep doors locked between rides. 8) Trust your instincts — you can decline rides if you feel unsafe. 9) Never drive under the influence of drugs or alcohol. 10) Keep your phone mounted safely, not handheld.',
    'driver',
    ARRAY['safety', 'tips', 'drivers', 'driving safety', 'driver safety', 'safe driving'],
    'website_analysis'
),
(
    'Understanding Your Driver Rating',
    'After each ride, riders rate drivers on a 1-5 star scale. Your overall rating is an average of your recent ratings. To maintain a high rating: 1) Be friendly and professional. 2) Keep your vehicle clean inside and out. 3) Follow the optimal route (use navigation). 4) Drive safely and smoothly. 5) Offer to help with luggage. 6) Don''t use your phone while driving. 7) Keep the music at a reasonable level. A rating below a certain threshold may result in warnings or deactivation.',
    'driver',
    ARRAY['rating', 'driver rating', 'stars', 'score', 'improve rating', 'low rating'],
    'website_analysis'
),
(
    'Driver Deactivation Policy',
    'Drivers may be deactivated (removed) from Spinr for: 1) Consistently low ratings below the minimum threshold. 2) Zero tolerance violations — drug/alcohol use while driving (permanent removal). 3) Criminal activity or safety violations. 4) Fraudulent activity. 5) Harassment or discrimination. 6) Expired documents (license, insurance, inspection). 7) Refusing service animals. 8) Repeated complaints from riders. Deactivation may be temporary or permanent depending on severity. You can appeal by contacting support@spinr.ca.',
    'driver',
    ARRAY['deactivation', 'removed', 'suspended', 'banned', 'terminated', 'kicked off'],
    'website_analysis'
),
(
    'How to Handle Difficult Passengers',
    'If you encounter a difficult passenger: 1) Stay calm and professional. 2) Do not engage in arguments. 3) If you feel unsafe, pull over in a safe location and ask the rider to exit. 4) Use the in-app emergency button if there is a serious threat. 5) Report the incident through the app after the ride. 6) Contact support@spinr.ca with details. You have the right to end a ride if your safety is at risk. Spinr takes driver safety seriously and will investigate all reported incidents.',
    'driver',
    ARRAY['difficult passenger', 'problem rider', 'rude rider', 'unsafe rider', 'complaint', 'conflict'],
    'website_analysis'
),
(
    'How to Report a Rider',
    'To report a rider after a trip: 1) Open the Driver app > Trip History. 2) Select the relevant trip. 3) Tap "Report an Issue". 4) Choose the category (safety concern, inappropriate behavior, damage, etc.). 5) Provide details about what happened. 6) Submit the report. For immediate safety threats, use the emergency button or call 911. Spinr will review the report and may take action against the rider, including warnings or account suspension.',
    'driver',
    ARRAY['report rider', 'complaint', 'bad rider', 'rider issue', 'report passenger'],
    'website_analysis'
),
(
    'Accident Procedure for Drivers',
    'If you are involved in an accident while driving for Spinr: 1) Ensure everyone''s safety first — call 911 if anyone is injured. 2) Move to a safe location if possible. 3) Exchange information with the other party. 4) Take photos of all damage and the accident scene. 5) File a police report. 6) Report the accident to Spinr through the app or by emailing support@spinr.ca. 7) Contact your insurance provider. 8) Contact SGI if applicable. Spinr''s $2M commercial liability coverage is active during rides.',
    'driver',
    ARRAY['accident', 'crash', 'collision', 'what to do', 'insurance claim', 'police report'],
    'website_analysis'
),
(
    'Cleaning Fee Claims for Drivers',
    'If a rider makes a mess in your vehicle, you can claim a cleaning fee: 1) Take clear photos of the mess immediately after the ride. 2) Go to Trip History > select the trip > Report an Issue > Rider made a mess. 3) Upload photos and describe the situation. 4) Spinr will review and may charge the rider a cleaning fee ($20-$150 depending on severity). 5) The fee will be added to your payout. Keep the photos until the claim is resolved.',
    'driver',
    ARRAY['cleaning fee', 'mess', 'vomit', 'spill', 'damage claim', 'rider mess'],
    'website_analysis'
),
(
    'Can I Drive for Multiple Rideshare Platforms',
    'Yes. As an independent contractor, you are free to drive for multiple rideshare platforms simultaneously. Spinr does not have exclusivity requirements. However: 1) Only go online on one platform at a time for safety. 2) Never accept rides from two platforms simultaneously. 3) Ensure your insurance covers all platforms you drive for. 4) Be mindful of your daily ride limit if on the Standard plan (5/day).',
    'driver',
    ARRAY['multiple platforms', 'uber', 'lyft', 'other apps', 'exclusivity', 'multi-app'],
    'website_analysis'
),
(
    'Driver Support and Resources',
    'Spinr provides support for drivers through: 1) In-app help center — guides, FAQs, and articles. 2) In-app messaging — contact support directly. 3) Email — support@spinr.ca. 4) Pro plan drivers get priority 24/7 support. For road emergencies, use the in-app emergency button. Response times: Standard support responds within 24 hours. Pro priority support has faster response times. Check the Driver app Help section for self-service articles.',
    'driver',
    ARRAY['support', 'help', 'resources', 'driver app', 'contact', 'customer service'],
    'website_analysis'
);

INSERT INTO public.knowledge_base (title, content, category, tags, source) VALUES
(
    'How to Create a Spinr Account',
    'To create a Spinr account: 1) Download the Spinr app from the App Store or Google Play. 2) Open the app and tap "Sign Up". 3) Enter your phone number and verify with the SMS code. 4) Add your name and email address. 5) Create a password. 6) Add a payment method (credit or debit card). You''re ready to ride! For drivers, download the Spinr Driver app instead and follow the driver-specific signup process.',
    'rider',
    ARRAY['account', 'create', 'sign up', 'register', 'new user', 'new account'],
    'website_analysis'
),
(
    'How to Update Profile Information',
    'To update your profile in the Spinr app: 1) Open the app. 2) Go to Settings > Profile. 3) Update your name, email, or profile photo. 4) Save changes. For security-sensitive changes like phone number or email, you may need to re-verify your identity via SMS or email code. Profile changes take effect immediately.',
    'general',
    ARRAY['profile', 'update', 'edit', 'change', 'name', 'email', 'photo'],
    'website_analysis'
),
(
    'How to Change Your Phone Number',
    'To change your phone number on Spinr: 1) Open the app. 2) Go to Settings > Profile > Phone Number. 3) Enter your new phone number. 4) Verify the new number with the SMS code sent to it. 5) Your account will be updated with the new number. You must have access to the new phone number to complete verification. If you no longer have access to your old number and cannot log in, email support@spinr.ca for assistance.',
    'general',
    ARRAY['phone number', 'change phone', 'update phone', 'new phone', 'mobile number'],
    'website_analysis'
),
(
    'How to Reset Your Password',
    'To reset your Spinr password: 1) On the login screen, tap "Forgot Password". 2) Enter the email address or phone number associated with your account. 3) Check your email/phone for a reset code. 4) Enter the code and create a new password. 5) Log in with your new password. If you don''t receive the reset code, check your spam folder. If you still can''t reset, email support@spinr.ca for help.',
    'general',
    ARRAY['password', 'reset', 'forgot password', 'change password', 'login problem', 'can''t login'],
    'website_analysis'
),
(
    'Two-Factor Authentication',
    'Spinr supports two-factor authentication (2FA) for added account security. When enabled, you''ll need to enter a verification code (sent via SMS) in addition to your password when logging in from a new device. To enable 2FA: Go to Settings > Security > Two-Factor Authentication > Enable. We recommend enabling 2FA to protect your account from unauthorized access.',
    'general',
    ARRAY['two-factor', '2fa', 'security', 'authentication', 'verification', 'mfa'],
    'website_analysis'
),
(
    'Protect Your Personal Information',
    'To keep your Spinr account secure: 1) Use a strong, unique password. 2) Enable two-factor authentication. 3) Never share your login credentials. 4) Log out on shared devices. 5) Keep your app updated to the latest version. 6) Be cautious of phishing emails/messages — Spinr will never ask for your password via email. 7) Review your trip history regularly for unauthorized activity. If you suspect unauthorized access, change your password immediately and contact support@spinr.ca.',
    'general',
    ARRAY['security', 'protect', 'personal info', 'privacy', 'safe', 'hack', 'phishing'],
    'website_analysis'
),
(
    'How to Delete Your Spinr Account',
    'To delete your Spinr account: Option 1 — In-app: Go to Settings > Account > Delete Account > Confirm. Deletion is immediate. Option 2 — Email: Send a request to support@spinr.ca (processed within 7 business days). Before deleting: 1) Resolve any pending trips or payments. 2) Download any receipts you need. 3) Note that deletion is PERMANENT and cannot be undone. After deletion: all personal data is removed, active rides are cancelled, and you will no longer be able to access your account.',
    'general',
    ARRAY['account', 'delete', 'remove', 'close account', 'deactivate', 'delete account'],
    'website_analysis'
),
(
    'What Happens After Account Deletion',
    'After you delete your Spinr account: 1) All personal data is permanently removed from our systems. 2) Trip history and receipts are deleted. 3) Any active rides are automatically cancelled. 4) Pending refunds must be resolved before deletion. 5) You will be logged out of all devices. 6) You cannot recover the account. 7) If you want to use Spinr again, you would need to create a completely new account. In-app deletion is immediate; email requests take up to 7 business days.',
    'general',
    ARRAY['after deletion', 'data removed', 'permanent', 'recover account', 'deleted data'],
    'website_analysis'
),
(
    'Spinr Privacy Policy Summary',
    'Spinr collects the following information: 1) Account info — name, email, phone, profile photo. 2) Payment details — credit card info (processed securely, not stored in full). 3) Location data — GPS during active rides for navigation and safety. 4) Trip history — pickup/dropoff locations, routes, fares. How we use your data: to facilitate rides, process payments, improve our services, communicate with you, and ensure safety. We do NOT sell your personal data to third parties.',
    'general',
    ARRAY['privacy', 'data', 'personal information', 'privacy policy', 'data collection'],
    'website_analysis'
),
(
    'Does Spinr Sell My Data',
    'NO. Spinr does NOT sell your personal data to third parties. Your information is only shared with: 1) Your driver/rider during an active trip (limited to name, photo, and location needed for the ride). 2) Payment processors to handle transactions. 3) Emergency services if you use the emergency button. 4) As required by law (e.g., court orders). We take your privacy seriously and use industry-standard security measures to protect your data.',
    'general',
    ARRAY['sell data', 'third party', 'data sharing', 'privacy', 'personal data', 'information sharing'],
    'website_analysis'
),
(
    'Your Data Rights',
    'As a Spinr user, you have the right to: 1) Access your data — view what information we have about you. 2) Correct your data — update inaccurate information. 3) Delete your data — request account deletion and data removal. 4) Opt out of marketing — unsubscribe from promotional emails. 5) Data portability — request a copy of your data. To exercise any of these rights, go to Settings > Privacy in the app or email support@spinr.ca.',
    'general',
    ARRAY['data rights', 'access data', 'delete data', 'opt out', 'gdpr', 'privacy rights'],
    'website_analysis'
),
(
    'Location Data and GPS Tracking',
    'Spinr collects location data during active rides for: 1) Navigation — guiding drivers to pickup and destination. 2) Safety — tracking the ride route in real-time. 3) Fare calculation — determining distance traveled. 4) Emergency — sharing your location with 911 if needed. Location tracking is ONLY active during rides (from booking to dropoff). Spinr does not continuously track your location when you are not using the app. You can review your location permissions in your phone settings.',
    'general',
    ARRAY['location', 'gps', 'tracking', 'location data', 'privacy', 'surveillance'],
    'website_analysis'
);

INSERT INTO public.knowledge_base (title, content, category, tags, source) VALUES
(
    'How to Download the Spinr App',
    'The Spinr app is available on both platforms: 1) iPhone/iPad — search "Spinr" in the Apple App Store and tap Download. 2) Android — search "Spinr" in the Google Play Store and tap Install. The rider app and driver app are SEPARATE apps. Download "Spinr" for riding and "Spinr Driver" for driving. Both apps are free to download. You need iOS 14+ or Android 8+ to run the app.',
    'general',
    ARRAY['download', 'app', 'install', 'ios', 'android', 'app store', 'google play', 'phone'],
    'website_analysis'
),
(
    'How to Update the Spinr App',
    'To update the Spinr app: 1) Open the App Store (iPhone) or Google Play Store (Android). 2) Search for "Spinr". 3) If an update is available, tap "Update". 4) Wait for the download and installation. You can also enable automatic updates in your phone settings. We recommend always using the latest version for the best experience, latest features, and security patches. Outdated versions may have issues connecting to our servers.',
    'general',
    ARRAY['update', 'app update', 'latest version', 'upgrade', 'new version'],
    'website_analysis'
),
(
    'App Permissions Explained',
    'Spinr requires certain permissions to function properly: 1) Location — needed to find your pickup location and track rides (required). 2) Notifications — to alert you about ride updates, driver arrival, and promotions (recommended). 3) Camera — for profile photo upload (optional). 4) Phone — for in-app calling to drivers (recommended). You can manage permissions in your phone''s Settings > Apps > Spinr. Location permission must be set to "While Using App" at minimum.',
    'general',
    ARRAY['permissions', 'location permission', 'notifications', 'camera', 'app settings'],
    'website_analysis'
),
(
    'Managing Notifications',
    'To manage Spinr notifications: 1) In-app: Go to Settings > Notifications to toggle ride updates, promotions, and driver alerts. 2) Phone settings: Go to Settings > Apps > Spinr > Notifications to control system-level notifications. We recommend keeping ride update notifications ON so you know when your driver is arriving. Marketing/promotional notifications can be turned off if desired.',
    'general',
    ARRAY['notifications', 'alerts', 'push notifications', 'turn off', 'manage notifications'],
    'website_analysis'
),
(
    'App Not Working or Crashing',
    'If the Spinr app is not working: 1) Make sure you have the latest version — check the App Store or Google Play for updates. 2) Restart the app completely (close and reopen). 3) Check your internet connection (Wi-Fi or cellular data). 4) Restart your phone. 5) Clear the app cache (Android: Settings > Apps > Spinr > Clear Cache). 6) Uninstall and reinstall the app. 7) Make sure your phone OS is up to date. If the problem persists, email support@spinr.ca with your device model, OS version, and a description of the issue.',
    'general',
    ARRAY['app', 'not working', 'crash', 'bug', 'error', 'fix', 'troubleshoot', 'broken', 'frozen'],
    'website_analysis'
),
(
    'GPS and Location Issues',
    'If the app can''t find your location or GPS is inaccurate: 1) Make sure Location Services are enabled for Spinr (Settings > Privacy > Location Services > Spinr > "While Using"). 2) Step outside — GPS works best outdoors with a clear sky view. 3) Toggle Location Services off and on. 4) Restart the app. 5) Restart your phone. 6) Check that your phone''s date/time are set to automatic. 7) If indoors, move near a window. You can also manually adjust your pickup pin on the map.',
    'general',
    ARRAY['gps', 'location', 'gps issues', 'location wrong', 'can''t find location', 'map', 'pin'],
    'website_analysis'
),
(
    'Cannot Find a Driver',
    'If you cannot find a driver: 1) Make sure you are in Saskatoon — Spinr is ONLY available in Saskatoon currently. 2) Try again in a few minutes — driver availability varies by time. 3) Check that your pickup location is accessible and correct on the map. 4) Try adjusting your pickup to a nearby major intersection or landmark. 5) During very late hours (2-5 AM), fewer drivers may be available — consider pre-booking. If you consistently cannot find drivers, it may be a low-demand time. Email support@spinr.ca if the problem persists.',
    'rider',
    ARRAY['no driver', 'cannot find', 'no rides', 'unavailable', 'waiting', 'long wait', 'no available drivers'],
    'website_analysis'
),
(
    'App Shows Wrong Price or Fare',
    'If the app shows an incorrect fare: 1) Make sure your pickup and destination are correctly entered. 2) Check that the route shown is accurate. 3) If the charged amount after a ride differs from the estimate, go to Trip History > select the trip > "Report an Issue" > "Fare is incorrect". 4) Our team will review the trip route and fare calculation. Possible reasons for fare differences: route changes, additional stops, waiting time, or GPS errors. Contact support@spinr.ca if you need help.',
    'rider',
    ARRAY['wrong price', 'incorrect fare', 'price error', 'overcharged', 'fare different', 'billing'],
    'website_analysis'
),
(
    'Login Problems',
    'If you cannot log into your Spinr account: 1) Double-check your email/phone number and password. 2) Use "Forgot Password" to reset your password. 3) Make sure your app is updated to the latest version. 4) Check your internet connection. 5) If using social login, make sure you''re using the same method you signed up with. 6) If your account was deactivated, contact support@spinr.ca. 7) Try clearing the app cache or reinstalling. If you''re still unable to log in, email support@spinr.ca with your account email.',
    'general',
    ARRAY['login', 'can''t login', 'sign in', 'login problem', 'locked out', 'password wrong'],
    'website_analysis'
),
(
    'Map Not Loading or Showing Blank',
    'If the map is not loading in the Spinr app: 1) Check your internet connection. 2) Make sure Location Services are enabled. 3) Clear the app cache. 4) Restart the app. 5) Update to the latest app version. 6) Restart your phone. 7) Check if Google Maps / Apple Maps works independently — if not, the issue may be with your phone''s map services. 8) Reinstall the app as a last resort.',
    'general',
    ARRAY['map', 'not loading', 'blank map', 'map error', 'no map', 'map broken'],
    'website_analysis'
),
(
    'Ride Not Ending Properly',
    'If your ride did not end properly (still shows as active): 1) Contact your driver to end the trip. 2) If you can''t reach the driver, go to the active ride screen and look for an "End Trip" or "Report Issue" option. 3) Email support@spinr.ca immediately with the trip details so the fare can be corrected. A trip that runs longer than it should may result in a higher fare — contacting support will help get this corrected.',
    'rider',
    ARRAY['ride not ended', 'trip still active', 'still charging', 'didn''t end', 'ongoing trip'],
    'website_analysis'
);

INSERT INTO public.knowledge_base (title, content, category, tags, source) VALUES
(
    'Spinr Terms of Service Summary',
    'Key points from Spinr''s Terms of Service: 1) Spinr connects riders with independent driver-contractors. 2) Riders pay the driver fare plus a $1 platform fee. 3) Drivers keep 100% of fares. 4) Users must provide accurate information and maintain account security. 5) Users must comply with all applicable laws. 6) Users must treat others with respect. 7) Spinr reserves the right to suspend or terminate accounts for violations. 8) Spinr''s liability is limited — we are a platform connecting riders and drivers. Full terms available at spinr.ca/legal/terms.',
    'general',
    ARRAY['terms', 'terms of service', 'tos', 'legal', 'agreement', 'rules'],
    'website_analysis'
),
(
    'Driver Agreement Summary',
    'Key points from the Spinr Driver Agreement: 1) Drivers are independent contractors, not employees. 2) 0% commission on all fares — keep 100%. 3) Subscription required after 6-month free trial (Standard $19.99/mo or Pro $49.99/mo). 4) Weekly payouts via direct deposit (every Tuesday). 5) Drivers must maintain valid license, insurance, and vehicle inspection. 6) Spinr provides $2M commercial liability coverage during active rides. 7) Drivers must maintain professional conduct (safe service, clean vehicle, traffic laws, respect). 8) Either party can terminate the relationship at any time. Full agreement at spinr.ca/legal/driver-agreement.',
    'driver',
    ARRAY['driver agreement', 'contract', 'legal', 'terms', 'driver terms'],
    'website_analysis'
),
(
    'Rider Terms of Service Summary',
    'Key points from Spinr''s Rider Terms: 1) Riders agree to pay the fare shown plus the $1 platform fee. 2) Payment is processed automatically via the saved payment method. 3) Cancellation fees apply if cancelled more than 2 minutes after a driver accepts. 4) No-show fees apply if rider doesn''t appear within 5 minutes of driver arrival. 5) Riders must treat drivers with respect. 6) Riders are responsible for damage to vehicles. 7) Riders must be 18+ to ride alone. Full terms at spinr.ca/legal/rider-terms.',
    'rider',
    ARRAY['rider terms', 'rider agreement', 'legal', 'terms', 'rider policy'],
    'website_analysis'
),
(
    'Dispute Resolution Process',
    'If you have a dispute with Spinr: 1) First, try to resolve it through the app — go to Trip History > Report an Issue. 2) If not resolved, email support@spinr.ca with full details. 3) Our support team will investigate and respond within 48 hours. 4) If still unresolved, you may escalate to a supervisor by requesting escalation in your email. Spinr aims to resolve all disputes fairly and promptly. For legal disputes, refer to the arbitration clause in our Terms of Service.',
    'general',
    ARRAY['dispute', 'resolution', 'complaint', 'escalate', 'problem', 'legal', 'arbitration'],
    'website_analysis'
),
(
    'Limitation of Liability',
    'Spinr is a technology platform that connects riders with independent contractor drivers. Spinr is not a transportation provider. Key limitations: 1) Spinr does not guarantee availability of drivers. 2) Spinr is not responsible for the actions of independent contractor drivers. 3) Spinr''s total liability is limited. 4) Spinr is not liable for indirect, incidental, or consequential damages. 5) Insurance coverage is provided during active rides. Full details in our Terms of Service at spinr.ca/legal/terms.',
    'general',
    ARRAY['liability', 'limitation', 'responsible', 'legal', 'not responsible', 'disclaimer'],
    'website_analysis'
),
(
    'Spinr Community Guidelines',
    'All Spinr users (riders and drivers) must follow our community guidelines: 1) Treat everyone with respect and courtesy. 2) No discrimination based on race, ethnicity, gender, sexual orientation, religion, disability, or any other protected characteristic. 3) No harassment, threats, or intimidation. 4) No drug or alcohol use (zero tolerance for drivers). 5) No smoking/vaping in vehicles. 6) No physical contact beyond a handshake. 7) Respect personal property. 8) Follow all applicable laws. Violations may result in warnings, suspension, or permanent removal.',
    'general',
    ARRAY['community', 'guidelines', 'rules', 'behavior', 'conduct', 'code of conduct'],
    'website_analysis'
),
(
    'Anti-Discrimination Policy',
    'Spinr has a zero-tolerance anti-discrimination policy. Drivers must accept all riders regardless of race, color, ethnicity, national origin, religion, gender, gender identity, sexual orientation, age, disability, or any other protected characteristic. Riders must also treat drivers with equal respect. Any confirmed act of discrimination will result in account suspension or permanent removal. To report discrimination, use the in-app report feature or email support@spinr.ca with "DISCRIMINATION" in the subject line.',
    'general',
    ARRAY['discrimination', 'anti-discrimination', 'racism', 'bias', 'equal', 'human rights', 'policy'],
    'website_analysis'
),
(
    'Harassment Policy',
    'Spinr has zero tolerance for harassment of any kind. This includes: 1) Verbal harassment — offensive, threatening, or sexually suggestive comments. 2) Physical harassment — unwanted physical contact. 3) Sexual harassment — unwanted sexual advances or comments. 4) Stalking or contacting a rider/driver outside the app after a trip. If you experience harassment: end the ride immediately if safe, use the emergency button if needed, and report through the app or email support@spinr.ca. All reports are investigated.',
    'general',
    ARRAY['harassment', 'sexual harassment', 'inappropriate', 'stalking', 'unwanted contact', 'policy'],
    'website_analysis'
),
(
    'Health and Safety Practices',
    'Spinr encourages healthy and safe practices: 1) Riders and drivers should stay home if feeling unwell. 2) Keep vehicles well-ventilated. 3) Maintain vehicle cleanliness. 4) Hand sanitizer is encouraged. 5) Respect personal space. During health advisories or pandemics, additional measures may be implemented and communicated through the app. Check the app for any current health and safety guidelines.',
    'general',
    ARRAY['health', 'safety', 'covid', 'sick', 'hygiene', 'wellness', 'health practices'],
    'website_analysis'
),
(
    'Winter-Ready Pickups',
    'Spinr is designed for Saskatchewan winters. Our winter-ready features include: 1) All drivers are experienced with Saskatchewan winter driving conditions. 2) Vehicles must be maintained for cold weather operation. 3) Winter tires are strongly recommended for drivers. 4) Use the app to time your pickup so you spend minimal time outside in extreme cold. 5) Pre-book rides to guarantee availability during storms or extreme cold. Tips: dress warmly for your short wait, and look for your driver''s vehicle details in the app so you can spot them quickly.',
    'rider',
    ARRAY['winter', 'cold', 'weather', 'pickup', 'saskatchewan', 'snow', 'ice', 'cold weather'],
    'website_analysis'
),
(
    'Driving in Saskatchewan Winter Conditions',
    'Tips for Spinr drivers in winter: 1) Equip your vehicle with winter tires (strongly recommended). 2) Keep your vehicle''s fluids topped up (antifreeze, washer fluid). 3) Allow extra time between pickups for road conditions. 4) Drive according to conditions — slow down on icy/snowy roads. 5) Keep an emergency kit (blanket, flashlight, jumper cables). 6) Clear all snow/ice from your vehicle before driving. 7) Use block heater in extreme cold. Saskatchewan winters are harsh — your safety and your rider''s safety come first.',
    'driver',
    ARRAY['winter driving', 'snow', 'ice', 'cold', 'winter tips', 'saskatchewan winter', 'driving tips'],
    'website_analysis'
),
(
    'Mosaic Stadium Express Service',
    'Spinr will offer a special Mosaic Stadium Express service for Saskatchewan Roughriders games when we launch in Regina. This dedicated service will make it easy to get to and from Mosaic Stadium on game days without the hassle of parking. NOTE: This service is NOT yet available — it will launch when Spinr becomes available in Regina. Stay tuned for updates! In the meantime, Spinr is available in Saskatoon for getting to events at SaskTel Centre and other venues.',
    'rider',
    ARRAY['mosaic', 'stadium', 'roughriders', 'game day', 'football', 'events', 'regina', 'express'],
    'website_analysis'
),
(
    'Getting Rides to Events and Concerts',
    'Spinr is great for getting to and from events in Saskatoon — SaskTel Centre concerts, Roughriders watch parties, festivals, and more. Tips: 1) Pre-book your ride in advance for guaranteed pickup, especially for large events. 2) Set your pickup at a designated rideshare zone near the venue for easier meeting. 3) After events, move away from the crowd to a clear pickup spot. 4) Be patient — ride requests spike after events. 5) Remember: there is NO surge pricing with Spinr, even during high-demand event times.',
    'rider',
    ARRAY['events', 'concerts', 'sasktel centre', 'game day', 'festival', 'venue', 'ride to event'],
    'website_analysis'
),
(
    'Airport Rides in Saskatoon',
    'Spinr is available for rides to and from the Saskatoon John G. Diefenbaker International Airport (YXE). Tips for airport rides: 1) Pre-book your ride to the airport to guarantee pickup, especially for early morning flights. 2) Allow extra time for traffic and weather. 3) For pickups from the airport, request your ride after you''ve collected your luggage. 4) Set the pickup location to the designated rideshare pickup area at the airport. Pricing is the same as any other ride — no airport surcharges.',
    'rider',
    ARRAY['airport', 'yxe', 'flight', 'airport ride', 'saskatoon airport', 'travel'],
    'website_analysis'
),
(
    'Can I Use Spinr for Business Travel',
    'Yes, you can use Spinr for business travel. All rides generate receipts that can be used for expense reporting. You can access your trip history and download/email receipts from the app. The fare breakdown (driver rate + $1 platform fee) is clearly shown on each receipt. For corporate accounts or business billing, contact support@spinr.ca to discuss options.',
    'rider',
    ARRAY['business', 'corporate', 'expense', 'business travel', 'receipt', 'company'],
    'website_analysis'
),
(
    'Does Spinr Operate on Holidays',
    'Yes, Spinr operates 24/7 including all holidays — Christmas, New Year''s, Thanksgiving, Canada Day, and all other holidays. There is no surge pricing on holidays. Driver availability may vary on holidays. For guaranteed rides on holidays or special occasions, pre-book your ride in advance.',
    'general',
    ARRAY['holiday', 'christmas', 'new year', 'canada day', 'thanksgiving', 'hours', 'open'],
    'website_analysis'
),
(
    'Spinr Toll and Highway Charges',
    'Saskatchewan does not have toll roads, so toll charges do not typically apply to Spinr rides. If a ride requires travel on a toll road in another jurisdiction, the toll cost would be included in the fare. Standard Spinr rides within Saskatoon do not incur any toll charges.',
    'rider',
    ARRAY['toll', 'highway', 'toll road', 'extra charge', 'fees'],
    'website_analysis'
),
(
    'How Does Spinr Handle Complaints',
    'To file a complaint: 1) Go to Trip History in the app and select the trip. 2) Tap "Report an Issue" and describe your complaint. 3) Submit — our team will review and respond within 48 hours. You can also email support@spinr.ca directly. All complaints are taken seriously and investigated. Depending on the severity, actions may include warnings, temporary suspension, or permanent removal of the offending user. You will be notified of the outcome.',
    'general',
    ARRAY['complaint', 'report', 'issue', 'problem', 'feedback', 'unhappy', 'dissatisfied'],
    'website_analysis'
);


-- =====================================================
-- VERIFICATION
-- =====================================================
SELECT 'Knowledge base seeded with ' || COUNT(*) || ' entries!' as status
FROM public.knowledge_base
WHERE source = 'website_analysis';
