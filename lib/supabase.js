import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return supabaseUrl && 
         supabaseUrl !== 'your-supabase-url' && 
         supabaseUrl.startsWith('https://') &&
         supabaseAnonKey && 
         supabaseAnonKey !== 'your-supabase-anon-key'
}

// Create mock query builder for when Supabase is not configured
const createMockQueryBuilder = () => {
  const mockResponse = { data: null, error: { message: 'Supabase not configured' } }
  const chainable = {
    select: () => chainable,
    insert: () => chainable,
    update: () => chainable,
    delete: () => chainable,
    eq: () => chainable,
    neq: () => chainable,
    gt: () => chainable,
    gte: () => chainable,
    lt: () => chainable,
    lte: () => chainable,
    like: () => chainable,
    ilike: () => chainable,
    is: () => chainable,
    in: () => chainable,
    contains: () => chainable,
    containedBy: () => chainable,
    rangeGt: () => chainable,
    rangeGte: () => chainable,
    rangeLt: () => chainable,
    rangeLte: () => chainable,
    rangeAdjacent: () => chainable,
    overlaps: () => chainable,
    textSearch: () => chainable,
    match: () => chainable,
    not: () => chainable,
    or: () => chainable,
    filter: () => chainable,
    order: () => chainable,
    limit: () => chainable,
    range: () => chainable,
    single: () => Promise.resolve(mockResponse),
    maybeSingle: () => Promise.resolve(mockResponse),
    then: (resolve) => Promise.resolve(mockResponse).then(resolve),
    catch: (reject) => Promise.resolve(mockResponse).catch(reject),
  }
  return chainable
}

// Create client only if configured, otherwise use a dummy object
export const supabase = isSupabaseConfigured() 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : {
      from: () => createMockQueryBuilder(),
      auth: {
        getSession: async () => ({ data: { session: null } }),
        signInWithPassword: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
        signOut: async () => ({}),
      }
    }
