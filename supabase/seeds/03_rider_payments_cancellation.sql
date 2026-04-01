-- =====================================================
-- SPINR KNOWLEDGE BASE SEED - PART 3: RIDER PAYMENTS & CANCELLATION
-- =====================================================
-- Payment methods, tipping, promo codes, receipts, cancellation, refunds
-- =====================================================

INSERT INTO public.knowledge_base (title, content, category, tags, source) VALUES

-- ===================== PAYMENTS =====================
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

-- ===================== TIPPING =====================
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

-- ===================== PROMO CODES =====================
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

-- ===================== FARE DISPUTES =====================
(
    'Wrong Charge or Fare Dispute',
    'If you believe you were overcharged or the fare is incorrect: 1) Go to Trip History in the app. 2) Select the trip in question. 3) Tap "Report an Issue" or "Dispute Fare". 4) Describe the problem (e.g., wrong route, incorrect fare, double charge). 5) Submit your dispute. Our team will review and respond within 48 hours. Common reasons for fare adjustments include: route detours, GPS errors, or trip not ending properly. You can also email support@spinr.ca with your trip details.',
    'rider',
    ARRAY['wrong charge', 'overcharged', 'dispute', 'fare dispute', 'incorrect fare', 'billing error'],
    'website_analysis'
),

-- ===================== CANCELLATION =====================
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

-- ===================== REFUNDS =====================
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

-- ===================== CLEANING & DAMAGE FEES =====================
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

-- ===================== LOST ITEMS =====================
(
    'Lost Items During a Ride',
    'If you left an item in your Spinr ride: 1) Go to Trip History in the app. 2) Select the relevant trip. 3) Tap "Lost Item" to contact your driver directly. 4) Arrange a pickup if the driver has your item. A small return fee may apply to compensate the driver for their time. If you cannot reach the driver, email support@spinr.ca with your trip details and a description of the lost item. Act quickly — the sooner you report it, the better the chance of recovery.',
    'rider',
    ARRAY['lost', 'item', 'forgot', 'left behind', 'found', 'belongings', 'lost and found'],
    'website_analysis'
);

SELECT 'Part 3: Rider Payments & Cancellation inserted' as status;
