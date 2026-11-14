import { useEffect, useState } from 'react'
import { getProfile, getSettings, getTable } from './insforge'

const TABLES = ['social_links', 'education', 'skills', 'projects', 'experience']

export function useSiteData() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const [profile, settings, ...rest] = await Promise.all([
          getProfile(),
          getSettings(),
          ...TABLES.map((t) => getTable(t)),
        ])
        if (cancelled) return
        setData({
          profile,
          settings,
          social_links: rest[0],
          education: rest[1],
          skills: rest[2],
          projects: rest[3],
          experience: rest[4],
        })
      } catch (e) {
        if (!cancelled) setError(e)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  return { data, loading, error }
}

export function sectionEnabled(settings, key) {
  if (!settings) return true
  return settings[`section_${key}`] !== 'false'
}

export function setting(settings, key, fallback = '') {
  return settings?.[key] ?? fallback
}
