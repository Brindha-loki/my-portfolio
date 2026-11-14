import { createClient } from '@insforge/sdk'

export const insforge = createClient({
  baseUrl: import.meta.env.VITE_INSFORGE_URL,
  anonKey: import.meta.env.VITE_INSFORGE_ANON_KEY,
})

export const BUCKET = 'portfolio'

// ---------- Public content helpers ----------

export async function getProfile() {
  const { data, error } = await insforge.database.from('profile').select('*').eq('id', 1).maybeSingle()
  if (error) throw error
  return data
}

export async function getTable(table, order = 'sort_order') {
  const { data, error } = await insforge.database
    .from(table)
    .select('*')
    .order(order, { ascending: true })
  if (error) throw error
  return data || []
}

export async function getSettings() {
  const { data, error } = await insforge.database.from('settings').select('*')
  if (error) throw error
  const map = {}
  for (const row of data || []) map[row.key] = row.value
  return map
}

// ---------- Storage helpers ----------

export async function uploadFile(file, key) {
  const bucket = insforge.storage.from(BUCKET)
  const { data, error } = key
    ? await bucket.upload(key, file)
    : await bucket.uploadAuto(file)
  if (error) throw error
  return data // { url, key, ... }
}

export async function deleteFile(key) {
  if (!key) return
  await insforge.storage.from(BUCKET).remove(key)
}

export function fileUrl(keyOrUrl) {
  if (!keyOrUrl) return null
  if (keyOrUrl.startsWith('http')) return keyOrUrl
  const { data } = insforge.storage.from(BUCKET).getPublicUrl(keyOrUrl)
  return data?.publicUrl || data?.url || null
}

// ---------- Auth helpers ----------

export async function getSessionUser() {
  const { data, error } = await insforge.auth.getCurrentUser()
  if (error || !data?.user) return null
  return data.user
}

export async function isAdminUser(user) {
  if (!user) return false
  const uid = user.id || user.user_id || user.sub
  const { data, error } = await insforge.database
    .from('admin_users')
    .select('user_id')
    .eq('user_id', uid)
    .maybeSingle()
  if (error) return false
  return !!data
}
