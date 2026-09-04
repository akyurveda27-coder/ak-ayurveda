# AK Ayurveda — Website

A production-ready Next.js 14 website for AK Ayurveda clinic with a full CMS admin panel powered by Supabase.

## Stack

- **Framework:** Next.js 14 (App Router, Server Components)
- **Database:** Supabase (PostgreSQL + realtime)
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **Deploy:** Vercel

---

## Quick Start

### 1. Clone & Install

```bash
cd ak-ayurveda
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase/seed.sql`
3. This creates all tables, RLS policies, and seeds default content

### 3. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` — see `.env.example` for the full list:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_PASSWORD=choose-a-strong-password
RESEND_API_KEY=your-resend-key
```

> Find your keys in **Supabase → Settings → API**

### 4. Lock down the database

Run `supabase/lockdown.sql` in the **SQL Editor** once. It leaves the public key
able to read website content only — every write, and all customer data, goes
through the password-protected admin API.

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home page (fully dynamic from Supabase) |
| `/admin` | CMS admin panel |

---

## Admin Panel

**URL:** `/admin`  
**Password:** whatever you set as `ADMIN_PASSWORD` (server-side only — never in the code)

Login is verified on the server and issues an httpOnly session cookie valid for
7 days. Every content change and every read of customer data goes through
`/api/admin/*`, which rejects any request without that cookie.

### What's Editable

| Section | Editable Fields |
|---------|----------------|
| Hero | Heading, subheading, CTA buttons |
| Stats | 4 stat values and labels |
| Services | CRUD — name, description, icon |
| Doctor | Name, title, degree, bio, photo URL |
| Conditions | CRUD — name, icon |
| Testimonials | CRUD — quote, patient, city, stars, active/hidden toggle |
| FAQs | CRUD — question, answer |
| Contact | Address, phone, email, hours, social links |
| Appointments | View all bookings, update status (pending/confirmed/completed/cancelled) |

### What's Static (cannot be changed from admin)
- Colors (design spec)
- Fonts
- Layout & section order
- SVG botanical decorations

---

## Supabase Schema

```sql
-- All tables (run seed.sql for full schema with RLS)
site_content (key, value jsonb, updated_at)
services (id, name, description, icon, sort_order)
conditions (id, name, icon, sort_order)
testimonials (id, quote, patient_name, city, stars, is_active, created_at)
faqs (id, question, answer, sort_order)
appointments (id, name, phone, email, service, preferred_date, message, status, created_at)
```

---

## Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard:
# NEXT_PUBLIC_SUPABASE_URL
# NEXT_PUBLIC_SUPABASE_ANON_KEY
# SUPABASE_SERVICE_ROLE_KEY   ← required for admin saves
# ADMIN_PASSWORD              ← required for admin login
# RESEND_API_KEY              ← required for booking emails
```

Or connect your Git repo directly at [vercel.com](https://vercel.com) for automatic deployments.

---

## Project Structure

```
ak-ayurveda/
├── app/
│   ├── layout.tsx              # Root layout + metadata
│   ├── page.tsx                # Home page (Server Component)
│   ├── globals.css             # Global styles + Tailwind
│   ├── admin/
│   │   └── page.tsx            # Full admin CMS panel
│   └── api/
│       ├── content/route.ts    # GET/POST site content
│       └── appointments/route.ts  # POST/GET appointments
├── components/
│   ├── Navbar.tsx              # Sticky navbar with mobile menu
│   ├── Hero.tsx                # Hero section with botanical SVGs
│   ├── Stats.tsx               # Stats bar (green bg)
│   ├── Services.tsx            # 6 service cards
│   ├── Doctor.tsx              # Doctor section (photo + bio)
│   ├── Conditions.tsx          # Conditions grid
│   ├── Testimonials.tsx        # Testimonials carousel
│   ├── BookAppointment.tsx     # Appointment booking form
│   ├── FAQ.tsx                 # Accordion FAQ
│   └── Footer.tsx              # Footer with links + contact
├── lib/
│   ├── supabase.ts             # Supabase client
│   ├── types.ts                # TypeScript interfaces
│   └── defaults.ts             # Default content (fallbacks)
├── supabase/
│   └── seed.sql                # Schema + seed data
├── .env.example
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Design System

| Token | Value |
|-------|-------|
| Primary | `#2D5016` |
| Primary Dark | `#1F3A10` |
| Accent | `#C9A84C` |
| Background | `#FDFBF5` |
| Text | `#1A1A1A` |
| Sage | `#6B7B4F` |
| Font Display | Fraunces (Google Fonts) |
| Font Body | Inter (Google Fonts) |

---

## Features

- ✅ Fully responsive (mobile-first)
- ✅ Server-side rendering with `revalidate = 60`
- ✅ Graceful fallback to default content if Supabase is empty
- ✅ Admin panel with CRUD for all dynamic content
- ✅ Appointment booking form with status management
- ✅ Testimonials carousel with active/hidden toggle
- ✅ FAQ accordion
- ✅ SEO metadata in layout.tsx
- ✅ Smooth scroll + animated nav underlines
- ✅ Botanical SVG decorations in hero

---

## Production Notes

1. **Admin Security:** The password is verified server-side against `ADMIN_PASSWORD` and never ships to the browser. Session = signed httpOnly cookie.

2. **RLS Policies:** Run `supabase/lockdown.sql` so the public key cannot write anything or read customer data.

3. **Images:** The doctor photo uses an Unsplash placeholder. Replace with an actual hosted image URL.

4. **Email Notifications:** Consider adding email notifications for new appointments using a service like Resend or SendGrid.
