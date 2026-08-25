import NotFoundBody from './NotFoundBody'

/*
 * notFound() raised inside a site route — a legal document, a help answer or
 * a promotion that does not exist. The site layout is already wrapped around
 * this, so it only needs the body.
 */

export const metadata = {
  title: 'Page not found | Spinr',
  robots: { index: false, follow: true },
}

export default function SiteNotFound() {
  return <NotFoundBody />
}
