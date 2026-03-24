// Help Center Topics and Articles Data
// Comprehensive help content for Spinr rideshare platform

import {
    Car,
    Wallet,
    User,
    Shield,
    Smartphone,
    FileText,
    HelpCircle,
    CreditCard,
    MapPin,
    Clock,
    Star,
    Bell,
    Lock,
    MessageCircle,
    Headphones,
    Settings,
    DollarSign,
    CheckCircle,
    AlertTriangle,
    Heart,
    Accessibility,
    Scale,
} from 'lucide-react'

// Main Help Categories
export const HELP_CATEGORIES = [
    {
        id: 'riding',
        title: 'Riding with Spinr',
        description: 'Request rides, payments, trip issues, and lost items',
        icon: Car,
        slug: 'riding-with-spinr',
        color: 'bg-red-50 text-red-600',
        articles: [
            { id: 'how-to-request-ride', title: 'How to request a ride', slug: 'how-to-request-ride', popular: true },
            { id: 'payment-methods', title: 'Adding and managing payment methods', slug: 'payment-methods', popular: true },
            { id: 'lost-items', title: 'Lost and found for riders', slug: 'lost-items', popular: true },
            { id: 'cancel-ride', title: 'How to cancel a ride', slug: 'cancel-ride' },
            { id: 'ride-receipt', title: 'Getting your ride receipt', slug: 'ride-receipt' },
            { id: 'fare-estimate', title: 'Understanding fare estimates', slug: 'fare-estimate' },
            { id: 'promo-codes', title: 'Using promo codes', slug: 'promo-codes' },
            { id: 'share-ride-status', title: 'Share your ride status with friends', slug: 'share-ride-status' },
            { id: 'schedule-ride', title: 'Scheduling a ride in advance', slug: 'schedule-ride' },
            { id: 'wheelchair-access', title: 'Wheelchair accessible rides', slug: 'wheelchair-access' },
        ],
    },
    {
        id: 'driving',
        title: 'Driving with Spinr',
        description: 'Earnings, vehicle requirements, and driver support',
        icon: Car,
        slug: 'driving-with-spinr',
        color: 'bg-blue-50 text-blue-600',
        articles: [
            { id: 'driver-earnings', title: 'How and when driver pay is calculated', slug: 'driver-earnings', popular: true },
            { id: 'vehicle-requirements', title: 'Vehicle requirements', slug: 'vehicle-requirements' },
            { id: 'weekly-payouts', title: 'Weekly payouts and direct deposit', slug: 'weekly-payouts' },
            { id: 'driver-bonuses', title: 'Bonuses and incentives', slug: 'driver-bonuses' },
            { id: 'driver-ratings', title: 'Understanding your driver rating', slug: 'driver-ratings' },
            { id: 'driver-app-guide', title: 'Using the Spinr Driver app', slug: 'driver-app-guide' },
            { id: 'insurance-coverage', title: 'Insurance coverage while driving', slug: 'insurance-coverage' },
            { id: 'tax-documents', title: 'Tax documents and 1099s', slug: 'tax-documents' },
        ],
    },
    {
        id: 'applying',
        title: 'Applying to Drive',
        description: 'Application process, required documents, and approval',
        icon: FileText,
        slug: 'applying-to-drive',
        color: 'bg-green-50 text-green-600',
        articles: [
            { id: 'how-to-apply', title: 'How to apply to become a driver', slug: 'how-to-apply' },
            { id: 'required-documents', title: 'Required documents', slug: 'required-documents' },
            { id: 'background-check', title: 'Background check process', slug: 'background-check' },
            { id: 'application-status', title: 'Check your application status', slug: 'application-status' },
            { id: 'vehicle-inspection', title: 'Vehicle inspection requirements', slug: 'vehicle-inspection' },
            { id: 'driver-license-requirements', title: "Driver's license requirements", slug: 'driver-license-requirements' },
        ],
    },
    {
        id: 'account',
        title: 'Profile & Account',
        description: 'Account settings, payments, and personal information',
        icon: User,
        slug: 'profile-and-account',
        color: 'bg-purple-50 text-purple-600',
        articles: [
            { id: 'create-account', title: 'How to create a Spinr account', slug: 'create-account' },
            { id: 'update-account', title: 'Update your account information', slug: 'update-account' },
            { id: 'delete-account', title: 'Delete my account', slug: 'delete-account' },
            { id: 'change-phone-number', title: 'Change your phone number', slug: 'change-phone-number' },
            { id: 'reset-password', title: 'Reset your password', slug: 'reset-password' },
            { id: 'protect-personal-info', title: 'Protect your personal information', slug: 'protect-personal-info' },
            { id: 'two-factor-auth', title: 'Two-factor authentication', slug: 'two-factor-auth' },
        ],
    },
    {
        id: 'app',
        title: 'Using the App',
        description: 'App basics, troubleshooting, and settings',
        icon: Smartphone,
        slug: 'using-the-app',
        color: 'bg-orange-50 text-orange-600',
        articles: [
            { id: 'download-app', title: 'Download the Spinr app', slug: 'download-app' },
            { id: 'update-app', title: 'How to update your app', slug: 'update-app' },
            { id: 'app-permissions', title: 'App permissions and settings', slug: 'app-permissions' },
            { id: 'gps-issues', title: 'Fixing GPS and location issues', slug: 'gps-issues' },
            { id: 'app-crashes', title: 'App crashes and freezing', slug: 'app-crashes' },
            { id: 'notifications', title: 'Managing notifications', slug: 'notifications' },
        ],
    },
    {
        id: 'safety',
        title: 'Safety & Policies',
        description: 'Safety guidelines, policies, and accessibility',
        icon: Shield,
        slug: 'safety-policies-accessibility',
        color: 'bg-teal-50 text-teal-600',
        articles: [
            { id: 'safety-guidelines', title: 'Safety guidelines and policies', slug: 'safety-guidelines', popular: true },
            { id: 'report-incident', title: 'Report a safety incident', slug: 'report-incident' },
            { id: 'service-animal-policy', title: 'Service animal policy', slug: 'service-animal-policy' },
            { id: 'community-guidelines', title: 'Community guidelines', slug: 'community-guidelines' },
            { id: 'accessibility-features', title: 'Accessibility features', slug: 'accessibility-features' },
            { id: 'anti-discrimination', title: 'Anti-discrimination policy', slug: 'anti-discrimination' },
            { id: 'covid-safety', title: 'Health and safety practices', slug: 'covid-safety' },
            { id: 'emergency-assistance', title: 'Emergency assistance', slug: 'emergency-assistance' },
        ],
    },
]

// Popular articles for quick access
export const POPULAR_ARTICLES = HELP_CATEGORIES.flatMap((cat) =>
    cat.articles
        .filter((a) => a.popular)
        .map((a) => ({
            ...a,
            categoryId: cat.id,
            categoryTitle: cat.title,
            categorySlug: cat.slug,
            icon: cat.icon,
        }))
)

// Full article content (can be expanded or moved to database later)
export const ARTICLE_CONTENT = {
    'how-to-request-ride': {
        title: 'How to request a ride',
        category: 'riding',
        content: `
      <h2>Requesting a ride with Spinr</h2>
      <p>Getting a ride with Spinr is quick and easy. Follow these simple steps:</p>
      
      <h3>Step 1: Open the Spinr app</h3>
      <p>Launch the Spinr app on your phone. Make sure you're logged into your account.</p>
      
      <h3>Step 2: Enter your destination</h3>
      <p>Tap "Where to?" and enter your destination address. You can search by address, business name, or saved locations.</p>
      
      <h3>Step 3: Choose your ride type</h3>
      <p>Select from available ride options. You'll see the estimated fare and arrival time for each option.</p>
      
      <h3>Step 4: Confirm your pickup location</h3>
      <p>Make sure your pickup pin is in the right spot. You can adjust it by dragging the map.</p>
      
      <h3>Step 5: Request your ride</h3>
      <p>Tap "Request Spinr" to confirm. You'll be matched with a nearby driver.</p>
      
      <h3>Track your driver</h3>
      <p>Watch your driver approach in real-time on the map. You'll get notifications when they're nearby.</p>
    `,
        relatedArticles: ['payment-methods', 'cancel-ride', 'share-ride-status'],
    },
    'payment-methods': {
        title: 'Adding and managing payment methods',
        category: 'riding',
        content: `
      <h2>Managing your payment methods</h2>
      <p>Spinr makes it easy to add and manage your payment options.</p>
      
      <h3>Adding a new payment method</h3>
      <ol>
        <li>Open the Spinr app and tap on your profile icon</li>
        <li>Select "Wallet" or "Payment"</li>
        <li>Tap "Add payment method"</li>
        <li>Choose from credit/debit card, or other available options</li>
        <li>Enter your payment details and save</li>
      </ol>
      
      <h3>Accepted payment methods</h3>
      <ul>
        <li>Visa, Mastercard, American Express</li>
        <li>Prepaid cards</li>
        <li>Apple Pay and Google Pay (where available)</li>
      </ul>
      
      <h3>Changing your default payment method</h3>
      <p>Tap on any saved payment method and select "Set as default" to use it for all future rides.</p>
      
      <h3>Removing a payment method</h3>
      <p>Swipe left on any payment method to reveal the delete option, or tap to edit and select remove.</p>
    `,
        relatedArticles: ['how-to-request-ride', 'ride-receipt', 'promo-codes'],
    },
    'lost-items': {
        title: 'Lost and found for riders',
        category: 'riding',
        content: `
      <h2>Left something behind?</h2>
      <p>We know how stressful it can be to lose something. Here's how to get your items back.</p>
      
      <h3>Contact your driver</h3>
      <ol>
        <li>Open the Spinr app</li>
        <li>Go to "Your Trips" or "Ride History"</li>
        <li>Select the trip where you left your item</li>
        <li>Tap "I lost an item"</li>
        <li>Follow the prompts to contact your driver</li>
      </ol>
      
      <h3>What happens next?</h3>
      <p>If your driver finds your item, you can arrange a mutually convenient time and place to pick it up. A small return fee may apply.</p>
      
      <h3>Tips for getting your items back</h3>
      <ul>
        <li>Act quickly - contact your driver as soon as possible</li>
        <li>Be specific about what you lost and where in the car it might be</li>
        <li>Be flexible with pickup arrangements</li>
      </ul>
      
      <h3>If you can't reach your driver</h3>
      <p>Contact Spinr support at <a href="mailto:support@spinr.ca">support@spinr.ca</a> and we'll help coordinate.</p>
    `,
        relatedArticles: ['how-to-request-ride', 'safety-guidelines'],
    },
    'driver-earnings': {
        title: 'How and when driver pay is calculated',
        category: 'driving',
        content: `
      <h2>Understanding your earnings</h2>
      <p>Your earnings are calculated based on several factors for each ride.</p>
      
      <h3>How earnings are calculated</h3>
      <p>For each ride, you earn:</p>
      <ul>
        <li><strong>Base fare:</strong> A set amount for accepting the ride</li>
        <li><strong>Distance:</strong> Amount per kilometer driven</li>
        <li><strong>Time:</strong> Amount per minute of the trip</li>
        <li><strong>Tips:</strong> 100% of tips go directly to you</li>
      </ul>
      
      <h3>When you get paid</h3>
      <p>Earnings are deposited directly to your bank account every week on Tuesday. The pay period runs Monday to Sunday.</p>
      
      <h3>Viewing your earnings</h3>
      <p>Open the Driver app and tap on "Earnings" to see your daily, weekly, and trip-by-trip breakdown.</p>
      
      <h3>Bonuses and incentives</h3>
      <p>You may qualify for additional bonuses during peak hours or for completing a certain number of rides.</p>
    `,
        relatedArticles: ['weekly-payouts', 'driver-bonuses', 'tax-documents'],
    },
    'safety-guidelines': {
        title: 'Safety guidelines and policies',
        category: 'safety',
        content: `
      <h2>Your safety is our priority</h2>
      <p>At Spinr, we're committed to keeping both riders and drivers safe.</p>
      
      <h3>For Riders</h3>
      <ul>
        <li><strong>Verify your ride:</strong> Always confirm the driver's name, photo, and license plate before getting in</li>
        <li><strong>Share your trip:</strong> Use the "Share ride status" feature to let friends and family track your trip</li>
        <li><strong>Sit in the back:</strong> For added safety, we recommend sitting in the back seat</li>
        <li><strong>Wear your seatbelt:</strong> Always buckle up for every ride</li>
      </ul>
      
      <h3>For Drivers</h3>
      <ul>
        <li><strong>Follow traffic laws:</strong> Always obey speed limits and traffic signals</li>
        <li><strong>Keep your vehicle clean:</strong> A clean car provides a better experience</li>
        <li><strong>Stay alert:</strong> Never drive while fatigued or under the influence</li>
        <li><strong>Be respectful:</strong> Treat every rider with courtesy and respect</li>
      </ul>
      
      <h3>In case of emergency</h3>
      <p>Use the in-app emergency button to quickly contact local authorities. Your location will be shared automatically.</p>
      
      <h3>Report concerns</h3>
      <p>If you ever feel unsafe, report the incident through the app or contact us at <a href="mailto:support@spinr.ca">support@spinr.ca</a>.</p>
    `,
        relatedArticles: ['report-incident', 'community-guidelines', 'emergency-assistance'],
    },
    // Default content for articles without specific content
    default: {
        title: 'Help Article',
        category: 'general',
        content: `
      <h2>We're here to help</h2>
      <p>This article is coming soon. In the meantime, please contact our support team for assistance.</p>
      <p>Email us at <a href="mailto:support@spinr.ca">support@spinr.ca</a> and we'll be happy to help you with any questions.</p>
    `,
        relatedArticles: [],
    },
}

// Helper function to get article by slug
export function getArticleBySlug(slug) {
    for (const category of HELP_CATEGORIES) {
        const article = category.articles.find((a) => a.slug === slug)
        if (article) {
            const content = ARTICLE_CONTENT[slug] || ARTICLE_CONTENT.default
            return {
                ...article,
                ...content,
                categoryId: category.id,
                categoryTitle: category.title,
                categorySlug: category.slug,
                categoryIcon: category.icon,
            }
        }
    }
    return null
}

// Helper function to get category by slug
export function getCategoryBySlug(slug) {
    return HELP_CATEGORIES.find((c) => c.slug === slug) || null
}

// Helper function to get all articles for sitemap
export function getAllArticleSlugs() {
    return HELP_CATEGORIES.flatMap((cat) =>
        cat.articles.map((a) => ({
            slug: a.slug,
            categorySlug: cat.slug,
        }))
    )
}
