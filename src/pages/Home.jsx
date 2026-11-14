import { Link, useOutletContext } from 'react-router-dom'
import { ProjectCard, SkillCard } from '../components/cards'
import SectionHeading from '../components/SectionHeading'
import { fileUrl } from '../lib/insforge'
import { sectionEnabled } from '../lib/useSiteData'

export default function Home() {
  const data = useOutletContext()
  const { profile, settings, projects = [], skills = [], education = [] } = data || {}

  const featured = projects.filter((p) => p.featured).slice(0, 3)
  const topSkills = skills.slice(0, 6)
  const photo = fileUrl(profile?.photo_url)
  const latestEdu = education[0]

  return (
    <>
      {/* Hero */}
      <section className="border-b border-charcoal/10 bg-gradient-to-b from-cream to-[#FDF1E3]">
        <div className="container-x grid items-center gap-12 py-20 md:grid-cols-[1.2fr_0.8fr] md:py-28">
          <div>
            <p className="eyebrow mb-4">{profile?.title || 'Portfolio'}</p>
            <h1 className="font-serif text-5xl font-semibold leading-[1.05] tracking-tight text-charcoal sm:text-6xl">
              {profile?.full_name || 'Your Name'}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/80">
              {profile?.tagline || profile?.about?.slice(0, 220)}
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link to="/projects" className="btn-primary">View My Work</Link>
              {profile?.resume_url && (
                <a href={profile.resume_url} download className="btn-outline">Download Resume</a>
              )}
              <Link to="/contact" className="btn-outline">Contact Me</Link>
            </div>
          </div>
          {photo ? (
            <div className="relative mx-auto w-full max-w-sm">
              <div className="absolute -inset-3 rounded-[2rem] border-2 border-burnt/40" />
              <img src={photo} alt={profile?.full_name} className="relative aspect-[4/5] w-full rounded-[1.75rem] object-cover shadow-xl" />
            </div>
          ) : (
            <div className="relative mx-auto hidden aspect-[4/5] w-full max-w-sm items-center justify-center rounded-[1.75rem] bg-cherry/5 md:flex">
              <span className="font-serif text-8xl font-semibold text-cherry/20">
                {(profile?.full_name || 'Y').split(' ').map((w) => w[0]).join('').slice(0, 2)}
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Featured projects */}
      {sectionEnabled(settings, 'projects') && featured.length > 0 && (
        <section className="container-x py-20">
          <SectionHeading eyebrow="Selected Work" title="Featured Projects" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => <ProjectCard key={p.id} project={p} />)}
          </div>
          <div className="mt-10 text-center">
            <Link to="/projects" className="text-sm font-semibold text-cherry hover:text-cherry-dark">
              View all projects →
            </Link>
          </div>
        </section>
      )}

      {/* About teaser */}
      {sectionEnabled(settings, 'about') && profile?.about && (
        <section className="border-y border-charcoal/10 bg-white">
          <div className="container-x grid gap-10 py-20 md:grid-cols-2 md:items-center">
            <div>
              <SectionHeading eyebrow="About Me" title="A little about me" />
              <p className="leading-relaxed text-ink/80">{profile.about.slice(0, 400)}{profile.about.length > 400 ? '…' : ''}</p>
              {latestEdu && (
                <p className="mt-5 text-sm font-medium text-charcoal/70">
                  Currently pursuing <span className="text-cherry">{latestEdu.degree}</span> at {latestEdu.institution}
                </p>
              )}
              <Link to="/about" className="btn-outline mt-8">Read more</Link>
            </div>
            {photo && (
              <img src={photo} alt="" className="hidden aspect-square w-full max-w-md rounded-3xl object-cover md:block" loading="lazy" />
            )}
          </div>
        </section>
      )}

      {/* Skills overview */}
      {sectionEnabled(settings, 'skills') && topSkills.length > 0 && (
        <section className="container-x py-20">
          <SectionHeading eyebrow="Capabilities" title="Skills at a glance" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {topSkills.map((s) => <SkillCard key={s.id} skill={s} />)}
          </div>
          <div className="mt-10 text-center">
            <Link to="/skills" className="text-sm font-semibold text-cherry hover:text-cherry-dark">
              See all skills →
            </Link>
          </div>
        </section>
      )}

      {/* Contact CTA */}
      {sectionEnabled(settings, 'contact') && (
        <section className="bg-cherry-dark">
          <div className="container-x flex flex-col items-center gap-6 py-16 text-center">
            <h2 className="font-serif text-3xl font-semibold text-cream sm:text-4xl">Let's work together</h2>
            <p className="max-w-md text-cream/75">
              Have a project, internship, or collaboration in mind? I'd love to hear from you.
            </p>
            <Link to="/contact" className="btn-light">Get in Touch</Link>
          </div>
        </section>
      )}
    </>
  )
}
