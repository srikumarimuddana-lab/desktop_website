import { notFound } from 'next/navigation'
import { getPromotionBySlug } from '@/constants/promotions'
import PromotionDetailClient from './PromotionDetailClient'

export async function generateMetadata({ params }) {
  const { slug } = await params
  const promo = getPromotionBySlug(slug)
  if (!promo) {
    return { title: 'Promotion not found — Spinr', robots: { index: false, follow: false } }
  }
  return {
    title: `${promo.title} — Spinr Promotions`,
    description: promo.shortDescription,
    robots: { index: false, follow: false },
  }
}

export default async function PromotionDetailPage({ params }) {
  const { slug } = await params
  const promo = getPromotionBySlug(slug)
  if (!promo) notFound()
  return <PromotionDetailClient promo={promo} />
}
