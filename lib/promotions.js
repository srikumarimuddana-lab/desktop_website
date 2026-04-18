// Promotions lookup — prefers Supabase `promotions` table,
// falls back to the static constants/promotions.js so the site
// keeps working even before the CMS migration is seeded.

import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import {
  PROMOTIONS as STATIC_PROMOTIONS,
  getPromotionBySlug as staticBySlug,
  getActivePromotions as staticActive,
} from '@/constants/promotions'

const DEFAULT_SMS_TEMPLATE =
  'Hi {name}! Spinr is offering you a ${reward} bonus for completing {goal_rides} rides in {window_days} days in {city}. Use code {code} at {link} — expires in 24 hours.'

// Normalize a Supabase row (snake_case) to the camelCase shape
// the rest of the app already consumes.
export function normalizePromotion(row) {
  if (!row) return null
  if (row.__static) return row // already camelCase (from constants)
  return {
    id: row.id,
    slug: row.slug,
    audience: row.audience,
    status: row.status,
    title: row.title,
    shortDescription: row.short_description,
    heroHighlight: row.hero_highlight,
    reward: Number(row.reward) || 0,
    goalRides: Number(row.goal_rides) || 0,
    windowDays: Number(row.window_days) || 0,
    city: row.city,
    startDate: row.start_date,
    endDate: row.end_date,
    howItWorks: Array.isArray(row.how_it_works) ? row.how_it_works : [],
    terms: Array.isArray(row.terms) ? row.terms : [],
    smsTemplate: row.sms_template || DEFAULT_SMS_TEMPLATE,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

// Map a camelCase promotion object back to snake_case columns for insert/update.
export function toDbRow(p) {
  const out = {
    slug: p.slug?.trim().toLowerCase(),
    audience: p.audience || 'driver',
    status: p.status || 'draft',
    title: p.title,
    short_description: p.shortDescription || '',
    hero_highlight: p.heroHighlight || '',
    reward: Number(p.reward) || 0,
    goal_rides: Number(p.goalRides) || 0,
    window_days: Number(p.windowDays) || 30,
    city: p.city || 'Saskatoon',
    start_date: p.startDate || null,
    end_date: p.endDate || null,
    how_it_works: Array.isArray(p.howItWorks) ? p.howItWorks : [],
    terms: Array.isArray(p.terms) ? p.terms : [],
    sms_template: p.smsTemplate || DEFAULT_SMS_TEMPLATE,
  }
  return out
}

function withStaticFlag(p) {
  return { ...p, __static: true }
}

export async function getPromotionBySlug(slug) {
  if (!slug) return null
  if (isSupabaseConfigured()) {
    try {
      const { data } = await supabase
        .from('promotions')
        .select('*')
        .eq('slug', slug)
        .maybeSingle()
      if (data) return normalizePromotion(data)
    } catch (err) {
      console.error('getPromotionBySlug DB error:', err)
    }
  }
  const s = staticBySlug(slug)
  return s ? withStaticFlag(s) : null
}

export async function getActivePromotions(audience) {
  if (isSupabaseConfigured()) {
    try {
      let query = supabase
        .from('promotions')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
      if (audience) query = query.eq('audience', audience)
      const { data } = await query
      if (data && data.length > 0) return data.map(normalizePromotion)
    } catch (err) {
      console.error('getActivePromotions DB error:', err)
    }
  }
  return staticActive(audience).map(withStaticFlag)
}

// Render an SMS template with placeholder substitution.
export function renderSmsTemplate(template, vars) {
  const text = template || DEFAULT_SMS_TEMPLATE
  return text.replace(/\{(\w+)\}/g, (_, key) => {
    const v = vars[key]
    return v == null ? '' : String(v)
  })
}

export { DEFAULT_SMS_TEMPLATE }
