-- =====================================================
-- SPINR KNOWLEDGE BASE - SEED DATA
-- =====================================================
-- Run this in Supabase SQL Editor to populate the knowledge base
-- This data will be used by the AI agent for RAG-based responses
-- AFTER running this, run: node scripts/generate-embeddings.js
-- =====================================================

-- Clear existing entries to avoid duplicates
DELETE FROM public.knowledge_base WHERE source = 'website_analysis';

-- Insert fresh data

-- =====================================================
-- GENERAL INFORMATION
-- =====================================================

INSERT INTO public.knowledge_base (title, content, category, tags, source) VALUES
(
    'What is Spinr',
    'Spinr is Saskatchewan''s own rideshare platform, currently available ONLY in Saskatoon. We are 100% Saskatchewan owned and operated. Our core differentiator is that drivers keep 100% of net fare (0% commission forever), and riders pay just a flat $1 platform fee per trip. There is no surge pricing and no hidden charges. Regina is launching soon but is NOT yet available.',
    'general',
    ARRAY['about', 'company', 'introduction', 'what is spinr'],
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
    'Spinr Contact Information',
    'You can reach Spinr support at support@spinr.ca. Our headquarters are located in Regina, Saskatchewan (but rideshare service is NOT available in Regina yet - only Saskatoon). For immediate assistance, use the in-app chat or email us.',
    'general',
    ARRAY['contact', 'support', 'email', 'help', 'phone', 'reach'],
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
);

-- =====================================================
-- RIDER INFORMATION - GETTING STARTED
-- =====================================================

INSERT INTO public.knowledge_base (title, content, category, tags, source) VALUES
(
    'How to Get Started as a Spinr Rider',
    'To get started as a Spinr rider: 1) Download the Spinr app from the Apple App Store or Google Play Store. 2) Create your account using your phone number or email. 3) Verify your identity with a valid phone number. 4) Add a payment method (credit or debit card). 5) Set your pickup location and destination. 6) Confirm your ride and enjoy! You must be in Saskatoon to request a ride, as Spinr is currently only available in Saskatoon.',
    'rider',
    ARRAY['getting started', 'new rider', 'sign up', 'download', 'app', 'register', 'how to'],
    'website_analysis'
),
(
    'Spinr Rider App Download',
    'The Spinr rider app is available for free download on both the Apple App Store (iOS) and Google Play Store (Android). Search for "Spinr" to find and install the app. You need a smartphone with iOS 14+ or Android 8+ to use the app.',
    'rider',
    ARRAY['app', 'download', 'ios', 'android', 'install', 'phone'],
    'website_analysis'
),
(
    'How Much Does a Spinr Ride Cost',
    'With Spinr, you pay the driver''s rate plus a flat $1 platform fee. There is NO surge pricing — the price you see is the price you pay. You get upfront pricing before confirming your ride, so there are no surprises. The fare is calculated based on distance and time. Spinr does not charge surge pricing during busy times, unlike other rideshare platforms.',
    'rider',
    ARRAY['pricing', 'cost', 'fare', 'fee', 'how much', 'price', 'rate'],
    'website_analysis'
);

-- =====================================================
-- RIDER INFORMATION - BOOKING RIDES
-- =====================================================

INSERT INTO public.knowledge_base (title, content, category, tags, source) VALUES
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
    'Spinr Upfront Pricing - No Surge',
    'Spinr shows you the exact fare before you confirm your ride. There are no hidden charges or surprise fees. The price includes the driver''s rate plus a flat $1 platform fee. What you see is what you pay. Unlike Uber and Lyft, Spinr NEVER has surge pricing — the fare stays the same regardless of time, demand, or weather.',
    'rider',
    ARRAY['pricing', 'upfront', 'transparent', 'fare', 'cost', 'no surge', 'surge'],
    'website_analysis'
),
(
    'Ride Tracking and Sharing',
    'Spinr allows you to track your ride in real-time. You can see your driver''s location as they approach, track your route during the trip, and share your ride status with friends and family for added safety. To share: tap the "Share Ride" button during your trip to send a live tracking link.',
    'rider',
    ARRAY['tracking', 'real-time', 'location', 'share', 'map', 'share ride', 'live'],
    'website_analysis'
);

-- =====================================================
-- RIDER INFORMATION - CANCELLATION & NO-SHOW
-- =====================================================

INSERT INTO public.knowledge_base (title, content, category, tags, source) VALUES
(
    'Ride Cancellation Policy',
    'You can cancel a ride for free within the first 2 minutes after booking, or if your driver hasn''t arrived within the estimated time. After the free cancellation window, a cancellation fee may apply to compensate the driver for their time and fuel. The fee amount will be shown before you confirm the cancellation. To cancel: tap "Cancel Ride" in the app before your driver arrives.',
    'rider',
    ARRAY['cancel', 'cancellation', 'fee', 'policy', 'refund'],
    'website_analysis'
),
(
    'No-Show Policy for Riders',
    'If your driver arrives at the pickup location and you do not show up within 5 minutes, the ride may be cancelled and a no-show fee may be charged to your payment method. To avoid no-show fees: be ready at your pickup location, watch for your driver in the app, and communicate with your driver if you need extra time.',
    'rider',
    ARRAY['no-show', 'no show', 'missed ride', 'penalty', 'fee', 'wait time'],
    'website_analysis'
),
(
    'How to Request a Refund',
    'To request a refund for a trip: 1) Go to your trip history in the app. 2) Select the specific trip. 3) Tap "Report an Issue". 4) Choose the appropriate issue category. 5) Submit your refund request with details. Refunds are typically processed within 5-7 business days back to your original payment method. You can also contact support@spinr.ca for assistance with refund requests.',
    'rider',
    ARRAY['refund', 'payment', 'trip', 'issue', 'money back', 'dispute'],
    'website_analysis'
);

-- =====================================================
-- RIDER INFORMATION - PAYMENTS & RECEIPTS
-- =====================================================

INSERT INTO public.knowledge_base (title, content, category, tags, source) VALUES
(
    'Payment Methods Accepted by Spinr',
    'Spinr accepts all major credit and debit cards including Visa, Mastercard, and American Express. You can add multiple payment methods to your account and set a default card. Payment is processed automatically at the end of each trip. Cash payments are NOT currently accepted. You can manage your payment methods in Settings > Wallet in the app.',
    'rider',
    ARRAY['payment', 'methods', 'credit card', 'debit card', 'visa', 'mastercard', 'cash', 'wallet'],
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
    'How to Update Payment Method',
    'In the app, go to Settings > Wallet > Payment Methods to add or remove cards. You can add credit/debit cards and set a default payment method. To update: 1) Open the app. 2) Go to Settings. 3) Tap Wallet. 4) Add a new card or remove an old one. 5) Set your preferred default. Your default card will be charged automatically for each ride.',
    'rider',
    ARRAY['payment', 'wallet', 'card', 'update', 'credit card', 'debit card', 'change card'],
    'website_analysis'
),
(
    'Trip Receipts and History',
    'You can view all your past rides in the Trip History section of the app. Each trip shows the date, time, route, fare breakdown, and driver information. You can also download or email receipts for any past trip. This is useful for expense reporting or record-keeping.',
    'rider',
    ARRAY['history', 'trips', 'past rides', 'receipts', 'invoice', 'record'],
    'website_analysis'
);

-- =====================================================
-- RIDER INFORMATION - SAFETY
-- =====================================================

INSERT INTO public.knowledge_base (title, content, category, tags, source) VALUES
(
    'Rider Safety Features',
    'Spinr prioritizes rider safety with multiple features: 1) Driver identity verification — see driver name, photo, and vehicle details before pickup. 2) Real-time ride tracking — share your trip with friends/family. 3) In-app emergency button — quickly contact 911 with auto-shared location. 4) Trip recording capability. 5) Two-way rating system. 6) All drivers pass background checks and vehicle inspections. 7) SGI (Saskatchewan Government Insurance) compliance.',
    'safety',
    ARRAY['safety', 'features', 'security', 'protection', 'rider safety', 'emergency'],
    'website_analysis'
),
(
    'Safety Tips for Riders',
    'For your safety when riding with Spinr: 1) Always verify your driver''s name, photo, and license plate before getting in. 2) Use the "Share ride status" feature to let friends/family track your trip. 3) Sit in the back seat. 4) Always wear your seatbelt. 5) Keep your phone charged and accessible. 6) Trust your instincts — if something feels wrong, don''t get in the vehicle or end the ride. 7) Use the in-app emergency button if needed.',
    'safety',
    ARRAY['safety', 'tips', 'riders', 'verification', 'tracking', 'advice'],
    'website_analysis'
),
(
    'Emergency Features in Spinr App',
    'Spinr includes emergency features in the app. If you feel unsafe during a ride, you can use the in-app emergency button to quickly contact emergency services. Your location and trip details are automatically shared with emergency responders. You can also share your ride with a trusted contact who can monitor your trip in real-time.',
    'safety',
    ARRAY['emergency', 'safety', 'button', '911', 'help', 'urgent', 'panic'],
    'website_analysis'
),
(
    'SGI Safety Standards Compliance',
    'Spinr complies with Saskatchewan Government Insurance (SGI) safety standards. All drivers must pass background checks, criminal record checks, and vehicle inspections. Our safety protocols are designed to meet or exceed provincial requirements for rideshare services in Saskatchewan.',
    'safety',
    ARRAY['sgi', 'standards', 'compliance', 'saskatchewan', 'government', 'insurance', 'regulations'],
    'website_analysis'
);

-- =====================================================
-- DRIVER INFORMATION - GETTING STARTED
-- =====================================================

INSERT INTO public.knowledge_base (title, content, category, tags, source) VALUES
(
    'How to Become a Spinr Driver',
    'To become a Spinr driver: 1) Download the Spinr Driver app from the App Store or Google Play. 2) Create a driver account. 3) Submit required documents: valid Saskatchewan driver''s license, vehicle registration, proof of commercial auto insurance, and criminal record/background check. 4) Pass the vehicle inspection. 5) Complete the online onboarding and training. 6) Get approved and start accepting rides. You must be in Saskatoon to drive, as Spinr is currently only available there.',
    'driver',
    ARRAY['apply', 'become', 'driver', 'sign up', 'register', 'how to', 'start driving'],
    'website_analysis'
),
(
    'Driver Requirements and Eligibility',
    'To drive with Spinr you must: 1) Be at least 19 years old. 2) Have a valid Saskatchewan driver''s license (Class 5 or higher). 3) Have at least 1 year of driving experience. 4) Pass a criminal background check. 5) Have a vehicle that is 2015 or newer, with 4 doors, in good mechanical condition. 6) Have valid commercial auto insurance (rideshare insurance). 7) Vehicle must pass a safety inspection. 8) Be located in Saskatoon (only city currently operational).',
    'driver',
    ARRAY['requirements', 'eligibility', 'qualifications', 'license', 'age', 'documents'],
    'website_analysis'
),
(
    'Required Documents for Spinr Drivers',
    'To drive with Spinr, you need to submit: 1) Valid Saskatchewan driver''s license (Class 5 or higher). 2) Current vehicle registration in your name. 3) Proof of commercial auto insurance (standard personal insurance is NOT sufficient for rideshare). 4) Criminal record check / background check clearance. 5) Vehicle safety inspection certificate. You can upload these documents through the Spinr Driver app during onboarding.',
    'driver',
    ARRAY['documents', 'license', 'registration', 'insurance', 'background check', 'paperwork'],
    'website_analysis'
),
(
    'Vehicle Requirements for Spinr Drivers',
    'To drive with Spinr, your vehicle must: 1) Be a 2015 model year or newer. 2) Have 4 doors. 3) Be in good mechanical and cosmetic condition. 4) Pass an SGI vehicle safety inspection. 5) Have valid registration and commercial auto insurance. 6) Be clean and well-maintained for rider comfort. Motorcycles, scooters, and 2-door vehicles are not accepted.',
    'driver',
    ARRAY['vehicle', 'requirements', 'car', 'inspection', 'age', 'condition', 'make', 'model'],
    'website_analysis'
);

-- =====================================================
-- DRIVER INFORMATION - EARNINGS & PAYMENTS
-- =====================================================

INSERT INTO public.knowledge_base (title, content, category, tags, source) VALUES
(
    'Driver Earnings and Commission',
    'With Spinr, drivers keep 100% of the net fare. Spinr charges 0% commission — now and forever. This is our fundamental promise. We make money through the flat $1 fee charged to riders, not by taking from driver earnings. This means every dollar of the fare you earn is yours to keep. Compare this to other platforms that take 20-30% of your earnings.',
    'driver',
    ARRAY['earnings', 'commission', '0%', 'pay', 'money', 'income', 'zero commission'],
    'website_analysis'
),
(
    'Driver Weekly Payouts',
    'Spinr processes driver payouts every week. Your earnings are deposited directly into your bank account every Tuesday. To set up direct deposit: go to the Driver app > Settings > Bank Account and enter your banking information. Since drivers keep 100% of net fare with 0% commission, you receive all the money you''ve earned from fares.',
    'driver',
    ARRAY['payout', 'payment', 'weekly', 'tuesday', 'bank', 'deposit', 'earnings', 'direct deposit'],
    'website_analysis'
),
(
    'How Driver Fares are Calculated',
    'Driver fares on Spinr are calculated based on: 1) Base fare (starting rate). 2) Per-kilometer rate for distance driven. 3) Per-minute rate for time spent on the trip. Drivers set competitive rates and keep 100% of the fare. Riders see the upfront price and pay the fare plus a flat $1 platform fee. There is no surge pricing that would increase or decrease the fare.',
    'driver',
    ARRAY['fare', 'calculation', 'rate', 'pricing', 'how much', 'per km', 'per minute'],
    'website_analysis'
);

-- =====================================================
-- DRIVER INFORMATION - SUBSCRIPTIONS
-- =====================================================

INSERT INTO public.knowledge_base (title, content, category, tags, source) VALUES
(
    'Spinr Driver Subscription Plans',
    'Spinr offers optional subscription plans for drivers that provide additional features and benefits. These may include priority ride assignments, enhanced visibility to riders, and access to premium features. The subscription is optional — drivers can earn without a subscription. Contact support@spinr.ca for current subscription options and pricing.',
    'driver',
    ARRAY['subscription', 'plan', 'premium', 'membership', 'monthly'],
    'website_analysis'
);

-- =====================================================
-- DRIVER INFORMATION - TAX & COMPLIANCE
-- =====================================================

INSERT INTO public.knowledge_base (title, content, category, tags, source) VALUES
(
    'Driver Tax Information',
    'As a Spinr driver, you are an independent contractor, not an employee. You are responsible for: 1) Reporting your rideshare income on your tax return. 2) Keeping records of your earnings, expenses, and mileage. 3) Potentially collecting and remitting GST/HST if you earn over $30,000 per year. 4) Tracking deductible expenses such as gas, vehicle maintenance, insurance, and phone costs. Spinr provides annual earnings summaries to help with tax filing. Consult a tax professional for personalized advice.',
    'driver',
    ARRAY['tax', 'income', 'gst', 'hst', 'deductions', 'independent contractor', 'tax filing'],
    'website_analysis'
);

-- =====================================================
-- DRIVER INFORMATION - INSURANCE & VEHICLE
-- =====================================================

INSERT INTO public.knowledge_base (title, content, category, tags, source) VALUES
(
    'Driver Insurance Requirements',
    'Spinr drivers must have commercial auto insurance (rideshare insurance). Standard personal auto insurance does NOT cover rideshare driving. You need to contact your insurance provider to add rideshare coverage or get a commercial policy. SGI (Saskatchewan Government Insurance) offers rideshare endorsements. Driving without proper insurance can result in deactivation from the platform and personal liability.',
    'driver',
    ARRAY['insurance', 'coverage', 'commercial', 'sgi', 'rideshare insurance', 'policy'],
    'website_analysis'
);

-- =====================================================
-- DRIVER INFORMATION - SAFETY & OPERATIONS
-- =====================================================

INSERT INTO public.knowledge_base (title, content, category, tags, source) VALUES
(
    'Safety Tips for Spinr Drivers',
    'For driver safety: 1) Verify rider identity before starting the trip — check the rider''s name and photo. 2) Follow all traffic laws and drive defensively. 3) Keep your vehicle well-maintained and clean. 4) Use the in-app navigation for optimal routes. 5) Report any safety concerns through the app immediately. 6) Do not drive while fatigued — take breaks. 7) Keep your doors locked between rides. 8) Trust your instincts — you can decline rides if you feel unsafe.',
    'safety',
    ARRAY['safety', 'tips', 'drivers', 'verification', 'driving', 'driver safety'],
    'website_analysis'
),
(
    'Driver Support and Resources',
    'Spinr provides dedicated support for drivers. You can access driver resources, training materials, and support through the Spinr Driver app. For specific questions, contact driver support through the app or email support@spinr.ca. Support is available during business hours and response times are typically within 24 hours.',
    'driver',
    ARRAY['support', 'help', 'resources', 'training', 'driver app', 'contact'],
    'website_analysis'
);

-- =====================================================
-- SPECIAL FEATURES
-- =====================================================

INSERT INTO public.knowledge_base (title, content, category, tags, source) VALUES
(
    'Mosaic Stadium Express Service',
    'Spinr will offer a special Mosaic Stadium Express service for Saskatchewan Roughriders games when we launch in Regina. This dedicated service will make it easy to get to and from Mosaic Stadium on game days without the hassle of parking. NOTE: This service is NOT yet available — it will launch when Spinr becomes available in Regina.',
    'rider',
    ARRAY['mosaic', 'stadium', 'roughriders', 'game day', 'football', 'events', 'regina'],
    'website_analysis'
),
(
    'Winter-Ready Pickups',
    'Spinr is designed for Saskatchewan winters. Our winter-ready pickup feature helps you stay warm while waiting for your ride. Drivers are experienced with winter driving conditions and vehicles are equipped for Saskatchewan''s cold climate. During extreme cold, use the app to time your pickup so you spend minimal time outside.',
    'rider',
    ARRAY['winter', 'cold', 'weather', 'pickup', 'saskatchewan', 'snow', 'ice'],
    'website_analysis'
);

-- =====================================================
-- ACCOUNT MANAGEMENT
-- =====================================================

INSERT INTO public.knowledge_base (title, content, category, tags, source) VALUES
(
    'How to Create a Spinr Account',
    'To create a Spinr account: 1) Download the Spinr app from the App Store or Google Play. 2) Open the app and tap "Sign Up". 3) Enter your phone number and verify with the SMS code sent to you. 4) Add your name and email address. 5) Create a password. 6) Add a payment method (credit or debit card). You''re ready to ride! You must be in Saskatoon to request rides.',
    'rider',
    ARRAY['account', 'create', 'sign up', 'register', 'new user', 'new account'],
    'website_analysis'
),
(
    'How to Delete Your Spinr Account',
    'To delete your Spinr account: 1) Go to Settings > Account > Delete Account in the app. 2) Confirm the deletion. You can also email support@spinr.ca with your account deletion request. Please note that account deletion is permanent and cannot be undone. Any remaining balance or pending trips will need to be resolved first.',
    'general',
    ARRAY['account', 'delete', 'remove', 'close account', 'deactivate'],
    'website_analysis'
),
(
    'How to Update Profile Information',
    'To update your profile in the Spinr app: 1) Open the app. 2) Go to Settings > Profile. 3) Update your name, email, phone number, or profile photo. 4) Save changes. For security-sensitive changes like phone number, you may need to re-verify your identity.',
    'general',
    ARRAY['profile', 'update', 'edit', 'change', 'name', 'email', 'photo'],
    'website_analysis'
);

-- =====================================================
-- APP FEATURES & RATINGS
-- =====================================================

INSERT INTO public.knowledge_base (title, content, category, tags, source) VALUES
(
    'Rate Your Driver or Rider',
    'After each ride, both riders and drivers can rate each other on a 5-star scale and leave optional feedback. This helps maintain quality service and allows Spinr to recognize excellent drivers. Low-rated users may receive warnings or be removed from the platform. Please rate honestly to help improve the community.',
    'rider',
    ARRAY['rating', 'feedback', 'driver', 'review', 'stars', 'rate'],
    'website_analysis'
),
(
    'Lost Items During a Ride',
    'If you left an item in your Spinr ride: 1) Go to Trip History in the app. 2) Select the relevant trip. 3) Tap "Lost Item" to contact your driver directly. 4) Arrange a pickup if the driver has your item. If you cannot reach the driver, email support@spinr.ca with your trip details and a description of the lost item.',
    'rider',
    ARRAY['lost', 'item', 'forgot', 'left behind', 'found', 'belongings'],
    'website_analysis'
);

-- =====================================================
-- COMPARISONS & DIFFERENTIATORS
-- =====================================================

INSERT INTO public.knowledge_base (title, content, category, tags, source) VALUES
(
    'Spinr vs Other Rideshare Services',
    'Spinr differs from other rideshare services like Uber and Lyft in several key ways: 1) 0% commission for drivers — they keep 100% of the fare (Uber/Lyft take 20-30%). 2) Flat $1 platform fee for riders — no surge pricing ever. 3) 100% Saskatchewan owned and operated — supporting local business. 4) Local support team based in Saskatchewan. 5) Community-focused approach. 6) Full SGI compliance for Saskatchewan safety standards. 7) Designed specifically for Saskatchewan conditions including winter.',
    'general',
    ARRAY['comparison', 'uber', 'lyft', 'difference', 'better', 'alternative', 'vs'],
    'website_analysis'
),
(
    'Why Choose Spinr Over Uber or Lyft',
    'Choose Spinr because: 1) You support a local Saskatchewan business — 100% Saskatchewan owned. 2) Drivers earn more with 0% commission. 3) Riders pay less with just a $1 flat fee and no surge pricing. 4) Local customer support that understands Saskatchewan. 5) Community-focused features like Mosaic Stadium Express (coming to Regina). 6) Commitment to safety with SGI compliance. 7) All money stays in Saskatchewan — supporting the local economy.',
    'general',
    ARRAY['why', 'choose', 'benefits', 'advantages', 'local', 'uber', 'lyft'],
    'website_analysis'
);

-- =====================================================
-- TROUBLESHOOTING
-- =====================================================

INSERT INTO public.knowledge_base (title, content, category, tags, source) VALUES
(
    'App Not Working or Crashing',
    'If the Spinr app is not working: 1) Make sure you have the latest version installed — check the App Store or Google Play for updates. 2) Restart the app completely (close and reopen). 3) Check your internet connection. 4) Restart your phone. 5) Uninstall and reinstall the app. 6) Make sure your phone OS is up to date. If the problem persists, contact support@spinr.ca with your device model and OS version.',
    'general',
    ARRAY['app', 'not working', 'crash', 'bug', 'error', 'fix', 'troubleshoot'],
    'website_analysis'
),
(
    'Cannot Find a Driver',
    'If you cannot find a driver: 1) Make sure you are in Saskatoon — Spinr is only available in Saskatoon currently. 2) Try again in a few minutes — driver availability varies. 3) Check that your pickup location is accessible and correct. 4) Try adjusting your pickup location to a nearby major intersection or landmark. If you consistently cannot find drivers, it may be a low-demand time. Consider pre-booking for guaranteed availability.',
    'rider',
    ARRAY['no driver', 'cannot find', 'no rides', 'unavailable', 'waiting', 'long wait'],
    'website_analysis'
),
(
    'Payment Failed or Declined',
    'If your payment fails: 1) Check that your card details are correct in Settings > Wallet. 2) Make sure your card has sufficient funds. 3) Try a different payment method. 4) Check if your bank is blocking the transaction — some banks flag rideshare charges. 5) Contact your bank to authorize the transaction. If issues persist, email support@spinr.ca for help.',
    'rider',
    ARRAY['payment', 'failed', 'declined', 'error', 'card', 'transaction', 'not working'],
    'website_analysis'
);

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

SELECT 'Knowledge base seeded with ' || COUNT(*) || ' entries!' as status
FROM public.knowledge_base
WHERE source = 'website_analysis';