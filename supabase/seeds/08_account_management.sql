-- =====================================================
-- SPINR KNOWLEDGE BASE SEED - PART 8: ACCOUNT MANAGEMENT
-- =====================================================
-- Account creation, profile, deletion, privacy, data, security
-- =====================================================

INSERT INTO public.knowledge_base (title, content, category, tags, source) VALUES

-- ===================== ACCOUNT CREATION & PROFILE =====================
(
    'How to Create a Spinr Account',
    'To create a Spinr account: 1) Download the Spinr app from the App Store or Google Play. 2) Open the app and tap "Sign Up". 3) Enter your phone number and verify with the SMS code. 4) Add your name and email address. 5) Create a password. 6) Add a payment method (credit or debit card). You''re ready to ride! For drivers, download the Spinr Driver app instead and follow the driver-specific signup process.',
    'rider',
    ARRAY['account', 'create', 'sign up', 'register', 'new user', 'new account'],
    'website_analysis'
),
(
    'How to Update Profile Information',
    'To update your profile in the Spinr app: 1) Open the app. 2) Go to Settings > Profile. 3) Update your name, email, or profile photo. 4) Save changes. For security-sensitive changes like phone number or email, you may need to re-verify your identity via SMS or email code. Profile changes take effect immediately.',
    'general',
    ARRAY['profile', 'update', 'edit', 'change', 'name', 'email', 'photo'],
    'website_analysis'
),
(
    'How to Change Your Phone Number',
    'To change your phone number on Spinr: 1) Open the app. 2) Go to Settings > Profile > Phone Number. 3) Enter your new phone number. 4) Verify the new number with the SMS code sent to it. 5) Your account will be updated with the new number. You must have access to the new phone number to complete verification. If you no longer have access to your old number and cannot log in, email support@spinr.ca for assistance.',
    'general',
    ARRAY['phone number', 'change phone', 'update phone', 'new phone', 'mobile number'],
    'website_analysis'
),
(
    'How to Reset Your Password',
    'To reset your Spinr password: 1) On the login screen, tap "Forgot Password". 2) Enter the email address or phone number associated with your account. 3) Check your email/phone for a reset code. 4) Enter the code and create a new password. 5) Log in with your new password. If you don''t receive the reset code, check your spam folder. If you still can''t reset, email support@spinr.ca for help.',
    'general',
    ARRAY['password', 'reset', 'forgot password', 'change password', 'login problem', 'can''t login'],
    'website_analysis'
),
(
    'Two-Factor Authentication',
    'Spinr supports two-factor authentication (2FA) for added account security. When enabled, you''ll need to enter a verification code (sent via SMS) in addition to your password when logging in from a new device. To enable 2FA: Go to Settings > Security > Two-Factor Authentication > Enable. We recommend enabling 2FA to protect your account from unauthorized access.',
    'general',
    ARRAY['two-factor', '2fa', 'security', 'authentication', 'verification', 'mfa'],
    'website_analysis'
),
(
    'Protect Your Personal Information',
    'To keep your Spinr account secure: 1) Use a strong, unique password. 2) Enable two-factor authentication. 3) Never share your login credentials. 4) Log out on shared devices. 5) Keep your app updated to the latest version. 6) Be cautious of phishing emails/messages — Spinr will never ask for your password via email. 7) Review your trip history regularly for unauthorized activity. If you suspect unauthorized access, change your password immediately and contact support@spinr.ca.',
    'general',
    ARRAY['security', 'protect', 'personal info', 'privacy', 'safe', 'hack', 'phishing'],
    'website_analysis'
),

-- ===================== ACCOUNT DELETION =====================
(
    'How to Delete Your Spinr Account',
    'To delete your Spinr account: Option 1 — In-app: Go to Settings > Account > Delete Account > Confirm. Deletion is immediate. Option 2 — Email: Send a request to support@spinr.ca (processed within 7 business days). Before deleting: 1) Resolve any pending trips or payments. 2) Download any receipts you need. 3) Note that deletion is PERMANENT and cannot be undone. After deletion: all personal data is removed, active rides are cancelled, and you will no longer be able to access your account.',
    'general',
    ARRAY['account', 'delete', 'remove', 'close account', 'deactivate', 'delete account'],
    'website_analysis'
),
(
    'What Happens After Account Deletion',
    'After you delete your Spinr account: 1) All personal data is permanently removed from our systems. 2) Trip history and receipts are deleted. 3) Any active rides are automatically cancelled. 4) Pending refunds must be resolved before deletion. 5) You will be logged out of all devices. 6) You cannot recover the account. 7) If you want to use Spinr again, you would need to create a completely new account. In-app deletion is immediate; email requests take up to 7 business days.',
    'general',
    ARRAY['after deletion', 'data removed', 'permanent', 'recover account', 'deleted data'],
    'website_analysis'
),

-- ===================== PRIVACY & DATA =====================
(
    'Spinr Privacy Policy Summary',
    'Spinr collects the following information: 1) Account info — name, email, phone, profile photo. 2) Payment details — credit card info (processed securely, not stored in full). 3) Location data — GPS during active rides for navigation and safety. 4) Trip history — pickup/dropoff locations, routes, fares. How we use your data: to facilitate rides, process payments, improve our services, communicate with you, and ensure safety. We do NOT sell your personal data to third parties.',
    'general',
    ARRAY['privacy', 'data', 'personal information', 'privacy policy', 'data collection'],
    'website_analysis'
),
(
    'Does Spinr Sell My Data',
    'NO. Spinr does NOT sell your personal data to third parties. Your information is only shared with: 1) Your driver/rider during an active trip (limited to name, photo, and location needed for the ride). 2) Payment processors to handle transactions. 3) Emergency services if you use the emergency button. 4) As required by law (e.g., court orders). We take your privacy seriously and use industry-standard security measures to protect your data.',
    'general',
    ARRAY['sell data', 'third party', 'data sharing', 'privacy', 'personal data', 'information sharing'],
    'website_analysis'
),
(
    'Your Data Rights',
    'As a Spinr user, you have the right to: 1) Access your data — view what information we have about you. 2) Correct your data — update inaccurate information. 3) Delete your data — request account deletion and data removal. 4) Opt out of marketing — unsubscribe from promotional emails. 5) Data portability — request a copy of your data. To exercise any of these rights, go to Settings > Privacy in the app or email support@spinr.ca.',
    'general',
    ARRAY['data rights', 'access data', 'delete data', 'opt out', 'gdpr', 'privacy rights'],
    'website_analysis'
),
(
    'Location Data and GPS Tracking',
    'Spinr collects location data during active rides for: 1) Navigation — guiding drivers to pickup and destination. 2) Safety — tracking the ride route in real-time. 3) Fare calculation — determining distance traveled. 4) Emergency — sharing your location with 911 if needed. Location tracking is ONLY active during rides (from booking to dropoff). Spinr does not continuously track your location when you are not using the app. You can review your location permissions in your phone settings.',
    'general',
    ARRAY['location', 'gps', 'tracking', 'location data', 'privacy', 'surveillance'],
    'website_analysis'
);

SELECT 'Part 8: Account Management inserted' as status;
