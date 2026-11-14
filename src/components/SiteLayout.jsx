import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import { useSiteData } from '../lib/useSiteData'

export default function SiteLayout() {
  const { data, loading } = useSiteData()
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  useEffect(() => {
    if (data?.profile?.seo_title) document.title = data.profile.seo_title
  }, [data])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-cherry border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar settings={data?.settings} profile={data?.profile} />
      <main className="flex-1">
        <Outlet context={data} />
      </main>
      <Footer settings={data?.settings} profile={data?.profile} social={data?.social_links} />
    </div>
  )
}
