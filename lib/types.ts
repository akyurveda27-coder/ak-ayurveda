export interface HeroContent {
  heading: string
  subheading: string
  cta1_text: string
  cta1_link: string
  cta2_text: string
  cta2_link: string
}

export interface StatsContent {
  stat1_value: string
  stat1_label: string
  stat2_value: string
  stat2_label: string
  stat3_value: string
  stat3_label: string
  stat4_value: string
  stat4_label: string
}

export interface DoctorContent {
  name: string
  title: string
  degree: string
  bio: string
  experience: string
  specialization: string
  photo_url: string
}

export interface ContactContent {
  address: string
  phone: string
  email: string
  hours: string
  facebook_url: string
  instagram_url: string
  twitter_url: string
  youtube_url: string
}

export interface Service {
  id: string
  name: string
  description: string
  icon: string
  sort_order: number
  duration?: string
  price_from?: string
  location?: string
  phone?: string
  benefits?: string[]
  benefit_descriptions?: string[]
  process?: string[]
  process_days?: string[]
  process_descriptions?: string[]
  ideal_for?: string[]
  faqs?: { q: string; a: string }[]
  trust_stats?: { num: string; label: string }[]
  hero_image?: string
  testimonial_quote?: string
  testimonial_name?: string
  testimonial_location?: string
  testimonial_stars?: number
}

export interface Condition {
  id: string
  name: string
  icon: string
  sort_order: number
}

export interface Testimonial {
  id: string
  quote: string
  patient_name: string
  city: string
  stars: number
  is_active: boolean
  created_at: string
}

export interface FAQ {
  id: string
  question: string
  answer: string
  sort_order: number
}

export interface Appointment {
  id: string
  name: string
  phone: string
  email: string
  service: string
  preferred_date: string
  message: string
  status: string
  created_at: string
}

export interface SiteContent {
  hero: HeroContent
  stats: StatsContent
  doctor: DoctorContent
  contact: ContactContent
}
