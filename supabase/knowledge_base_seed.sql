-- =====================================================
-- SPINR KNOWLEDGE BASE - SEED DATA
-- =====================================================
-- Run this in Supabase SQL Editor to populate the knowledge base
-- This data will be used by the AI agent for RAG-based responses
-- =====================================================

-- Clear existing entries (optional - remove if you want to keep existing data)
-- DELETE FROM public.knowledge_base WHERE source = 'website_analysis';

-- =====================================================
-- GENERAL INFORMATION
-- =====================================================

INSERT INTO public.knowledge_base (title, content, category, tags, source) VALUES
(
    'What is Spinr',
    'Spinr is Saskatchewan''s own rideshare platform — a Regina-based startup redefining urban mobility. We are 100% Saskatchewan owned and operated. Our core differentiator is that drivers keep 100% of net fare (0% commission forever), and riders pay just a flat $1 platform fee per trip. There is no surge pricing and no hidden charges.',
    'general',
    ARRAY['about', 'company', 'introduction', 'what is spinr'],
    'website_analysis'
),
(
    'Where Spinr Operates',
    'Spinr currently serves two Saskatchewan cities: Regina (our headquarters city) and Saskatoon. We plan to expand to more Saskatchewan communities soon. We integrate with local services like SGI (Saskatchewan Government Insurance) for safety standards.',
    'general',
    ARRAY['location', 'cities', 'availability', 'regina', 'saskatoon', 'saskatchewan'],
    'website_analysis'
),
(
    'Spinr Contact Information',
    'You can reach Spinr support at support@spinr.ca. Our headquarters are located in Regina, Saskatchewan. For immediate assistance, use the in-app chat or email us.',
    'general',
    ARRAY['contact', 'support', 'email', 'help'],
    'website_analysis'
);

-- =====================================================
-- RIDER INFORMATION
-- =====================================================

INSERT INTO public.knowledge_base (title, content, category, tags, source) VALUES
(
    'How Much Does a Spinr Ride Cost',
    'With Spinr, you pay the driver''s rate plus a flat $1 platform fee. There is no surge pricing — the price you see is the price you pay. You get upfront pricing before confirming your ride, so there are no surprises. The fare is calculated based on distance and time.',
    'rider',
    ARRAY['pricing', 'cost', 'fare', 'fee', 'how much', 'price'],
    'website_analysis'
),
(
    'How to Book a Spinr Ride',
    'To book a ride with Spinr: 1) Download the Spinr app from the App Store or Google Play. 2) Create an account or sign in. 3) Enter your pickup location and destination. 4) Review the upfront pricing. 5) Confirm your ride. You can also pre-book rides up to 7 days in advance.',
    'rider',
    ARRAY['booking', 'ride', 'how to', 'book', 'request'],
    'website_analysis'
),
(
    'Spinr Pre-Booking Feature',
    'Spinr allows you to pre-book rides up to 7 days in advance. This is perfect for airport trips, appointments, or any planned travel. Simply select your preferred pickup time when booking, and your driver will be there on schedule.',
    'rider',
    ARRAY['pre-book', 'schedule', 'advance', 'booking', 'appointment'],
    'website_analysis'
),
(
    'Spinr Upfront Pricing',
    'Spinr shows you the exact fare before you confirm your ride. There are no hidden charges or surprise fees. The price includes the driver''s rate plus a flat $1 platform fee. What you see is what you pay.',
    'rider',
    ARRAY['pricing', 'upfront', 'transparent', 'fare', 'cost'],
    'website_analysis'
),
(
    'How to Request a Refund',
    'To request a refund for a trip, go to your trip history in the app, select the trip, and tap "Report an Issue" to request a refund. Refunds are typically processed within 5-7 business days. You can also contact support@spinr.ca for assistance.',
    'rider',
    ARRAY['refund', 'payment', 'trip', 'issue', 'money back'],
    'website_analysis'
),
(
    'How to Update Payment Method',
    'In the app menu, go to Wallet > Payment Methods to add or remove cards. You can add credit/debit cards and set a default payment method. Spinr accepts all major credit and debit cards.',
    'rider',
    ARRAY['payment', 'wallet', 'card', 'update', 'credit card', 'debit card'],
    'website_analysis'
),
(
    'Mosaic Stadium Express Service',
    'Spinr offers a special Mosaic Stadium Express service for Saskatchewan Roughriders games. This dedicated service makes it easy to get to and from Mosaic Stadium on game days without the hassle of parking.',
    'rider',
    ARRAY['mosaic', 'stadium', 'roughriders', 'game day', 'football', 'events'],
    'website_analysis'
),
(
    'Winter-Ready Pickups',
    'Spinr is designed for Saskatchewan winters. Our winter-ready pickup feature helps you stay warm while waiting for your ride. Drivers are trained for winter driving conditions and vehicles are equipped for Saskatchewan''s cold climate.',
    'rider',
    ARRAY['winter', 'cold', 'weather', 'pickup', 'saskatchewan'],
    'website_analysis'
);

-- =====================================================
-- DRIVER INFORMATION
-- =====================================================

INSERT INTO public.knowledge_base (title, content, category, tags, source) VALUES
(
    'Driver Earnings and Commission',
    'With Spinr, drivers keep 100% of the fare. Spinr charges 0% commission — now and forever. We make money through the flat $1 fee charged to riders, not by taking from your earnings. This means every dollar you earn is yours to keep.',
    'driver',
    ARRAY['earnings', 'commission', '0%', 'pay', 'money', 'income'],
    'website_analysis'
),
(
    'How to Become a Spinr Driver',
    'To become a Spinr driver: 1) Download the Spinr Driver app. 2) Create an account and submit required documents (valid driver''s license, vehicle registration, proof of insurance, background check clearance). 3) Complete the onboarding process. 4) Start accepting rides and earning money.',
    'driver',
    ARRAY['apply', 'become', 'driver', 'sign up', 'register', 'how to'],
    'website_analysis'
),
(
    'Vehicle Requirements for Drivers',
    'To drive with Spinr, you need a 2015 or newer vehicle with 4 doors, in good condition with valid insurance. The vehicle must pass a safety inspection. Your car should be clean and well-maintained to provide the best experience for riders.',
    'driver',
    ARRAY['vehicle', 'requirements', 'car', 'inspection', 'age', 'condition'],
    'website_analysis'
),
(
    'Required Documents for Drivers',
    'To drive with Spinr, you need: Valid driver''s license, vehicle registration, proof of insurance, and a background check clearance. All documents must be current and valid. You can upload these documents through the Spinr Driver app during onboarding.',
    'driver',
    ARRAY['documents', 'license', 'registration', 'insurance', 'background check'],
    'website_analysis'
),
(
    'Driver Weekly Payouts',
    'Spinr processes driver payouts every week. Your earnings are deposited directly into your bank account every Tuesday. Since drivers keep 100% of net fare with 0% commission, you receive all the money you''ve earned.',
    'driver',
    ARRAY['payout', 'payment', 'weekly', 'tuesday', 'bank', 'deposit', 'earnings'],
    'website_analysis'
),
(
    'Driver Support and Resources',
    'Spinr provides dedicated support for drivers. You can access driver resources, training materials, and support through the Spinr Driver app. For specific questions, contact driver support through the app or email support@spinr.ca.',
    'driver',
    ARRAY['support', 'help', 'resources', 'training', 'driver app'],
    'website_analysis'
);

-- =====================================================
-- SAFETY INFORMATION
-- =====================================================

INSERT INTO public.knowledge_base (title, content, category, tags, source) VALUES
(
    'Spinr Safety Features',
    'Spinr prioritizes safety with multiple features: SGI-compliant safety standards, driver background checks, vehicle inspections, real-time ride tracking, and an in-app emergency button. We follow Saskatchewan Government Insurance (SGI) guidelines to ensure rider and driver safety.',
    'safety',
    ARRAY['safety', 'features', 'sgi', 'security', 'protection'],
    'website_analysis'
),
(
    'Safety Tips for Riders',
    'For your safety when riding with Spinr: 1) Always verify your driver''s name, photo, and license plate before getting in. 2) Use the "Share ride status" feature to let friends track your trip. 3) Sit in the back seat and always wear your seatbelt. 4) Keep your phone charged and accessible. 5) Trust your instincts — if something feels wrong, end the ride.',
    'safety',
    ARRAY['safety', 'tips', 'riders', 'verification', 'tracking'],
    'website_analysis'
),
(
    'Safety Tips for Drivers',
    'For driver safety: 1) Verify rider identity before starting the trip. 2) Follow all traffic laws and drive defensively. 3) Keep your vehicle well-maintained. 4) Use the in-app navigation for the safest route. 5) Report any safety concerns through the app immediately.',
    'safety',
    ARRAY['safety', 'tips', 'drivers', 'verification', 'driving'],
    'website_analysis'
),
(
    'Emergency Features',
    'Spinr includes emergency features in the app. If you feel unsafe during a ride, you can use the in-app emergency button to quickly contact emergency services. Your location and trip details are automatically shared with emergency responders.',
    'safety',
    ARRAY['emergency', 'safety', 'button', '911', 'help', 'urgent'],
    'website_analysis'
),
(
    'SGI Safety Standards Compliance',
    'Spinr complies with Saskatchewan Government Insurance (SGI) safety standards. All drivers must pass background checks and vehicle inspections. Our safety protocols are designed to meet or exceed provincial requirements for rideshare services.',
    'safety',
    ARRAY['sgi', 'standards', 'compliance', 'saskatchewan', 'government', 'insurance'],
    'website_analysis'
);

-- =====================================================
-- PAYMENT INFORMATION
-- =====================================================

INSERT INTO public.knowledge_base (title, content, category, tags, source) VALUES
(
    'Payment Methods Accepted',
    'Spinr accepts all major credit and debit cards. You can add multiple payment methods to your account and set a default card. Payment is processed automatically at the end of each trip. You can manage your payment methods in the Wallet section of the app.',
    'rider',
    ARRAY['payment', 'methods', 'credit card', 'debit card', 'visa', 'mastercard'],
    'website_analysis'
),
(
    'How Payment Works',
    'When you complete a ride, payment is automatically charged to your default payment method. You receive a receipt via email showing the fare breakdown: driver''s rate + $1 platform fee. There are no surge charges or hidden fees. You can view all your trip receipts in the app.',
    'rider',
    ARRAY['payment', 'how it works', 'receipt', 'automatic', 'charge'],
    'website_analysis'
);

-- =====================================================
-- ACCOUNT INFORMATION
-- =====================================================

INSERT INTO public.knowledge_base (title, content, category, tags, source) VALUES
(
    'How to Create a Spinr Account',
    'To create a Spinr account: 1) Download the Spinr app from the App Store or Google Play. 2) Open the app and tap "Sign Up". 3) Enter your phone number and verify with the code sent to you. 4) Add your email and create a password. 5) Add a payment method. You''re ready to ride!',
    'rider',
    ARRAY['account', 'create', 'sign up', 'register', 'new user'],
    'website_analysis'
),
(
    'How to Delete Your Account',
    'To delete your Spinr account, go to Settings > Account > Delete Account in the app. You can also email support@spinr.ca with your account deletion request. Please note that account deletion is permanent and cannot be undone.',
    'general',
    ARRAY['account', 'delete', 'remove', 'close account'],
    'website_analysis'
);

-- =====================================================
-- APP FEATURES
-- =====================================================

INSERT INTO public.knowledge_base (title, content, category, tags, source) VALUES
(
    'Ride Tracking Feature',
    'Spinr allows you to track your ride in real-time. You can see your driver''s location as they approach, track your route during the trip, and share your ride status with friends and family for added safety.',
    'rider',
    ARRAY['tracking', 'real-time', 'location', 'share', 'map'],
    'website_analysis'
),
(
    'Trip History',
    'You can view all your past rides in the Trip History section of the app. Each trip shows the date, time, route, fare, and driver information. You can also request receipts and report issues for any past trip.',
    'rider',
    ARRAY['history', 'trips', 'past rides', 'receipts'],
    'website_analysis'
),
(
    'Rate Your Driver',
    'After each ride, you can rate your driver and leave feedback. This helps maintain quality service and allows Spinr to recognize excellent drivers. Drivers can also rate riders to help maintain a respectful community.',
    'rider',
    ARRAY['rating', 'feedback', 'driver', 'review', 'stars'],
    'website_analysis'
);

-- =====================================================
-- COMPARISONS & DIFFERENTIATORS
-- =====================================================

INSERT INTO public.knowledge_base (title, content, category, tags, source) VALUES
(
    'Spinr vs Other Rideshare Services',
    'Spinr differs from other rideshare services in several key ways: 1) 0% commission for drivers (they keep 100% of fare). 2) Flat $1 platform fee for riders (no surge pricing). 3) 100% Saskatchewan owned and operated. 4) Local support team. 5) Community-focused approach. 6) SGI compliance for Saskatchewan safety standards.',
    'general',
    ARRAY['comparison', 'uber', 'lyft', 'difference', 'better', 'alternative'],
    'website_analysis'
),
(
    'Why Choose Spinr',
    'Choose Spinr because: 1) You support a local Saskatchewan business. 2) Drivers earn more with 0% commission. 3) Riders pay less with just a $1 flat fee and no surge pricing. 4) Local customer support that understands Saskatchewan. 5) Community-focused features like Mosaic Stadium Express. 6) Commitment to safety with SGI compliance.',
    'general',
    ARRAY['why', 'choose', 'benefits', 'advantages', 'local'],
    'website_analysis'
);

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

SELECT 'Knowledge base seeded with ' || COUNT(*) || ' entries!' as status
FROM public.knowledge_base
WHERE source = 'website_analysis';