import { notFound } from 'next/navigation'
import { getPromotionBySlug } from '@/lib/promotions'
import PromotionDetailClient from './PromotionDetailClient'

export async function generateMetadata({ params }) {
  const { slug } = await params
  const promo = await getPromotionBySlug(slug)
  if (!promo) {
    return { title: 'Promotion not found — Spinr', robots: { index: false, follow: false } }
  }
  return {
    title: `${promo.title} — Spinr Promotions`,
    description: promo.shortDescription,
    robots: { index: false, follow: false },
  }
}

export default async function PromotionDetailPage({ params, searchParams }) {
  const { slug } = await params
  const sp = (await searchParams) || {}
  const initialCode = typeof sp.code === 'string' ? sp.code : ''
  const promo = await getPromotionBySlug(slug)
  if (!promo || promo.status !== 'active') notFound()
  return <PromotionDetailClient promo={promo} initialCode={initialCode} />
}
