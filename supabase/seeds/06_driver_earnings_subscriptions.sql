-- =====================================================
-- SPINR KNOWLEDGE BASE SEED - PART 6: DRIVER EARNINGS & SUBSCRIPTIONS
-- =====================================================
-- Commission, subscription plans, payouts, fare calc, tips, bonuses
-- =====================================================

INSERT INTO public.knowledge_base (title, content, category, tags, source) VALUES

-- ===================== EARNINGS & COMMISSION =====================
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

-- ===================== SUBSCRIPTION PLANS =====================
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

-- ===================== PAYOUTS =====================
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

-- ===================== TIPS =====================
(
    'How Tips Work for Drivers',
    'Riders can tip you through the Spinr app after their ride. You receive 100% of all tips — Spinr does NOT take any cut. Tips are included in your weekly payout. You can view your tip earnings in the Driver app under Earnings. Tips are separate from fares and are not affected by your subscription plan. Being friendly, safe, and keeping a clean vehicle are great ways to earn more tips.',
    'driver',
    ARRAY['tips', 'tipping', 'gratuity', 'tip earnings', '100% tips'],
    'website_analysis'
),

-- ===================== BONUSES & INCENTIVES =====================
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

SELECT 'Part 6: Driver Earnings & Subscriptions inserted' as status;
