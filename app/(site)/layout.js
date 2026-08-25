import { display, editorial } from './fonts'
import { CSS } from './theme'
import { SiteNav, SiteFooter } from './Chrome'
import { ScrollProgress, StickyCta, RevealFooter, Cursor } from './Reveal'

/*
 * The site shell: scoped stylesheet, floating nav, docked CTA, drawn cursor,
 * pinned footer. Each page brings only its sections and its own motion.
 *
 * This is a route group — the (site) folder does not appear in any URL, so
 * these pages live at /, /ride, /drive, /about, /help and /legal/[slug].
 * Everything public now lives in here. Two pages still carry the previous
 * body styling inside this shell — /promotions (noindex, campaign-only) and
 * /app (a store redirect that shows for a moment) — rather than outside it.
 */

export default function SiteLayout({ children }) {
  return (
    <main className={`sp ${display.variable} ${editorial.variable}`}>
      <style>{CSS}</style>
      <ScrollProgress />
      <Cursor />

      <div className="sp-stage">
        <SiteNav />
        {children}
      </div>

      <RevealFooter>
        <SiteFooter />
      </RevealFooter>

      <StickyCta />
    </main>
  )
}
