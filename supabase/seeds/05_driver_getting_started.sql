-- =====================================================
-- SPINR KNOWLEDGE BASE SEED - PART 5: DRIVER GETTING STARTED
-- =====================================================
-- Driver onboarding, requirements, documents, vehicle, background check
-- =====================================================

INSERT INTO public.knowledge_base (title, content, category, tags, source) VALUES

-- ===================== HOW TO APPLY =====================
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

-- ===================== DRIVER REQUIREMENTS =====================
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

-- ===================== REQUIRED DOCUMENTS =====================
(
    'Required Documents for Spinr Drivers',
    'To drive with Spinr, you need to submit: 1) Valid Saskatchewan driver''s license (Class 5 or higher). 2) Current vehicle registration in your name. 3) Proof of commercial auto insurance with rideshare endorsement (standard personal insurance is NOT sufficient). 4) RCMP criminal record check clearance. 5) Vulnerable sector check clearance. 6) Vehicle safety inspection certificate from an SGI-approved facility. Upload all documents through the Spinr Driver app during onboarding.',
    'driver',
    ARRAY['documents', 'license', 'registration', 'insurance', 'background check', 'paperwork', 'required'],
    'website_analysis'
),

-- ===================== VEHICLE REQUIREMENTS =====================
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

-- ===================== INSURANCE =====================
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

-- ===================== BACKGROUND CHECK =====================
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

SELECT 'Part 5: Driver Getting Started inserted' as status;
