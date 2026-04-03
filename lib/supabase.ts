import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ── Types ──────────────────────────────────────────────────────────────────────
export type Card = {
  id: string
  user_id: string
  slug: string
  name: string
  title?: string
  company?: string
  phone?: string
  email?: string
  website?: string
  linkedin?: string
  twitter?: string
  bio?: string
  avatar_url?: string
  card_color: string
  is_active: boolean
  created_at: string
  updated_at: string
}

// ── Helpers ────────────────────────────────────────────────────────────────────
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export async function getCardBySlug(slug: string): Promise<Card | null> {
  const { data } = await supabase
    .from('cards')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()
  return data
}

export async function getMyCard(userId: string): Promise<Card | null> {
  const { data } = await supabase
    .from('cards')
    .select('*')
    .eq('user_id', userId)
    .single()
  return data
}

export async function upsertCard(card: Partial<Card> & { user_id: string; slug: string; name: string }) {
  const { data, error } = await supabase
    .from('cards')
    .upsert({ ...card, updated_at: new Date().toISOString() }, { onConflict: 'user_id' })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function logView(cardId: string, referrer?: string) {
  await supabase.from('card_views').insert({ card_id: cardId, referrer })
}

export async function getViewCount(cardId: string): Promise<number> {
  const { data } = await supabase.rpc('get_card_view_count', { card_uuid: cardId })
  return data ?? 0
}

export async function uploadAvatar(userId: string, file: File): Promise<string> {
  const ext = file.name.split('.').pop()
  const path = `${userId}/avatar.${ext}`
  const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
  if (error) throw error
  const { data } = supabase.storage.from('avatars').getPublicUrl(path)
  return data.publicUrl
}
