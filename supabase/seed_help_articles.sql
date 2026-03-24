-- ============================================================================
-- HELP ARTICLES SEED DATA (FULL SET)
-- Run this SQL in your Supabase SQL Editor
-- ============================================================================

INSERT INTO help_articles (slug, title, category_id, category_title, content, is_popular, order_index, created_at, updated_at)
VALUES

-- RIDING WITH SPINR
(
  'how-to-request-ride',
  'How to request a ride',
  'riding',
  'Riding with Spinr',
  '<h2>Requesting a ride with Spinr</h2><p>Getting a ride with Spinr is quick and easy. Follow these simple steps:</p><h3>Step 1: Open the Spinr app</h3><p>Launch the Spinr app on your phone. Make sure you''re logged into your account.</p><h3>Step 2: Enter your destination</h3><p>Tap "Where to?" and enter your destination address. You can search by address, business name, or saved locations.</p><h3>Step 3: Choose your ride type</h3><p>Select from available ride options. You''ll see the estimated fare and arrival time for each option.</p><h3>Step 4: Confirm your pickup location</h3><p>Make sure your pickup pin is in the right spot. You can adjust it by dragging the map.</p><h3>Step 5: Request your ride</h3><p>Tap "Request Spinr" to confirm. You''ll be matched with a nearby driver.</p><h3>Track your driver</h3><p>Watch your driver approach in real-time on the map. You''ll get notifications when they''re nearby.</p>',
  true,
  1,
  NOW(),
  NOW()
),
(
  'payment-methods',
  'Adding and managing payment methods',
  'riding',
  'Riding with Spinr',
  '<h2>Managing your payment methods</h2><p>Spinr makes it easy to add and manage your payment options.</p><h3>Adding a new payment method</h3><ol><li>Open the Spinr app and tap on your profile icon</li><li>Select "Wallet" or "Payment"</li><li>Tap "Add payment method"</li><li>Choose from credit/debit card, or other available options</li><li>Enter your payment details and save</li></ol><h3>Accepted payment methods</h3><ul><li>Visa, Mastercard, American Express</li><li>Prepaid cards</li><li>Apple Pay and Google Pay (where available)</li></ul><h3>Changing your default payment method</h3><p>Tap on any saved payment method and select "Set as default" to use it for all future rides.</p><h3>Removing a payment method</h3><p>Swipe left on any payment method to reveal the delete option, or tap to edit and select remove.</p>',
  true,
  2,
  NOW(),
  NOW()
),
(
  'lost-items',
  'Lost and found for riders',
  'riding',
  'Riding with Spinr',
  '<h2>Left something behind?</h2><p>We know how stressful it can be to lose something. Here''s how to get your items back.</p><h3>Contact your driver</h3><ol><li>Open the Spinr app</li><li>Go to "Your Trips" or "Ride History"</li><li>Select the trip where you left your item</li><li>Tap "I lost an item"</li><li>Follow the prompts to contact your driver</li></ol><h3>What happens next?</h3><p>If your driver finds your item, you can arrange a mutually convenient time and place to pick it up. A small return fee may apply.</p><h3>Tips for getting your items back</h3><ul><li>Act quickly - contact your driver as soon as possible</li><li>Be specific about what you lost and where in the car it might be</li><li>Be flexible with pickup arrangements</li></ul><h3>If you can''t reach your driver</h3><p>Contact Spinr support at <a href="mailto:support@spinr.ca">support@spinr.ca</a> and we''ll help coordinate.</p>',
  true,
  3,
  NOW(),
  NOW()
),
(
  'cancel-ride',
  'How to cancel a ride',
  'riding',
  'Riding with Spinr',
  '<h2>We''re here to help</h2><p>This article is coming soon. In the meantime, please contact our support team for assistance.</p><p>Email us at <a href="mailto:support@spinr.ca">support@spinr.ca</a> and we''ll be happy to help you with any questions.</p>',
  false,
  4,
  NOW(),
  NOW()
),
(
  'ride-receipt',
  'Getting your ride receipt',
  'riding',
  'Riding with Spinr',
  '<h2>We''re here to help</h2><p>This article is coming soon. In the meantime, please contact our support team for assistance.</p><p>Email us at <a href="mailto:support@spinr.ca">support@spinr.ca</a> and we''ll be happy to help you with any questions.</p>',
  false,
  5,
  NOW(),
  NOW()
),
(
  'fare-estimate',
  'Understanding fare estimates',
  'riding',
  'Riding with Spinr',
  '<h2>We''re here to help</h2><p>This article is coming soon. In the meantime, please contact our support team for assistance.</p><p>Email us at <a href="mailto:support@spinr.ca">support@spinr.ca</a> and we''ll be happy to help you with any questions.</p>',
  false,
  6,
  NOW(),
  NOW()
),
(
  'promo-codes',
  'Using promo codes',
  'riding',
  'Riding with Spinr',
  '<h2>We''re here to help</h2><p>This article is coming soon. In the meantime, please contact our support team for assistance.</p><p>Email us at <a href="mailto:support@spinr.ca">support@spinr.ca</a> and we''ll be happy to help you with any questions.</p>',
  false,
  7,
  NOW(),
  NOW()
),
(
  'share-ride-status',
  'Share your ride status with friends',
  'riding',
  'Riding with Spinr',
  '<h2>We''re here to help</h2><p>This article is coming soon. In the meantime, please contact our support team for assistance.</p><p>Email us at <a href="mailto:support@spinr.ca">support@spinr.ca</a> and we''ll be happy to help you with any questions.</p>',
  false,
  8,
  NOW(),
  NOW()
),
(
  'schedule-ride',
  'Scheduling a ride in advance',
  'riding',
  'Riding with Spinr',
  '<h2>We''re here to help</h2><p>This article is coming soon. In the meantime, please contact our support team for assistance.</p><p>Email us at <a href="mailto:support@spinr.ca">support@spinr.ca</a> and we''ll be happy to help you with any questions.</p>',
  false,
  9,
  NOW(),
  NOW()
),
(
  'wheelchair-access',
  'Wheelchair accessible rides',
  'riding',
  'Riding with Spinr',
  '<h2>We''re here to help</h2><p>This article is coming soon. In the meantime, please contact our support team for assistance.</p><p>Email us at <a href="mailto:support@spinr.ca">support@spinr.ca</a> and we''ll be happy to help you with any questions.</p>',
  false,
  10,
  NOW(),
  NOW()
),

-- DRIVING WITH SPINR
(
  'driver-earnings',
  'How and when driver pay is calculated',
  'driving',
  'Driving with Spinr',
  '<h2>Understanding your earnings</h2><p>Your earnings are calculated based on several factors for each ride.</p><h3>How earnings are calculated</h3><p>For each ride, you earn:</p><ul><li><strong>Base fare:</strong> A set amount for accepting the ride</li><li><strong>Distance:</strong> Amount per kilometer driven</li><li><strong>Time:</strong> Amount per minute of the trip</li><li><strong>Tips:</strong> 100% of tips go directly to you</li></ul><h3>When you get paid</h3><p>Earnings are deposited directly to your bank account every week on Tuesday. The pay period runs Monday to Sunday.</p><h3>Viewing your earnings</h3><p>Open the Driver app and tap on "Earnings" to see your daily, weekly, and trip-by-trip breakdown.</p><h3>Bonuses and incentives</h3><p>You may qualify for additional bonuses during peak hours or for completing a certain number of rides.</p>',
  true,
  11,
  NOW(),
  NOW()
),
(
  'vehicle-requirements',
  'Vehicle requirements',
  'driving',
  'Driving with Spinr',
  '<h2>We''re here to help</h2><p>This article is coming soon. In the meantime, please contact our support team for assistance.</p><p>Email us at <a href="mailto:support@spinr.ca">support@spinr.ca</a> and we''ll be happy to help you with any questions.</p>',
  false,
  12,
  NOW(),
  NOW()
),
(
  'weekly-payouts',
  'Weekly payouts and direct deposit',
  'driving',
  'Driving with Spinr',
  '<h2>We''re here to help</h2><p>This article is coming soon. In the meantime, please contact our support team for assistance.</p><p>Email us at <a href="mailto:support@spinr.ca">support@spinr.ca</a> and we''ll be happy to help you with any questions.</p>',
  false,
  13,
  NOW(),
  NOW()
),
(
  'driver-bonuses',
  'Bonuses and incentives',
  'driving',
  'Driving with Spinr',
  '<h2>We''re here to help</h2><p>This article is coming soon. In the meantime, please contact our support team for assistance.</p><p>Email us at <a href="mailto:support@spinr.ca">support@spinr.ca</a> and we''ll be happy to help you with any questions.</p>',
  false,
  14,
  NOW(),
  NOW()
),
(
  'driver-ratings',
  'Understanding your driver rating',
  'driving',
  'Driving with Spinr',
  '<h2>We''re here to help</h2><p>This article is coming soon. In the meantime, please contact our support team for assistance.</p><p>Email us at <a href="mailto:support@spinr.ca">support@spinr.ca</a> and we''ll be happy to help you with any questions.</p>',
  false,
  15,
  NOW(),
  NOW()
),
(
  'driver-app-guide',
  'Using the Spinr Driver app',
  'driving',
  'Driving with Spinr',
  '<h2>We''re here to help</h2><p>This article is coming soon. In the meantime, please contact our support team for assistance.</p><p>Email us at <a href="mailto:support@spinr.ca">support@spinr.ca</a> and we''ll be happy to help you with any questions.</p>',
  false,
  16,
  NOW(),
  NOW()
),
(
  'insurance-coverage',
  'Insurance coverage while driving',
  'driving',
  'Driving with Spinr',
  '<h2>We''re here to help</h2><p>This article is coming soon. In the meantime, please contact our support team for assistance.</p><p>Email us at <a href="mailto:support@spinr.ca">support@spinr.ca</a> and we''ll be happy to help you with any questions.</p>',
  false,
  17,
  NOW(),
  NOW()
),
(
  'tax-documents',
  'Tax documents and 1099s',
  'driving',
  'Driving with Spinr',
  '<h2>We''re here to help</h2><p>This article is coming soon. In the meantime, please contact our support team for assistance.</p><p>Email us at <a href="mailto:support@spinr.ca">support@spinr.ca</a> and we''ll be happy to help you with any questions.</p>',
  false,
  18,
  NOW(),
  NOW()
),

-- APPLYING TO DRIVE
(
  'how-to-apply',
  'How to apply to become a driver',
  'applying',
  'Applying to Drive',
  '<h2>We''re here to help</h2><p>This article is coming soon. In the meantime, please contact our support team for assistance.</p><p>Email us at <a href="mailto:support@spinr.ca">support@spinr.ca</a> and we''ll be happy to help you with any questions.</p>',
  false,
  19,
  NOW(),
  NOW()
),
(
  'required-documents',
  'Required documents',
  'applying',
  'Applying to Drive',
  '<h2>We''re here to help</h2><p>This article is coming soon. In the meantime, please contact our support team for assistance.</p><p>Email us at <a href="mailto:support@spinr.ca">support@spinr.ca</a> and we''ll be happy to help you with any questions.</p>',
  false,
  20,
  NOW(),
  NOW()
),
(
  'background-check',
  'Background check process',
  'applying',
  'Applying to Drive',
  '<h2>We''re here to help</h2><p>This article is coming soon. In the meantime, please contact our support team for assistance.</p><p>Email us at <a href="mailto:support@spinr.ca">support@spinr.ca</a> and we''ll be happy to help you with any questions.</p>',
  false,
  21,
  NOW(),
  NOW()
),
(
  'application-status',
  'Check your application status',
  'applying',
  'Applying to Drive',
  '<h2>We''re here to help</h2><p>This article is coming soon. In the meantime, please contact our support team for assistance.</p><p>Email us at <a href="mailto:support@spinr.ca">support@spinr.ca</a> and we''ll be happy to help you with any questions.</p>',
  false,
  22,
  NOW(),
  NOW()
),
(
  'vehicle-inspection',
  'Vehicle inspection requirements',
  'applying',
  'Applying to Drive',
  '<h2>We''re here to help</h2><p>This article is coming soon. In the meantime, please contact our support team for assistance.</p><p>Email us at <a href="mailto:support@spinr.ca">support@spinr.ca</a> and we''ll be happy to help you with any questions.</p>',
  false,
  23,
  NOW(),
  NOW()
),
(
  'driver-license-requirements',
  'Driver''s license requirements',
  'applying',
  'Applying to Drive',
  '<h2>We''re here to help</h2><p>This article is coming soon. In the meantime, please contact our support team for assistance.</p><p>Email us at <a href="mailto:support@spinr.ca">support@spinr.ca</a> and we''ll be happy to help you with any questions.</p>',
  false,
  24,
  NOW(),
  NOW()
),

-- PROFILE & ACCOUNT
(
  'create-account',
  'How to create a Spinr account',
  'account',
  'Profile & Account',
  '<h2>We''re here to help</h2><p>This article is coming soon. In the meantime, please contact our support team for assistance.</p><p>Email us at <a href="mailto:support@spinr.ca">support@spinr.ca</a> and we''ll be happy to help you with any questions.</p>',
  false,
  25,
  NOW(),
  NOW()
),
(
  'update-account',
  'Update your account information',
  'account',
  'Profile & Account',
  '<h2>We''re here to help</h2><p>This article is coming soon. In the meantime, please contact our support team for assistance.</p><p>Email us at <a href="mailto:support@spinr.ca">support@spinr.ca</a> and we''ll be happy to help you with any questions.</p>',
  false,
  26,
  NOW(),
  NOW()
),
(
  'delete-account',
  'Delete my account',
  'account',
  'Profile & Account',
  '<h2>We''re here to help</h2><p>This article is coming soon. In the meantime, please contact our support team for assistance.</p><p>Email us at <a href="mailto:support@spinr.ca">support@spinr.ca</a> and we''ll be happy to help you with any questions.</p>',
  false,
  27,
  NOW(),
  NOW()
),
(
  'change-phone-number',
  'Change your phone number',
  'account',
  'Profile & Account',
  '<h2>We''re here to help</h2><p>This article is coming soon. In the meantime, please contact our support team for assistance.</p><p>Email us at <a href="mailto:support@spinr.ca">support@spinr.ca</a> and we''ll be happy to help you with any questions.</p>',
  false,
  28,
  NOW(),
  NOW()
),
(
  'reset-password',
  'Reset your password',
  'account',
  'Profile & Account',
  '<h2>We''re here to help</h2><p>This article is coming soon. In the meantime, please contact our support team for assistance.</p><p>Email us at <a href="mailto:support@spinr.ca">support@spinr.ca</a> and we''ll be happy to help you with any questions.</p>',
  false,
  29,
  NOW(),
  NOW()
),
(
  'protect-personal-info',
  'Protect your personal information',
  'account',
  'Profile & Account',
  '<h2>We''re here to help</h2><p>This article is coming soon. In the meantime, please contact our support team for assistance.</p><p>Email us at <a href="mailto:support@spinr.ca">support@spinr.ca</a> and we''ll be happy to help you with any questions.</p>',
  false,
  30,
  NOW(),
  NOW()
),
(
  'two-factor-auth',
  'Two-factor authentication',
  'account',
  'Profile & Account',
  '<h2>We''re here to help</h2><p>This article is coming soon. In the meantime, please contact our support team for assistance.</p><p>Email us at <a href="mailto:support@spinr.ca">support@spinr.ca</a> and we''ll be happy to help you with any questions.</p>',
  false,
  31,
  NOW(),
  NOW()
),

-- USING THE APP
(
  'download-app',
  'Download the Spinr app',
  'app',
  'Using the App',
  '<h2>We''re here to help</h2><p>This article is coming soon. In the meantime, please contact our support team for assistance.</p><p>Email us at <a href="mailto:support@spinr.ca">support@spinr.ca</a> and we''ll be happy to help you with any questions.</p>',
  false,
  32,
  NOW(),
  NOW()
),
(
  'update-app',
  'How to update your app',
  'app',
  'Using the App',
  '<h2>We''re here to help</h2><p>This article is coming soon. In the meantime, please contact our support team for assistance.</p><p>Email us at <a href="mailto:support@spinr.ca">support@spinr.ca</a> and we''ll be happy to help you with any questions.</p>',
  false,
  33,
  NOW(),
  NOW()
),
(
  'app-permissions',
  'App permissions and settings',
  'app',
  'Using the App',
  '<h2>We''re here to help</h2><p>This article is coming soon. In the meantime, please contact our support team for assistance.</p><p>Email us at <a href="mailto:support@spinr.ca">support@spinr.ca</a> and we''ll be happy to help you with any questions.</p>',
  false,
  34,
  NOW(),
  NOW()
),
(
  'gps-issues',
  'Fixing GPS and location issues',
  'app',
  'Using the App',
  '<h2>We''re here to help</h2><p>This article is coming soon. In the meantime, please contact our support team for assistance.</p><p>Email us at <a href="mailto:support@spinr.ca">support@spinr.ca</a> and we''ll be happy to help you with any questions.</p>',
  false,
  35,
  NOW(),
  NOW()
),
(
  'app-crashes',
  'App crashes and freezing',
  'app',
  'Using the App',
  '<h2>We''re here to help</h2><p>This article is coming soon. In the meantime, please contact our support team for assistance.</p><p>Email us at <a href="mailto:support@spinr.ca">support@spinr.ca</a> and we''ll be happy to help you with any questions.</p>',
  false,
  36,
  NOW(),
  NOW()
),
(
  'notifications',
  'Managing notifications',
  'app',
  'Using the App',
  '<h2>We''re here to help</h2><p>This article is coming soon. In the meantime, please contact our support team for assistance.</p><p>Email us at <a href="mailto:support@spinr.ca">support@spinr.ca</a> and we''ll be happy to help you with any questions.</p>',
  false,
  37,
  NOW(),
  NOW()
),

-- SAFETY & POLICIES
(
  'safety-guidelines',
  'Safety guidelines and policies',
  'safety',
  'Safety & Policies',
  '<h2>Your safety is our priority</h2><p>At Spinr, we''re committed to keeping both riders and drivers safe.</p><h3>For Riders</h3><ul><li><strong>Verify your ride:</strong> Always confirm the driver''s name, photo, and license plate before getting in</li><li><strong>Share your trip:</strong> Use the "Share ride status" feature to let friends and family track your trip</li><li><strong>Sit in the back:</strong> For added safety, we recommend sitting in the back seat</li><li><strong>Wear your seatbelt:</strong> Always buckle up for every ride</li></ul><h3>For Drivers</h3><ul><li><strong>Follow traffic laws:</strong> Always obey speed limits and traffic signals</li><li><strong>Keep your vehicle clean:</strong> A clean car provides a better experience</li><li><strong>Stay alert:</strong> Never drive while fatigued or under the influence</li><li><strong>Be respectful:</strong> Treat every rider with courtesy and respect</li></ul><h3>In case of emergency</h3><p>Use the in-app emergency button to quickly contact local authorities. Your location will be shared automatically.</p><h3>Report concerns</h3><p>If you ever feel unsafe, report the incident through the app or contact us at <a href="mailto:support@spinr.ca">support@spinr.ca</a>.</p>',
  true,
  38,
  NOW(),
  NOW()
),
(
  'report-incident',
  'Report a safety incident',
  'safety',
  'Safety & Policies',
  '<h2>We''re here to help</h2><p>This article is coming soon. In the meantime, please contact our support team for assistance.</p><p>Email us at <a href="mailto:support@spinr.ca">support@spinr.ca</a> and we''ll be happy to help you with any questions.</p>',
  false,
  39,
  NOW(),
  NOW()
),
(
  'service-animal-policy',
  'Service animal policy',
  'safety',
  'Safety & Policies',
  '<h2>We''re here to help</h2><p>This article is coming soon. In the meantime, please contact our support team for assistance.</p><p>Email us at <a href="mailto:support@spinr.ca">support@spinr.ca</a> and we''ll be happy to help you with any questions.</p>',
  false,
  40,
  NOW(),
  NOW()
),
(
  'community-guidelines',
  'Community guidelines',
  'safety',
  'Safety & Policies',
  '<h2>We''re here to help</h2><p>This article is coming soon. In the meantime, please contact our support team for assistance.</p><p>Email us at <a href="mailto:support@spinr.ca">support@spinr.ca</a> and we''ll be happy to help you with any questions.</p>',
  false,
  41,
  NOW(),
  NOW()
),
(
  'accessibility-features',
  'Accessibility features',
  'safety',
  'Safety & Policies',
  '<h2>We''re here to help</h2><p>This article is coming soon. In the meantime, please contact our support team for assistance.</p><p>Email us at <a href="mailto:support@spinr.ca">support@spinr.ca</a> and we''ll be happy to help you with any questions.</p>',
  false,
  42,
  NOW(),
  NOW()
),
(
  'anti-discrimination',
  'Anti-discrimination policy',
  'safety',
  'Safety & Policies',
  '<h2>We''re here to help</h2><p>This article is coming soon. In the meantime, please contact our support team for assistance.</p><p>Email us at <a href="mailto:support@spinr.ca">support@spinr.ca</a> and we''ll be happy to help you with any questions.</p>',
  false,
  43,
  NOW(),
  NOW()
),
(
  'covid-safety',
  'Health and safety practices',
  'safety',
  'Safety & Policies',
  '<h2>We''re here to help</h2><p>This article is coming soon. In the meantime, please contact our support team for assistance.</p><p>Email us at <a href="mailto:support@spinr.ca">support@spinr.ca</a> and we''ll be happy to help you with any questions.</p>',
  false,
  44,
  NOW(),
  NOW()
),
(
  'emergency-assistance',
  'Emergency assistance',
  'safety',
  'Safety & Policies',
  '<h2>We''re here to help</h2><p>This article is coming soon. In the meantime, please contact our support team for assistance.</p><p>Email us at <a href="mailto:support@spinr.ca">support@spinr.ca</a> and we''ll be happy to help you with any questions.</p>',
  false,
  45,
  NOW(),
  NOW()
)

ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  category_id = EXCLUDED.category_id,
  category_title = EXCLUDED.category_title,
  is_popular = EXCLUDED.is_popular,
  order_index = EXCLUDED.order_index,
  updated_at = NOW();
