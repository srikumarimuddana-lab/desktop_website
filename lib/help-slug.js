/**
 * Question text -> URL slug, for the FAQ answers served at /help/[slug].
 *
 * Its own module, and deliberately dependency-free: the help page is a client
 * component and needs this to build links, while lib/help-answers.js (which
 * also uses it) pulls in the Supabase client and the help-topic constants.
 * Importing that from the browser would ship both for the sake of one regex.
 *
 * Stable across edits that do not change the words — case, punctuation and
 * stray whitespace all normalise away — so a link does not rot when someone
 * fixes a typo in the admin dashboard.
 */
export function faqSlug(question) {
  return String(question)
    .toLowerCase()
    .replace(/[‘’']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}
