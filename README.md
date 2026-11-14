# Brindha Sathish — Portfolio & Admin Dashboard

A responsive personal portfolio website backed by [InsForge](https://insforge.dev), with a secure admin dashboard at `/admin` for managing all content without touching code.

## Stack

- **Frontend:** React 19 + Vite, React Router, Tailwind CSS
- **Backend:** InsForge (Postgres database, Auth, Storage)
- **Design:** Fraunces + DM Sans, cherry red / burnt yellow / cream palette

## Pages

Home, About, Skills, Projects, Experience & Certifications, Education, Contact, plus a custom 404.

## Admin Dashboard (`/admin`)

Sign in to manage: profile & resume, projects, skills, education, experience/certifications, social links, media library, contact messages, and website settings (nav labels, section visibility, footer, SEO).

Only accounts listed in the `admin_users` table can access the dashboard. Public visitors can only read published content; all writes require an authenticated admin (enforced by Row Level Security).

## Setup

```bash
npm install
cp .env.example .env   # fill in your InsForge URL + anon key
npm run dev            # http://localhost:5173
npm run build          # production build → dist/
npm run preview        # preview the production build
```

## Environment variables

| Variable | Where | Description |
|---|---|---|
| `VITE_INSFORGE_URL` | `.env` | InsForge backend URL (`https://<appkey>.<region>.insforge.app`) |
| `VITE_INSFORGE_ANON_KEY` | `.env` | Project anon key — safe for browsers (RLS protects data) |

Get the anon key with `npx @insforge/cli secrets get ANON_KEY`. **Never** put the project API key (`ik_...`) in frontend env vars — it is a full-access admin credential.

## Database

Migrations live in `migrations/` and are applied with:

```bash
npx @insforge/cli db migrations up --all
```

Schema: `profile`, `social_links`, `education`, `skills`, `projects`, `experience`, `settings`, `contact_submissions`, `admin_users`, plus `is_admin()` (SECURITY DEFINER) used by all RLS policies. Storage bucket: `portfolio` (public read; admin-only writes).

## Creating / granting an admin account

1. Sign up at `/admin/login` → "Create admin account" (or via the SDK).
2. Grant access (run as project admin):

```bash
npx @insforge/cli db query "INSERT INTO public.admin_users (user_id, email) VALUES ('<user-uuid>', '<email>') ON CONFLICT (user_id) DO NOTHING;"
```

Find the user id in the InsForge dashboard (Authentication) or from the sign-in response.

## Deployment

Build locally first (`npm run build`), then either:

- **InsForge deployments:** `npx @insforge/cli deployments deploy dist` — or deploy the source directory; `vercel.json` is included for SPA routing.
- **Vercel/Netlify:** set `VITE_INSFORGE_URL` and `VITE_INSFORGE_ANON_KEY` in the host's env vars, deploy `dist` (or the repo root with `npm run build`).

## Project files

- `insforge.toml` — backend config (email verification disabled for password-only admin login)
- `.insforge/project.json` — linked project (gitignored, contains admin API key — never commit)
