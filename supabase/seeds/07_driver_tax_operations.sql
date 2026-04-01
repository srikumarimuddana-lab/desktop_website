-- =====================================================
-- SPINR KNOWLEDGE BASE SEED - PART 7: DRIVER TAX & OPERATIONS
-- =====================================================
-- Tax obligations, independent contractor, ratings, deactivation, operations
-- =====================================================

INSERT INTO public.knowledge_base (title, content, category, tags, source) VALUES

-- ===================== TAX INFORMATION =====================
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

-- ===================== DRIVER OPERATIONS =====================
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

-- ===================== DRIVER RATINGS =====================
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

SELECT 'Part 7: Driver Tax & Operations inserted' as status;
