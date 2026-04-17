// Spinr Promotions - quest/promotion catalog
// Access via /promotions/[slug] using the shareable link.

export const PROMOTIONS = [
  {
    slug: 'driver-200-bonus',
    audience: 'driver',
    status: 'active',
    title: 'Complete 15 Rides, Earn $200',
    shortDescription: 'Finish 15 trips in 30 days and we will deposit a $200 bonus on top of your regular earnings.',
    heroHighlight: '$200 Bonus',
    reward: 200,
    goalRides: 15,
    windowDays: 30,
    city: 'Saskatoon',
    startDate: '2026-04-17',
    endDate: '2026-05-17',
    howItWorks: [
      'Register for the quest using the form below with the email you use for your driver account.',
      'Accept the quest — your progress starts the moment we confirm your registration.',
      'Complete 15 paid rides in Saskatoon within 30 days of acceptance.',
      'The $200 bonus lands in your next weekly payout after you hit 15 trips.',
    ],
    terms: [
      'Open to approved Spinr drivers in Saskatoon only.',
      'Cancelled, no-show, and driver-cancelled trips do not count toward the 15 rides.',
      'Each driver can register for this quest once.',
      'Bonus is paid as a separate line item on your weekly payout.',
      'Spinr reserves the right to disqualify accounts found gaming the system (self-rides, fake trips, fraud).',
    ],
  },
]

export function getPromotionBySlug(slug) {
  return PROMOTIONS.find((p) => p.slug === slug) || null
}

export function getActivePromotions(audience) {
  return PROMOTIONS.filter(
    (p) => p.status === 'active' && (!audience || p.audience === audience)
  )
}
