-- =====================================================
-- SPINR KNOWLEDGE BASE SEED - PART 2: RIDER GETTING STARTED & BOOKING
-- =====================================================
-- Rider onboarding, booking, scheduling, pricing, ride types
-- =====================================================

DELETE FROM public.knowledge_base WHERE source = 'website_analysis' AND category = 'rider' AND tags && ARRAY['getting started', 'booking', 'pricing', 'how to', 'schedule', 'pre-book', 'ride type'];

INSERT INTO public.knowledge_base (title, content, category, tags, source) VALUES

-- ===================== GETTING STARTED =====================
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

-- ===================== BOOKING RIDES =====================
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

-- ===================== PRICING =====================
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

SELECT 'Part 2: Rider Getting Started & Booking - ' || COUNT(*) || ' entries inserted' as status
FROM public.knowledge_base WHERE source = 'website_analysis' AND category = 'rider';
