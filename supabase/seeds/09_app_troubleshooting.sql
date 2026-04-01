-- =====================================================
-- SPINR KNOWLEDGE BASE SEED - PART 9: APP & TROUBLESHOOTING
-- =====================================================
-- App features, download, updates, GPS issues, crashes, common problems
-- =====================================================

INSERT INTO public.knowledge_base (title, content, category, tags, source) VALUES

-- ===================== APP BASICS =====================
(
    'How to Download the Spinr App',
    'The Spinr app is available on both platforms: 1) iPhone/iPad — search "Spinr" in the Apple App Store and tap Download. 2) Android — search "Spinr" in the Google Play Store and tap Install. The rider app and driver app are SEPARATE apps. Download "Spinr" for riding and "Spinr Driver" for driving. Both apps are free to download. You need iOS 14+ or Android 8+ to run the app.',
    'general',
    ARRAY['download', 'app', 'install', 'ios', 'android', 'app store', 'google play', 'phone'],
    'website_analysis'
),
(
    'How to Update the Spinr App',
    'To update the Spinr app: 1) Open the App Store (iPhone) or Google Play Store (Android). 2) Search for "Spinr". 3) If an update is available, tap "Update". 4) Wait for the download and installation. You can also enable automatic updates in your phone settings. We recommend always using the latest version for the best experience, latest features, and security patches. Outdated versions may have issues connecting to our servers.',
    'general',
    ARRAY['update', 'app update', 'latest version', 'upgrade', 'new version'],
    'website_analysis'
),
(
    'App Permissions Explained',
    'Spinr requires certain permissions to function properly: 1) Location — needed to find your pickup location and track rides (required). 2) Notifications — to alert you about ride updates, driver arrival, and promotions (recommended). 3) Camera — for profile photo upload (optional). 4) Phone — for in-app calling to drivers (recommended). You can manage permissions in your phone''s Settings > Apps > Spinr. Location permission must be set to "While Using App" at minimum.',
    'general',
    ARRAY['permissions', 'location permission', 'notifications', 'camera', 'app settings'],
    'website_analysis'
),
(
    'Managing Notifications',
    'To manage Spinr notifications: 1) In-app: Go to Settings > Notifications to toggle ride updates, promotions, and driver alerts. 2) Phone settings: Go to Settings > Apps > Spinr > Notifications to control system-level notifications. We recommend keeping ride update notifications ON so you know when your driver is arriving. Marketing/promotional notifications can be turned off if desired.',
    'general',
    ARRAY['notifications', 'alerts', 'push notifications', 'turn off', 'manage notifications'],
    'website_analysis'
),

-- ===================== TROUBLESHOOTING =====================
(
    'App Not Working or Crashing',
    'If the Spinr app is not working: 1) Make sure you have the latest version — check the App Store or Google Play for updates. 2) Restart the app completely (close and reopen). 3) Check your internet connection (Wi-Fi or cellular data). 4) Restart your phone. 5) Clear the app cache (Android: Settings > Apps > Spinr > Clear Cache). 6) Uninstall and reinstall the app. 7) Make sure your phone OS is up to date. If the problem persists, email support@spinr.ca with your device model, OS version, and a description of the issue.',
    'general',
    ARRAY['app', 'not working', 'crash', 'bug', 'error', 'fix', 'troubleshoot', 'broken', 'frozen'],
    'website_analysis'
),
(
    'GPS and Location Issues',
    'If the app can''t find your location or GPS is inaccurate: 1) Make sure Location Services are enabled for Spinr (Settings > Privacy > Location Services > Spinr > "While Using"). 2) Step outside — GPS works best outdoors with a clear sky view. 3) Toggle Location Services off and on. 4) Restart the app. 5) Restart your phone. 6) Check that your phone''s date/time are set to automatic. 7) If indoors, move near a window. You can also manually adjust your pickup pin on the map.',
    'general',
    ARRAY['gps', 'location', 'gps issues', 'location wrong', 'can''t find location', 'map', 'pin'],
    'website_analysis'
),
(
    'Cannot Find a Driver',
    'If you cannot find a driver: 1) Make sure you are in Saskatoon — Spinr is ONLY available in Saskatoon currently. 2) Try again in a few minutes — driver availability varies by time. 3) Check that your pickup location is accessible and correct on the map. 4) Try adjusting your pickup to a nearby major intersection or landmark. 5) During very late hours (2-5 AM), fewer drivers may be available — consider pre-booking. If you consistently cannot find drivers, it may be a low-demand time. Email support@spinr.ca if the problem persists.',
    'rider',
    ARRAY['no driver', 'cannot find', 'no rides', 'unavailable', 'waiting', 'long wait', 'no available drivers'],
    'website_analysis'
),
(
    'App Shows Wrong Price or Fare',
    'If the app shows an incorrect fare: 1) Make sure your pickup and destination are correctly entered. 2) Check that the route shown is accurate. 3) If the charged amount after a ride differs from the estimate, go to Trip History > select the trip > "Report an Issue" > "Fare is incorrect". 4) Our team will review the trip route and fare calculation. Possible reasons for fare differences: route changes, additional stops, waiting time, or GPS errors. Contact support@spinr.ca if you need help.',
    'rider',
    ARRAY['wrong price', 'incorrect fare', 'price error', 'overcharged', 'fare different', 'billing'],
    'website_analysis'
),
(
    'Login Problems',
    'If you cannot log into your Spinr account: 1) Double-check your email/phone number and password. 2) Use "Forgot Password" to reset your password. 3) Make sure your app is updated to the latest version. 4) Check your internet connection. 5) If using social login, make sure you''re using the same method you signed up with. 6) If your account was deactivated, contact support@spinr.ca. 7) Try clearing the app cache or reinstalling. If you''re still unable to log in, email support@spinr.ca with your account email.',
    'general',
    ARRAY['login', 'can''t login', 'sign in', 'login problem', 'locked out', 'password wrong'],
    'website_analysis'
),
(
    'Map Not Loading or Showing Blank',
    'If the map is not loading in the Spinr app: 1) Check your internet connection. 2) Make sure Location Services are enabled. 3) Clear the app cache. 4) Restart the app. 5) Update to the latest app version. 6) Restart your phone. 7) Check if Google Maps / Apple Maps works independently — if not, the issue may be with your phone''s map services. 8) Reinstall the app as a last resort.',
    'general',
    ARRAY['map', 'not loading', 'blank map', 'map error', 'no map', 'map broken'],
    'website_analysis'
),
(
    'Ride Not Ending Properly',
    'If your ride did not end properly (still shows as active): 1) Contact your driver to end the trip. 2) If you can''t reach the driver, go to the active ride screen and look for an "End Trip" or "Report Issue" option. 3) Email support@spinr.ca immediately with the trip details so the fare can be corrected. A trip that runs longer than it should may result in a higher fare — contacting support will help get this corrected.',
    'rider',
    ARRAY['ride not ended', 'trip still active', 'still charging', 'didn''t end', 'ongoing trip'],
    'website_analysis'
);

SELECT 'Part 9: App & Troubleshooting inserted' as status;
