/**
 * The FAQ text used when Supabase is unreachable — one copy, for every page.
 *
 * These lived inline in three pages, and had already drifted: two versions of
 * "What does a ride actually cost?" existed with different answers. That
 * matters more than usual here, because the same wording reaches drivers and
 * riders through the AI assistant (lib/kb-sync.js pushes FAQ rows into
 * knowledge_base), so a page and the assistant could disagree.
 *
 * It is also what lets /help/[slug] serve an answer page for a fallback FAQ.
 * Without a shared list the accordion could show an answer the answer page
 * would 404 on.
 *
 * Pages pick the subset they want with pickFaqs(); the words live here.
 */

/** question -> answer. Order is the order they were written in. */
export const FAQ_TEXT = {
  'What does a ride actually cost?':
    'The ride fare, a flat $1 booking fee \u2014 the only fee Spinr keeps \u2014 plus pass-through charges where they apply (insurance, city or airport fees) and tax, each shown by name before you book. No surge multiplier, ever, and no fee that is not on the receipt.',
  'Which fees does Spinr keep?':
    'One: the $1 booking fee. The fare goes to your driver, the insurance fee to the insurer, city and airport fees to the city and airport, tax to the government — collected and passed through, never marked up.',
  'How does 0% commission work?':
    'Drivers keep 100% of the net fare \u2014 Spinr never takes a share of it. Access to the app is a subscription instead, the Spinr Pass, and every driver gets 6 months free at the moment.',
  'What is the Spinr Pass?':
    'It is the monthly subscription a driver pays for access to the Spinr app \u2014 dispatch, in-app payments, support. It replaces commission entirely: Spinr never takes a percentage of a driver\u2019s fare. Every driver gets 6 months free at the moment. After that there are two monthly plans set by how many rides a day you take: Part-time at $19.99 a month, covering up to 4 rides a day; and Full-time at $49.99 a month with unlimited rides. Both prices are introductory rates \u2014 neither is the standard price.',
  'What happens when I hit 4 rides on the Part-time plan?':
    'That is your limit for the day \u2014 you will not be offered more rides until the next day, when it resets. If you are reaching it often, the Full-time plan is $49.99 a month, an introductory rate, with unlimited rides.',
  'Can I switch between Part-time and Full-time?':
    'Yes. Switching is a cancel and a re-subscribe: cancel the plan you are on, then subscribe to the other one. Part-time is $19.99 a month for up to 4 rides a day; Full-time is $49.99 a month for unlimited rides. Both are introductory rates.',
  'Where can I use Spinr?':
    'Spinr is available in Saskatoon, Saskatchewan. That is the only city you can ride with us in today.',
  'Who is driving me?':
    'Every driver passes a criminal record check with vulnerable sector screening, holds a full driver\u2019s licence with at least three years of experience, and carries commercial ride-share insurance.',
  'Can the AI assistant book for me?':
    'Yes — ask it to price a trip, book or schedule a ride, pull up a past receipt, or check your wallet. It hands you to a human when it should.',
  'How do drivers keep 100%?':
    'Spinr takes 0% commission — no share of the fare, ever. Drivers subscribe to the app with a monthly Spinr Pass instead: 6 months free for every driver right now, then Part-time at $19.99 a month covering up to 4 rides a day, or Full-time at $49.99 with unlimited rides. Both are introductory rates, not the standard price.',
  'Is Spinr Canadian?':
    'Yes — proudly Canadian, with a support team based in Saskatchewan.',
  'What fees can appear on my receipt?':
    'The ride fare, the flat $1 booking fee, and pass-through charges where they apply: an insurance fee, city or infrastructure fees, and an airport surcharge \u2014 each named on the estimate before you book. Tax (GST, and PST where it applies) is shown on its own line.',
  'Which of these fees does Spinr keep?':
    'One: the $1 booking fee. The fare goes to your driver, the insurance fee to the insurer, city and airport fees to the city and airport, tax to the government \u2014 collected and passed through, never marked up. There is no \u201cservice fee\u201d and nothing hidden: if a line is not on the receipt, we cannot charge it.',
  'What if my driver takes a longer route?':
    'The price you accepted is the price you pay. A detour is our problem to sort out with the driver, not a surprise on your receipt.',
  'Can I book ahead?':
    'Yes — schedule a ride for later and we dispatch it when the time comes. Scheduled rides are never surge-priced, because nothing is.',
  'Do I need cash for a tip?':
    'Tips are in the app and optional. 100% of a tip goes to the driver, always.',
}

/** [question, answer] pairs for the questions named, skipping any unknown. */
export function pickFaqs(questions) {
  return questions.filter((q) => FAQ_TEXT[q]).map((q) => [q, FAQ_TEXT[q]])
}

/** Everything, as [question, answer] pairs. */
export const ALL_FAQS = Object.entries(FAQ_TEXT)
