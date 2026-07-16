'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import {
  HeroContent, StatsContent, DoctorContent, ContactContent,
  Service, Condition, Testimonial, FAQ, Appointment
} from '@/lib/types'
import {
  defaultHero, defaultStats, defaultDoctor, defaultContact,
  defaultServices, defaultConditions, defaultFAQs
} from '@/lib/defaults'

// ─── Auth ───────────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    // Simple client-side check — in production use a proper auth system
    if (password === 'ayurveda@admin123') {
      sessionStorage.setItem('ak_admin_auth', '1')
      onLogin()
    } else {
      setError('Incorrect password. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-xl font-bold font-display">AK</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-primary">Admin Panel</h1>
          <p className="font-body text-sage text-sm mt-1">AK Ayurveda CMS</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-green-50 p-8 space-y-4">
          <div>
            <label className="block font-body text-sm font-medium text-textMain mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-green-100 font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              placeholder="Enter admin password"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm font-body">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-xl font-body font-medium text-sm hover:bg-primaryDark transition-colors disabled:opacity-60"
          >
            {loading ? 'Checking...' : 'Sign In'}
          </button>
        </form>
        <p className="text-center font-body text-xs text-sage mt-4">
          <a href="/" className="hover:text-primary transition-colors">← Back to website</a>
        </p>
      </div>
    </div>
  )
}

// ─── Helpers ────────────────────────────────────────────────────────────────

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

function useSaveStatus() {
  const [status, setStatus] = useState<SaveStatus>('idle')
  const saving = () => setStatus('saving')
  const saved = () => { setStatus('saved'); setTimeout(() => setStatus('idle'), 2000) }
  const error = () => { setStatus('error'); setTimeout(() => setStatus('idle'), 3000) }
  return { status, saving, saved, error }
}

function SaveButton({ status, onClick }: { status: SaveStatus; onClick: () => void }) {
  const labels: Record<SaveStatus, string> = {
    idle: 'Save Changes',
    saving: 'Saving...',
    saved: '✓ Saved!',
    error: '✗ Error — Retry',
  }
  const colors: Record<SaveStatus, string> = {
    idle: 'bg-primary hover:bg-primaryDark text-white',
    saving: 'bg-sage text-white opacity-70 cursor-not-allowed',
    saved: 'bg-green-600 text-white',
    error: 'bg-red-500 text-white',
  }
  return (
    <button
      onClick={onClick}
      disabled={status === 'saving'}
      className={`px-5 py-2 rounded-xl font-body font-medium text-sm transition-all duration-200 ${colors[status]}`}
    >
      {labels[status]}
    </button>
  )
}

const inputClass = 'w-full px-3 py-2 rounded-lg border border-green-100 font-body text-sm text-textMain bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all'
const labelClass = 'block font-body text-xs font-semibold text-sage uppercase tracking-wide mb-1'

function Field({ label, name, value, onChange, type = 'text', textarea = false, rows = 3 }: {
  label: string; name: string; value: string; onChange: (name: string, value: string) => void
  type?: string; textarea?: boolean; rows?: number
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {textarea ? (
        <textarea
          name={name}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          rows={rows}
          className={`${inputClass} resize-none`}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          className={inputClass}
        />
      )}
    </div>
  )
}

// ─── Section Editors ────────────────────────────────────────────────────────

function HeroEditor() {
  const [data, setData] = useState<HeroContent>(defaultHero)
  const { status, saving, saved, error } = useSaveStatus()

  useEffect(() => {
    supabase.from('site_content').select('value').eq('key', 'hero').single()
      .then(({ data: d }) => { if (d?.value) setData(d.value as HeroContent) })
  }, [])

  const handleChange = (name: string, value: string) => setData((p) => ({ ...p, [name]: value }))

  const handleSave = async () => {
    saving()
    const { error: err } = await supabase.from('site_content').upsert({ key: 'hero', value: data, updated_at: new Date().toISOString() })
    err ? error() : saved()
  }

  return (
    <div className="space-y-4">
      <Field label="Main Heading" name="heading" value={data.heading} onChange={handleChange} />
      <Field label="Subheading" name="subheading" value={data.subheading} onChange={handleChange} textarea rows={3} />
      <div className="grid grid-cols-2 gap-4">
        <Field label="CTA 1 Text" name="cta1_text" value={data.cta1_text} onChange={handleChange} />
        <Field label="CTA 1 Link" name="cta1_link" value={data.cta1_link} onChange={handleChange} />
        <Field label="CTA 2 Text" name="cta2_text" value={data.cta2_text} onChange={handleChange} />
        <Field label="CTA 2 Link" name="cta2_link" value={data.cta2_link} onChange={handleChange} />
      </div>
      <SaveButton status={status} onClick={handleSave} />
    </div>
  )
}

function StatsEditor() {
  const [data, setData] = useState<StatsContent>(defaultStats)
  const { status, saving, saved, error } = useSaveStatus()

  useEffect(() => {
    supabase.from('site_content').select('value').eq('key', 'stats').single()
      .then(({ data: d }) => { if (d?.value) setData(d.value as StatsContent) })
  }, [])

  const handleChange = (name: string, value: string) => setData((p) => ({ ...p, [name]: value }))

  const handleSave = async () => {
    saving()
    const { error: err } = await supabase.from('site_content').upsert({ key: 'stats', value: data, updated_at: new Date().toISOString() })
    err ? error() : saved()
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="bg-green-50/50 rounded-xl p-4 space-y-2">
            <Field label={`Stat ${n} Value`} name={`stat${n}_value`} value={(data as unknown as Record<string, string>)[`stat${n}_value`]} onChange={handleChange} />
            <Field label={`Stat ${n} Label`} name={`stat${n}_label`} value={(data as unknown as Record<string, string>)[`stat${n}_label`]} onChange={handleChange} />
          </div>
        ))}
      </div>
      <SaveButton status={status} onClick={handleSave} />
    </div>
  )
}

function DoctorEditor() {
  const [data, setData] = useState<DoctorContent>(defaultDoctor)
  const { status, saving, saved, error } = useSaveStatus()

  useEffect(() => {
    supabase.from('site_content').select('value').eq('key', 'doctor').single()
      .then(({ data: d }) => { if (d?.value) setData(d.value as DoctorContent) })
  }, [])

  const handleChange = (name: string, value: string) => setData((p) => ({ ...p, [name]: value }))

  const handleSave = async () => {
    saving()
    const { error: err } = await supabase.from('site_content').upsert({ key: 'doctor', value: data, updated_at: new Date().toISOString() })
    err ? error() : saved()
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Name" name="name" value={data.name} onChange={handleChange} />
        <Field label="Title" name="title" value={data.title} onChange={handleChange} />
        <Field label="Degree" name="degree" value={data.degree} onChange={handleChange} />
        <Field label="Experience" name="experience" value={data.experience} onChange={handleChange} />
      </div>
      <Field label="Specialization" name="specialization" value={data.specialization} onChange={handleChange} />
      <Field label="Photo URL" name="photo_url" value={data.photo_url} onChange={handleChange} />
      <Field label="Bio" name="bio" value={data.bio} onChange={handleChange} textarea rows={4} />
      <SaveButton status={status} onClick={handleSave} />
    </div>
  )
}

function ContactEditor() {
  const [data, setData] = useState<ContactContent>(defaultContact)
  const { status, saving, saved, error } = useSaveStatus()

  useEffect(() => {
    supabase.from('site_content').select('value').eq('key', 'contact').single()
      .then(({ data: d }) => { if (d?.value) setData(d.value as ContactContent) })
  }, [])

  const handleChange = (name: string, value: string) => setData((p) => ({ ...p, [name]: value }))

  const handleSave = async () => {
    saving()
    const { error: err } = await supabase.from('site_content').upsert({ key: 'contact', value: data, updated_at: new Date().toISOString() })
    err ? error() : saved()
  }

  return (
    <div className="space-y-4">
      <Field label="Address" name="address" value={data.address} onChange={handleChange} textarea rows={2} />
      <div className="grid grid-cols-2 gap-4">
        <Field label="Phone" name="phone" value={data.phone} onChange={handleChange} />
        <Field label="Email" name="email" value={data.email} onChange={handleChange} type="email" />
        <Field label="Hours" name="hours" value={data.hours} onChange={handleChange} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Facebook URL" name="facebook_url" value={data.facebook_url} onChange={handleChange} />
        <Field label="Instagram URL" name="instagram_url" value={data.instagram_url} onChange={handleChange} />
        <Field label="Twitter URL" name="twitter_url" value={data.twitter_url} onChange={handleChange} />
        <Field label="YouTube URL" name="youtube_url" value={data.youtube_url} onChange={handleChange} />
      </div>
      <SaveButton status={status} onClick={handleSave} />
    </div>
  )
}

function ServicesEditor() {
  const [services, setServices] = useState<Service[]>([])
  const [newService, setNewService] = useState({ name: '', description: '', icon: '🌿' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('services').select('*').order('sort_order')
    setServices(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const handleUpdate = async (service: Service) => {
    setSaving(service.id)
    await supabase.from('services').update({
      name: service.name,
      description: service.description,
      icon: service.icon,
      duration: service.duration ?? null,
      price_from: service.price_from ?? null,
      benefits: service.benefits ?? [],
      process: service.process ?? [],
      ideal_for: service.ideal_for ?? [],
      faqs: service.faqs ?? [],
      trust_stats: service.trust_stats ?? [],
    }).eq('id', service.id)
    setSaving(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this service?')) return
    await supabase.from('services').delete().eq('id', id)
    load()
  }

  const handleAdd = async () => {
    if (!newService.name) return
    await supabase.from('services').insert({ ...newService, sort_order: services.length + 1 })
    setNewService({ name: '', description: '', icon: '🌿' })
    load()
  }

  if (loading) return <p className="text-sage font-body text-sm">Loading services...</p>

  return (
    <div className="space-y-4">
      {services.map((s) => (
        <div key={s.id} className="bg-green-50/50 rounded-xl p-4 space-y-2">
          <div className="grid grid-cols-4 gap-2">
            <div>
              <label className={labelClass}>Icon (emoji)</label>
              <input value={s.icon} onChange={(e) => setServices(prev => prev.map(x => x.id === s.id ? { ...x, icon: e.target.value } : x))} className={inputClass} />
            </div>
            <div className="col-span-3">
              <label className={labelClass}>Name</label>
              <input value={s.name} onChange={(e) => setServices(prev => prev.map(x => x.id === s.id ? { ...x, name: e.target.value } : x))} className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <textarea value={s.description} onChange={(e) => setServices(prev => prev.map(x => x.id === s.id ? { ...x, description: e.target.value } : x))} rows={2} className={`${inputClass} resize-none`} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className={labelClass}>Duration</label>
              <input value={s.duration ?? ''} onChange={(e) => setServices(prev => prev.map(x => x.id === s.id ? { ...x, duration: e.target.value } : x))} placeholder="e.g. 60–90 minutes" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Price From</label>
              <input value={s.price_from ?? ''} onChange={(e) => setServices(prev => prev.map(x => x.id === s.id ? { ...x, price_from: e.target.value } : x))} placeholder="e.g. ₹2,500 per session" className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Benefits (one per line)</label>
            <textarea value={(s.benefits ?? []).join('\n')} onChange={(e) => setServices(prev => prev.map(x => x.id === s.id ? { ...x, benefits: e.target.value.split('\n').map(l => l.trim()).filter(Boolean) } : x))} rows={4} placeholder="Deep detoxification&#10;Reduces stress&#10;Improves immunity" className={`${inputClass} resize-none font-mono text-xs`} />
          </div>
          <div>
            <label className={labelClass}>Process Steps (one per line)</label>
            <textarea value={(s.process ?? []).join('\n')} onChange={(e) => setServices(prev => prev.map(x => x.id === s.id ? { ...x, process: e.target.value.split('\n').map(l => l.trim()).filter(Boolean) } : x))} rows={4} placeholder="Initial consultation&#10;Oil selection&#10;Treatment session" className={`${inputClass} resize-none font-mono text-xs`} />
          </div>
          <div>
            <label className={labelClass}>Ideal For (one per line)</label>
            <textarea value={(s.ideal_for ?? []).join('\n')} onChange={(e) => setServices(prev => prev.map(x => x.id === s.id ? { ...x, ideal_for: e.target.value.split('\n').map(l => l.trim()).filter(Boolean) } : x))} rows={3} placeholder="Stress & anxiety&#10;Insomnia&#10;Chronic fatigue" className={`${inputClass} resize-none font-mono text-xs`} />
          </div>
          <div className="flex gap-2">
            <button onClick={() => handleUpdate(s)} disabled={saving === s.id} className="px-4 py-1.5 bg-primary text-white rounded-lg font-body text-xs font-medium hover:bg-primaryDark transition-colors disabled:opacity-50">
              {saving === s.id ? 'Saving...' : 'Save Changes'}
            </button>
            <button onClick={() => handleDelete(s.id)} className="px-4 py-1.5 bg-red-100 text-red-600 rounded-lg font-body text-xs font-medium hover:bg-red-200 transition-colors">
              Delete
            </button>
          </div>
        </div>
      ))}

      {/* Add new */}
      <div className="border-2 border-dashed border-green-200 rounded-xl p-4 space-y-2">
        <p className="font-body text-sm font-semibold text-primary">+ Add New Service</p>
        <div className="grid grid-cols-4 gap-2">
          <div>
            <label className={labelClass}>Icon</label>
            <input value={newService.icon} onChange={(e) => setNewService(p => ({ ...p, icon: e.target.value }))} className={inputClass} />
          </div>
          <div className="col-span-3">
            <label className={labelClass}>Name</label>
            <input value={newService.name} onChange={(e) => setNewService(p => ({ ...p, name: e.target.value }))} placeholder="Service name" className={inputClass} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Description</label>
          <textarea value={newService.description} onChange={(e) => setNewService(p => ({ ...p, description: e.target.value }))} rows={2} placeholder="Service description..." className={`${inputClass} resize-none`} />
        </div>
        <button onClick={handleAdd} className="px-4 py-1.5 bg-accent text-white rounded-lg font-body text-xs font-medium hover:opacity-90 transition-colors">
          Add Service
        </button>
      </div>
    </div>
  )
}

function ConditionsEditor() {
  const [conditions, setConditions] = useState<Condition[]>([])
  const [newCond, setNewCond] = useState({ name: '', icon: '🌿' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('conditions').select('*').order('sort_order')
    setConditions(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const handleUpdate = async (c: Condition) => {
    setSaving(c.id)
    await supabase.from('conditions').update({ name: c.name, icon: c.icon }).eq('id', c.id)
    setSaving(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this condition?')) return
    await supabase.from('conditions').delete().eq('id', id)
    load()
  }

  const handleAdd = async () => {
    if (!newCond.name) return
    await supabase.from('conditions').insert({ ...newCond, sort_order: conditions.length + 1 })
    setNewCond({ name: '', icon: '🌿' })
    load()
  }

  if (loading) return <p className="text-sage font-body text-sm">Loading conditions...</p>

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {conditions.map((c) => (
          <div key={c.id} className="bg-green-50/50 rounded-xl p-3 flex items-center gap-3">
            <input value={c.icon} onChange={(e) => setConditions(prev => prev.map(x => x.id === c.id ? { ...x, icon: e.target.value } : x))} className="w-14 px-2 py-1.5 rounded-lg border border-green-100 font-body text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <input value={c.name} onChange={(e) => setConditions(prev => prev.map(x => x.id === c.id ? { ...x, name: e.target.value } : x))} className={`${inputClass} flex-1`} />
            <button onClick={() => handleUpdate(c)} disabled={saving === c.id} className="px-3 py-1.5 bg-primary text-white rounded-lg font-body text-xs hover:bg-primaryDark transition-colors disabled:opacity-50">
              {saving === c.id ? '...' : 'Save'}
            </button>
            <button onClick={() => handleDelete(c.id)} className="px-3 py-1.5 bg-red-100 text-red-600 rounded-lg font-body text-xs hover:bg-red-200 transition-colors">✕</button>
          </div>
        ))}
      </div>
      <div className="border-2 border-dashed border-green-200 rounded-xl p-3 flex items-center gap-3">
        <input value={newCond.icon} onChange={(e) => setNewCond(p => ({ ...p, icon: e.target.value }))} className="w-14 px-2 py-1.5 rounded-lg border border-green-100 font-body text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="🌿" />
        <input value={newCond.name} onChange={(e) => setNewCond(p => ({ ...p, name: e.target.value }))} placeholder="Condition name" className={`${inputClass} flex-1`} />
        <button onClick={handleAdd} className="px-4 py-1.5 bg-accent text-white rounded-lg font-body text-xs font-medium hover:opacity-90 transition-colors">Add</button>
      </div>
    </div>
  )
}

function TestimonialsEditor() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [newT, setNewT] = useState({ quote: '', patient_name: '', city: '', stars: 5 })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false })
    setTestimonials(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const handleToggle = async (t: Testimonial) => {
    await supabase.from('testimonials').update({ is_active: !t.is_active }).eq('id', t.id)
    load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return
    await supabase.from('testimonials').delete().eq('id', id)
    load()
  }

  const handleUpdate = async (t: Testimonial) => {
    setSaving(t.id)
    await supabase.from('testimonials').update({ quote: t.quote, patient_name: t.patient_name, city: t.city, stars: t.stars }).eq('id', t.id)
    setSaving(null)
  }

  const handleAdd = async () => {
    if (!newT.quote || !newT.patient_name) return
    await supabase.from('testimonials').insert({ ...newT, is_active: true })
    setNewT({ quote: '', patient_name: '', city: '', stars: 5 })
    load()
  }

  if (loading) return <p className="text-sage font-body text-sm">Loading testimonials...</p>

  return (
    <div className="space-y-4">
      {testimonials.map((t) => (
        <div key={t.id} className={`rounded-xl p-4 border space-y-3 ${t.is_active ? 'bg-green-50/50 border-green-200' : 'bg-gray-50 border-gray-200 opacity-70'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-body font-semibold px-2 py-0.5 rounded-full ${t.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {t.is_active ? 'Active' : 'Hidden'}
              </span>
              <span className="text-xs font-body text-sage">⭐ {t.stars}/5</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleToggle(t)} className="px-3 py-1 text-xs font-body bg-white border border-green-200 rounded-lg hover:bg-green-50 transition-colors">
                {t.is_active ? 'Hide' : 'Show'}
              </button>
              <button onClick={() => handleDelete(t.id)} className="px-3 py-1 text-xs font-body bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors">Delete</button>
            </div>
          </div>
          <textarea value={t.quote} onChange={(e) => setTestimonials(prev => prev.map(x => x.id === t.id ? { ...x, quote: e.target.value } : x))} rows={2} className={`${inputClass} resize-none`} />
          <div className="grid grid-cols-3 gap-2">
            <input value={t.patient_name} onChange={(e) => setTestimonials(prev => prev.map(x => x.id === t.id ? { ...x, patient_name: e.target.value } : x))} placeholder="Patient name" className={inputClass} />
            <input value={t.city} onChange={(e) => setTestimonials(prev => prev.map(x => x.id === t.id ? { ...x, city: e.target.value } : x))} placeholder="City" className={inputClass} />
            <select value={t.stars} onChange={(e) => setTestimonials(prev => prev.map(x => x.id === t.id ? { ...x, stars: Number(e.target.value) } : x))} className={inputClass}>
              {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} Stars</option>)}
            </select>
          </div>
          <button onClick={() => handleUpdate(t)} disabled={saving === t.id} className="px-4 py-1.5 bg-primary text-white rounded-lg font-body text-xs font-medium hover:bg-primaryDark transition-colors disabled:opacity-50">
            {saving === t.id ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      ))}

      <div className="border-2 border-dashed border-green-200 rounded-xl p-4 space-y-3">
        <p className="font-body text-sm font-semibold text-primary">+ Add New Testimonial</p>
        <textarea value={newT.quote} onChange={(e) => setNewT(p => ({ ...p, quote: e.target.value }))} rows={2} placeholder="Patient quote..." className={`${inputClass} resize-none`} />
        <div className="grid grid-cols-3 gap-2">
          <input value={newT.patient_name} onChange={(e) => setNewT(p => ({ ...p, patient_name: e.target.value }))} placeholder="Patient name" className={inputClass} />
          <input value={newT.city} onChange={(e) => setNewT(p => ({ ...p, city: e.target.value }))} placeholder="City" className={inputClass} />
          <select value={newT.stars} onChange={(e) => setNewT(p => ({ ...p, stars: Number(e.target.value) }))} className={inputClass}>
            {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} Stars</option>)}
          </select>
        </div>
        <button onClick={handleAdd} className="px-4 py-1.5 bg-accent text-white rounded-lg font-body text-xs font-medium hover:opacity-90 transition-colors">
          Add Testimonial
        </button>
      </div>
    </div>
  )
}

function FAQEditor() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('faqs').select('*').order('sort_order')
    setFaqs(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const handleUpdate = async (f: FAQ) => {
    setSaving(f.id)
    await supabase.from('faqs').update({ question: f.question, answer: f.answer }).eq('id', f.id)
    setSaving(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this FAQ?')) return
    await supabase.from('faqs').delete().eq('id', id)
    load()
  }

  const handleAdd = async () => {
    if (!newFaq.question || !newFaq.answer) return
    await supabase.from('faqs').insert({ ...newFaq, sort_order: faqs.length + 1 })
    setNewFaq({ question: '', answer: '' })
    load()
  }

  if (loading) return <p className="text-sage font-body text-sm">Loading FAQs...</p>

  return (
    <div className="space-y-4">
      {faqs.map((f) => (
        <div key={f.id} className="bg-green-50/50 rounded-xl p-4 space-y-2">
          <div>
            <label className={labelClass}>Question</label>
            <input value={f.question} onChange={(e) => setFaqs(prev => prev.map(x => x.id === f.id ? { ...x, question: e.target.value } : x))} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Answer</label>
            <textarea value={f.answer} onChange={(e) => setFaqs(prev => prev.map(x => x.id === f.id ? { ...x, answer: e.target.value } : x))} rows={3} className={`${inputClass} resize-none`} />
          </div>
          <div className="flex gap-2">
            <button onClick={() => handleUpdate(f)} disabled={saving === f.id} className="px-4 py-1.5 bg-primary text-white rounded-lg font-body text-xs font-medium hover:bg-primaryDark transition-colors disabled:opacity-50">
              {saving === f.id ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => handleDelete(f.id)} className="px-4 py-1.5 bg-red-100 text-red-600 rounded-lg font-body text-xs font-medium hover:bg-red-200 transition-colors">Delete</button>
          </div>
        </div>
      ))}
      <div className="border-2 border-dashed border-green-200 rounded-xl p-4 space-y-2">
        <p className="font-body text-sm font-semibold text-primary">+ Add New FAQ</p>
        <div>
          <label className={labelClass}>Question</label>
          <input value={newFaq.question} onChange={(e) => setNewFaq(p => ({ ...p, question: e.target.value }))} placeholder="Enter question..." className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Answer</label>
          <textarea value={newFaq.answer} onChange={(e) => setNewFaq(p => ({ ...p, answer: e.target.value }))} rows={3} placeholder="Enter answer..." className={`${inputClass} resize-none`} />
        </div>
        <button onClick={handleAdd} className="px-4 py-1.5 bg-accent text-white rounded-lg font-body text-xs font-medium hover:opacity-90 transition-colors">
          Add FAQ
        </button>
      </div>
    </div>
  )
}

function AppointmentsViewer() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('appointments').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { setAppointments(data ?? []); setLoading(false) })
  }, [])

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('appointments').update({ status }).eq('id', id)
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a))
  }

  if (loading) return <p className="text-sage font-body text-sm">Loading appointments...</p>

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-green-100 text-green-700',
    completed: 'bg-blue-100 text-blue-700',
    cancelled: 'bg-red-100 text-red-600',
  }

  return (
    <div className="space-y-3">
      {appointments.length === 0 && (
        <p className="text-sage font-body text-sm text-center py-8">No appointments yet.</p>
      )}
      {appointments.map((a) => (
        <div key={a.id} className="bg-white rounded-xl border border-green-100 p-4 space-y-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-body font-semibold text-textMain text-sm">{a.name}</p>
              <p className="font-body text-sage text-xs">{a.service} · {a.preferred_date ?? 'Date TBD'}</p>
            </div>
            <select
              value={a.status}
              onChange={(e) => updateStatus(a.id, e.target.value)}
              className={`text-xs font-body font-medium px-2 py-1 rounded-full border-0 focus:outline-none cursor-pointer ${statusColors[a.status] ?? 'bg-gray-100 text-gray-600'}`}
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="flex flex-wrap gap-4 text-xs font-body text-sage">
            <span>📞 {a.phone}</span>
            <span>✉️ {a.email}</span>
            {a.message && <span className="truncate max-w-xs">💬 {a.message}</span>}
          </div>
          <p className="text-xs text-gray-400 font-body">{new Date(a.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
        </div>
      ))}
    </div>
  )
}

// ─── Main Admin Panel ────────────────────────────────────────────────────────

type AdminTab = 'hero' | 'stats' | 'services' | 'doctor' | 'conditions' | 'testimonials' | 'faqs' | 'contact' | 'appointments'

const tabs: { id: AdminTab; label: string; icon: string }[] = [
  { id: 'hero', label: 'Hero', icon: '🏠' },
  { id: 'stats', label: 'Stats', icon: '📊' },
  { id: 'services', label: 'Services', icon: '🌿' },
  { id: 'doctor', label: 'Doctor', icon: '👩‍⚕️' },
  { id: 'conditions', label: 'Conditions', icon: '🩺' },
  { id: 'testimonials', label: 'Testimonials', icon: '💬' },
  { id: 'faqs', label: 'FAQs', icon: '❓' },
  { id: 'contact', label: 'Contact', icon: '📍' },
  { id: 'appointments', label: 'Appointments', icon: '📅' },
]

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<AdminTab>('hero')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const renderContent = () => {
    switch (activeTab) {
      case 'hero': return <HeroEditor />
      case 'stats': return <StatsEditor />
      case 'services': return <ServicesEditor />
      case 'doctor': return <DoctorEditor />
      case 'conditions': return <ConditionsEditor />
      case 'testimonials': return <TestimonialsEditor />
      case 'faqs': return <FAQEditor />
      case 'contact': return <ContactEditor />
      case 'appointments': return <AppointmentsViewer />
    }
  }

  const currentTab = tabs.find((t) => t.id === activeTab)!

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-primaryDark text-white flex flex-col transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}>
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center">
              <span className="text-white text-sm font-bold font-display">AK</span>
            </div>
            <div>
              <p className="font-display font-bold text-white text-base">AK Ayurveda</p>
              <p className="text-green-300 text-xs font-body">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSidebarOpen(false) }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-body text-sm transition-all duration-150 ${
                activeTab === tab.id ? 'bg-white/20 text-white font-semibold' : 'text-green-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <a href="/" target="_blank" className="flex items-center gap-2 px-3 py-2 rounded-xl font-body text-xs text-green-300 hover:text-white hover:bg-white/10 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            View Website
          </a>
          <button onClick={onLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl font-body text-xs text-red-300 hover:text-red-200 hover:bg-red-900/20 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white border-b border-green-100 px-4 md:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-1.5 rounded-lg hover:bg-green-50 transition-colors">
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-base">{currentTab.icon}</span>
              <h1 className="font-display font-semibold text-primary text-base">{currentTab.label}</h1>
            </div>
          </div>
          <span className="font-body text-xs text-sage hidden sm:block">Changes save directly to Supabase</span>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto max-w-3xl">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}

// ─── Root ────────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem('ak_admin_auth') === '1') setAuthed(true)
  }, [])

  const handleLogin = () => setAuthed(true)
  const handleLogout = () => {
    sessionStorage.removeItem('ak_admin_auth')
    setAuthed(false)
  }

  if (!authed) return <LoginScreen onLogin={handleLogin} />
  return <AdminDashboard onLogout={handleLogout} />
}
