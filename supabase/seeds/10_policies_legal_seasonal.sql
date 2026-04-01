-- =====================================================
-- SPINR KNOWLEDGE BASE SEED - PART 10: POLICIES, LEGAL & SEASONAL
-- =====================================================
-- Terms, privacy, community guidelines, anti-discrimination, winter, events
-- =====================================================

INSERT INTO public.knowledge_base (title, content, category, tags, source) VALUES

-- ===================== TERMS & LEGAL =====================
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

-- ===================== COMMUNITY GUIDELINES =====================
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

-- ===================== SEASONAL & EVENTS =====================
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

-- ===================== MISCELLANEOUS FAQ =====================
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

SELECT 'Part 10: Policies, Legal & Seasonal inserted' as status;
