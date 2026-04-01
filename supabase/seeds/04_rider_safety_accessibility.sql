-- =====================================================
-- SPINR KNOWLEDGE BASE SEED - PART 4: RIDER SAFETY & ACCESSIBILITY
-- =====================================================
-- Safety features, emergency, accessibility, pets, service animals
-- =====================================================

INSERT INTO public.knowledge_base (title, content, category, tags, source) VALUES

-- ===================== RIDER SAFETY =====================
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

-- ===================== RATINGS =====================
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

-- ===================== ACCESSIBILITY =====================
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

-- ===================== BEHAVIOR POLICIES =====================
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

SELECT 'Part 4: Rider Safety & Accessibility inserted' as status;
