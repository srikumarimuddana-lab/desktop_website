import { display, editorial } from './(site)/fonts'
import { CSS } from './(site)/theme'
import { SiteNav, SiteFooter } from './(site)/Chrome'
import NotFoundBody from './(site)/NotFoundBody'

/*
 * The 404 for URLs that match no route at all. Next renders this under the
 * ROOT layout, outside the (site) route group, so the site shell that
 * (site)/layout.js normally provides — scoped stylesheet, display fonts, nav
 * and footer — has to be assembled here by hand. Without it this page falls
 * back to unstyled defaults, which is what it did until now.
 */

export const metadata = {
  title: 'Page not found | Spinr',
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <main className={`sp ${display.variable} ${editorial.variable}`}>
      <style>{CSS}</style>
      <div className="sp-stage">
        <SiteNav />
        <NotFoundBody />
      </div>
      <SiteFooter />
    </main>
  )
}
