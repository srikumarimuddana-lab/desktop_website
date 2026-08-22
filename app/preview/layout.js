import { display, editorial } from './fonts'
import { CSS } from './theme'
import { SiteNav, SiteFooter } from './Chrome'
import { ScrollProgress, StickyCta, RevealFooter, Cursor } from './Reveal'

/*
 * DESIGN SAMPLE — /preview and its subpages.
 * One shell: scoped stylesheet, floating nav, docked CTA, drawn cursor,
 * pinned footer. Each page brings only its sections and its own motion.
 * Not linked from the live site, not in the sitemap.
 */

export const metadata = {
  title: 'Design Sample | Spinr',
  description: 'Internal design sample. Not a live page.',
  robots: { index: false, follow: false },
}

export default function PreviewLayout({ children }) {
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
