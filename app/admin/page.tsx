'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import {
  HeroContent, StatsContent, DoctorContent, ContactContent,
  Service, Condition, Testimonial, FAQ, Appointment, TimeSlot
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
      </div>
      <Field label="Opening Hours" name="hours" value={data.hours} onChange={handleChange} textarea rows={3} />
      <Field label="Google Maps Embed URL" name="map_url" value={data.map_url ?? ''} onChange={handleChange} />
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
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'basic'|'benefits'|'process'|'faqs'|'testimonial'|'trust'>('basic')
  const [saved, setSaved] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('services').select('*').order('sort_order')
    const list = (data ?? []) as Service[]
    setServices(list)
    setSelectedId(prev => prev ?? (list[0]?.id ?? null))
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const upd = (id: string, patch: Partial<Service>) =>
    setServices(prev => prev.map(x => x.id === id ? { ...x, ...patch } : x))

  const handleUpdate = async (service: Service) => {
    setSaving(service.id)
    await supabase.from('services').update({
      name: service.name, description: service.description, icon: service.icon,
      duration: service.duration ?? null, price_from: service.price_from ?? null,
      hero_image: service.hero_image ?? null,
      card_image: service.card_image ?? null,
      location: service.location ?? null, phone: service.phone ?? null,
      benefits: service.benefits ?? [], benefit_descriptions: service.benefit_descriptions ?? [],
      process: service.process ?? [], process_days: service.process_days ?? [],
      process_descriptions: service.process_descriptions ?? [],
      ideal_for: service.ideal_for ?? [], faqs: service.faqs ?? [],
      trust_stats: service.trust_stats ?? [],
      testimonial_quote: service.testimonial_quote ?? null,
      testimonial_name: service.testimonial_name ?? null,
      testimonial_location: service.testimonial_location ?? null,
      testimonial_stars: service.testimonial_stars ?? 5,
      testimonials: service.testimonials ?? [],
      pricing: service.pricing ?? [],
    }).eq('id', service.id)
    setSaving(null); setSaved(true); setTimeout(() => setSaved(false), 2000)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this service?')) return
    await supabase.from('services').delete().eq('id', id)
    setSelectedId(null); load()
  }

  const handleAdd = async () => {
    if (!newService.name) return
    const { data } = await supabase.from('services').insert({ ...newService, sort_order: services.length + 1 }).select().single()
    setNewService({ name: '', description: '', icon: '🌿' })
    await load()
    if (data) setSelectedId(data.id)
  }

  if (loading) return <p className="text-sage font-body text-sm">Loading services...</p>

  const s = services.find(x => x.id === selectedId)
  const TABS = [
    { key: 'basic', label: '📝 Basic Info' },
    { key: 'benefits', label: '✅ Benefits' },
    { key: 'process', label: '🔄 Process' },
    { key: 'faqs', label: '❓ FAQs' },
    { key: 'testimonial', label: '💬 Testimonial' },
    { key: 'trust', label: '📊 Trust Stats' },
  ] as const

  return (
    <div className="space-y-4">
      {/* Service selector */}
      <div className="flex gap-2 flex-wrap items-center">
        {services.map(sv => (
          <button key={sv.id} onClick={() => { setSelectedId(sv.id); setActiveTab('basic') }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${selectedId === sv.id ? 'bg-primary text-white' : 'bg-green-50 text-primary hover:bg-green-100'}`}>
            {sv.icon} {sv.name}
          </button>
        ))}
        <button onClick={() => setSelectedId('new')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${selectedId === 'new' ? 'bg-accent text-white' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'}`}>
          + New Service
        </button>
      </div>

      {/* Add new */}
      {selectedId === 'new' && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 space-y-3">
          <p className="font-body text-sm font-semibold text-amber-800">New Service</p>
          <div className="grid grid-cols-5 gap-3">
            <div>
              <label className={labelClass}>Icon</label>
              <input value={newService.icon} onChange={e => setNewService(p => ({ ...p, icon: e.target.value }))} className={inputClass} />
            </div>
            <div className="col-span-4">
              <label className={labelClass}>Name</label>
              <input value={newService.name} onChange={e => setNewService(p => ({ ...p, name: e.target.value }))} placeholder="Service name" className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <textarea value={newService.description} onChange={e => setNewService(p => ({ ...p, description: e.target.value }))} rows={2} className={`${inputClass} resize-none`} placeholder="Brief description..." />
          </div>
          <button onClick={handleAdd} className="px-5 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:opacity-90">Add Service</button>
        </div>
      )}

      {/* Edit selected service */}
      {s && (
        <div className="bg-white border border-green-100 rounded-2xl overflow-hidden shadow-sm">
          {/* Header */}
          <div className="bg-primary/5 border-b border-green-100 px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{s.icon}</span>
              <div>
                <p className="font-display font-semibold text-primary text-base">{s.name}</p>
                <p className="text-xs text-sage">
                  {s.pricing && s.pricing.length > 0
                    ? `${s.pricing.length} pricing option${s.pricing.length > 1 ? 's' : ''} · from ${s.pricing[0].p}`
                    : (s.duration ?? 'Duration not set') + ' · ' + (s.price_from ?? 'Price not set')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {saved && <span className="text-xs text-green-600 font-medium">✓ Saved!</span>}
              <button onClick={() => handleUpdate(s)} disabled={saving === s.id}
                className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primaryDark disabled:opacity-50 transition-colors">
                {saving === s.id ? 'Saving...' : 'Save Changes'}
              </button>
              <button onClick={() => handleDelete(s.id)}
                className="px-3 py-2 bg-red-50 text-red-500 rounded-lg text-sm hover:bg-red-100 transition-colors">
                Delete
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-green-100 overflow-x-auto">
            {TABS.map(t => (
              <button key={t.key} onClick={() => setActiveTab(t.key)}
                className={`px-4 py-3 text-xs font-semibold whitespace-nowrap transition-colors ${activeTab === t.key ? 'border-b-2 border-primary text-primary bg-white' : 'text-sage hover:text-primary hover:bg-green-50'}`}>
                {t.label}
              </button>
            ))}
          </div>

          <div className="p-5 space-y-4">

            {/* ── BASIC INFO ── */}
            {activeTab === 'basic' && (
              <div className="space-y-4">
                <div className="grid grid-cols-5 gap-3">
                  <div>
                    <label className={labelClass}>Icon</label>
                    <input value={s.icon} onChange={e => upd(s.id, { icon: e.target.value })} className={inputClass} />
                  </div>
                  <div className="col-span-4">
                    <label className={labelClass}>Name</label>
                    <input value={s.name} onChange={e => upd(s.id, { name: e.target.value })} className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Description</label>
                  <textarea value={s.description} onChange={e => upd(s.id, { description: e.target.value })} rows={3} className={`${inputClass} resize-none`} />
                </div>
                {/* ── PRICING OPTIONS EDITOR ── */}
                <div>
                  <label className={labelClass}>Pricing Options</label>
                  <p className="text-xs text-gray-400 mb-2">Each option is a duration + price pair shown as selectable cards on the treatment page.</p>
                  <div className="space-y-2">
                    {((s.pricing ?? []) as {d:string;p:string}[]).map((opt, i) => (
                      <div key={i} className="flex gap-2 items-center">
                        <select
                          value={opt.d}
                          onChange={e => {
                            const n = [...((s.pricing ?? []) as {d:string;p:string}[])]
                            n[i] = { ...n[i], d: e.target.value }
                            upd(s.id, { pricing: n })
                          }}
                          className={`${inputClass} flex-1`}
                        >
                          <option value="">Select duration</option>
                          {['30 min','45 min','60 min','75 min','90 min'].map(d => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                        <input
                          value={opt.p}
                          onChange={e => {
                            const n = [...((s.pricing ?? []) as {d:string;p:string}[])]
                            n[i] = { ...n[i], p: e.target.value }
                            upd(s.id, { pricing: n })
                          }}
                          placeholder="£40"
                          className={`${inputClass} w-28`}
                        />
                        <button
                          onClick={() => {
                            const n = [...((s.pricing ?? []) as {d:string;p:string}[])]
                            n.splice(i, 1)
                            upd(s.id, { pricing: n })
                          }}
                          className="px-2 py-1.5 text-xs bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors shrink-0"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    {((s.pricing ?? []) as {d:string;p:string}[]).length < 3 && (
                      <button
                        onClick={() => upd(s.id, { pricing: [...((s.pricing ?? []) as {d:string;p:string}[]), { d: '', p: '' }] })}
                        className="w-full py-2 border-2 border-dashed border-green-200 text-primary text-xs rounded-xl hover:bg-green-50 transition-colors"
                      >
                        + Add Duration Option
                      </button>
                    )}
                    {((s.pricing ?? []) as {d:string;p:string}[]).length >= 3 && (
                      <p className="text-xs text-sage text-center py-1">Maximum 3 options reached</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className={labelClass}>Location</label>
                    <input value={s.location ?? ''} onChange={e => upd(s.id, { location: e.target.value })} placeholder="e.g. Gurugram Clinic" className={inputClass} /></div>
                  <div><label className={labelClass}>Phone</label>
                    <input value={s.phone ?? ''} onChange={e => upd(s.id, { phone: e.target.value })} placeholder="+91 98765 43210" className={inputClass} /></div>
                </div>
                <div>
                  <label className={labelClass}>Hero Image URL <span className="text-gray-400 font-normal">(treatment detail page background)</span></label>
                  <input value={s.hero_image ?? ''} onChange={e => upd(s.id, { hero_image: e.target.value })} placeholder="https://images.unsplash.com/photo-...?w=1200&q=80" className={inputClass} />
                  {s.hero_image && (
                    <div className="mt-2 rounded-xl overflow-hidden border border-green-100" style={{ height: 100 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={s.hero_image} alt="Hero preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                </div>
                <div>
                  <label className={labelClass}>Card Image URL <span className="text-gray-400 font-normal">(subtle background on homepage service cards)</span></label>
                  <input value={s.card_image ?? ''} onChange={e => upd(s.id, { card_image: e.target.value })} placeholder="https://images.unsplash.com/photo-...?w=800&q=80" className={inputClass} />
                  {s.card_image && (
                    <div className="mt-2 rounded-xl overflow-hidden border border-green-100" style={{ height: 80 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={s.card_image} alt="Card preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                </div>
                <div>
                  <label className={labelClass}>Ideal For (one condition per line)</label>
                  <textarea value={(s.ideal_for ?? []).join('\n')} onChange={e => upd(s.id, { ideal_for: e.target.value.split('\n').map(l => l.trim()).filter(Boolean) })} rows={3} placeholder="Stress & anxiety&#10;Insomnia&#10;Chronic fatigue" className={`${inputClass}`} style={{resize:'vertical'}} />
                </div>
              </div>
            )}

            {/* ── BENEFITS ── */}
            {activeTab === 'benefits' && (
              <div className="space-y-3">
                <p className="text-xs text-sage">Each benefit has a title and a description shown below it on the page.</p>
                {(s.benefits ?? []).map((b, i) => (
                  <div key={i} className="bg-green-50/60 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-primary">Benefit {i + 1}</span>
                      <button onClick={() => {
                        const nb = [...(s.benefits ?? [])]; nb.splice(i, 1)
                        const nd = [...(s.benefit_descriptions ?? [])]; nd.splice(i, 1)
                        upd(s.id, { benefits: nb, benefit_descriptions: nd })
                      }} className="text-xs text-red-400 hover:text-red-600">✕ Remove</button>
                    </div>
                    <input value={b} onChange={e => { const n = [...(s.benefits ?? [])]; n[i] = e.target.value; upd(s.id, { benefits: n }) }}
                      placeholder="Benefit title" className={inputClass} />
                    <textarea value={(s.benefit_descriptions ?? [])[i] ?? ''} onChange={e => { const n = [...(s.benefit_descriptions ?? [])]; n[i] = e.target.value; upd(s.id, { benefit_descriptions: n }) }}
                      rows={2} placeholder="Brief description of this benefit..." className={`${inputClass} resize-none`} />
                  </div>
                ))}
                <button onClick={() => upd(s.id, { benefits: [...(s.benefits ?? []), ''], benefit_descriptions: [...(s.benefit_descriptions ?? []), ''] })}
                  className="w-full py-2.5 border-2 border-dashed border-green-200 text-primary text-sm rounded-xl hover:bg-green-50 transition-colors">
                  + Add Benefit
                </button>
              </div>
            )}

            {/* ── PROCESS ── */}
            {activeTab === 'process' && (
              <div className="space-y-3">
                <p className="text-xs text-sage">Each step shows a day/period label, a title, and a description in a timeline.</p>
                {(s.process ?? []).map((step, i) => (
                  <div key={i} className="bg-green-50/60 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-primary">Step {i + 1}</span>
                      <button onClick={() => {
                        const np = [...(s.process ?? [])]; np.splice(i, 1)
                        const nd = [...(s.process_days ?? [])]; nd.splice(i, 1)
                        const ndd = [...(s.process_descriptions ?? [])]; ndd.splice(i, 1)
                        upd(s.id, { process: np, process_days: nd, process_descriptions: ndd })
                      }} className="text-xs text-red-400 hover:text-red-600">✕ Remove</button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <input value={(s.process_days ?? [])[i] ?? ''} onChange={e => { const n = [...(s.process_days ?? [])]; n[i] = e.target.value; upd(s.id, { process_days: n }) }}
                        placeholder="Days 1–2" className={inputClass} />
                      <input value={step} onChange={e => { const n = [...(s.process ?? [])]; n[i] = e.target.value; upd(s.id, { process: n }) }}
                        placeholder="Step title" className={`${inputClass} col-span-2`} />
                    </div>
                    <textarea value={(s.process_descriptions ?? [])[i] ?? ''} onChange={e => { const n = [...(s.process_descriptions ?? [])]; n[i] = e.target.value; upd(s.id, { process_descriptions: n }) }}
                      rows={2} placeholder="What happens during this step..." className={`${inputClass} resize-none`} />
                  </div>
                ))}
                <button onClick={() => upd(s.id, { process: [...(s.process ?? []), ''], process_days: [...(s.process_days ?? []), ''], process_descriptions: [...(s.process_descriptions ?? []), ''] })}
                  className="w-full py-2.5 border-2 border-dashed border-green-200 text-primary text-sm rounded-xl hover:bg-green-50 transition-colors">
                  + Add Step
                </button>
              </div>
            )}

            {/* ── FAQs (per-service) ── */}
            {activeTab === 'faqs' && (
              <div className="space-y-3">
                <p className="text-xs text-sage">Add frequently asked questions specific to this treatment. These appear in an accordion on the service detail page.</p>
                {((s.faqs ?? []) as {q:string;a:string}[]).map((faq, i) => {
                  const faqList = (s.faqs ?? []) as {q:string;a:string}[]
                  const updFaq = (patch: Partial<{q:string;a:string}>) => {
                    const n = [...faqList]; n[i] = { ...n[i], ...patch }; upd(s.id, { faqs: n })
                  }
                  return (
                    <div key={i} className="bg-green-50/60 rounded-xl border border-green-100 overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-2 bg-green-100/50">
                        <span className="text-xs font-semibold text-primary">FAQ {i + 1}</span>
                        <button
                          onClick={() => { const n = [...faqList]; n.splice(i, 1); upd(s.id, { faqs: n }) }}
                          className="text-xs text-red-400 hover:text-red-600 font-medium">✕ Remove</button>
                      </div>
                      <div className="p-4 space-y-2">
                        <div>
                          <label className={labelClass}>Question</label>
                          <input value={faq.q} onChange={e => updFaq({ q: e.target.value })}
                            placeholder="What should I expect during the session?"
                            className={inputClass} />
                        </div>
                        <div>
                          <label className={labelClass}>Answer</label>
                          <textarea value={faq.a} onChange={e => updFaq({ a: e.target.value })}
                            rows={3} placeholder="Describe the answer in detail..."
                            className={`${inputClass} resize-none`} />
                        </div>
                      </div>
                    </div>
                  )
                })}
                <button
                  onClick={() => upd(s.id, { faqs: [...((s.faqs ?? []) as {q:string;a:string}[]), { q: '', a: '' }] })}
                  className="w-full py-2.5 border-2 border-dashed border-green-200 text-primary text-sm rounded-xl hover:bg-green-50 transition-colors">
                  + Add FAQ
                </button>
              </div>
            )}

            {/* ── TESTIMONIAL ── */}
            {activeTab === 'testimonial' && (
              <div className="space-y-3">
                <p className="text-xs text-sage">Add multiple patient testimonials — sab page pe dikhenge.</p>
                {((s.testimonials ?? []) as {quote:string;name:string;location?:string;stars:number}[]).map((t, i) => {
                  const tList = (s.testimonials ?? []) as {quote:string;name:string;location?:string;stars:number}[]
                  const updT = (patch: Partial<typeof t>) => {
                    const n = [...tList]; n[i] = { ...n[i], ...patch }; upd(s.id, { testimonials: n })
                  }
                  return (
                  <div key={i} className="bg-amber-50/60 rounded-xl border border-amber-100 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2 bg-amber-100/50">
                      <span className="text-xs font-semibold text-amber-800">Testimonial {i + 1}</span>
                      <button onClick={() => { const n = [...tList]; n.splice(i,1); upd(s.id,{testimonials:n}) }}
                        className="text-xs text-red-400 hover:text-red-600 font-medium">✕ Remove</button>
                    </div>
                    <div className="p-4 space-y-3">
                      <div>
                        <label className={labelClass}>Patient Quote</label>
                        <textarea value={t.quote} onChange={e => updT({quote: e.target.value})}
                          rows={3} placeholder="I came in skeptical and exhausted after years of misdiagnosed fatigue..."
                          className={`${inputClass} resize-none`} />
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className={labelClass}>Name</label>
                          <input value={t.name} onChange={e => updT({name: e.target.value})} placeholder="Meera Kapoor" className={inputClass} />
                        </div>
                        <div>
                          <label className={labelClass}>City</label>
                          <input value={t.location ?? ''} onChange={e => updT({location: e.target.value})} placeholder="Gurugram" className={inputClass} />
                        </div>
                        <div>
                          <label className={labelClass}>Rating</label>
                          <select value={t.stars} onChange={e => updT({stars: Number(e.target.value)})} className={inputClass}>
                            {[5,4,3,2,1].map(v => <option key={v} value={v}>{'★'.repeat(v)} ({v} stars)</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )})}
                <button onClick={() => upd(s.id, { testimonials: [...((s.testimonials ?? []) as {quote:string;name:string;location?:string;stars:number}[]), { quote: '', name: '', location: '', stars: 5 }] })}
                  className="w-full py-2.5 border-2 border-dashed border-amber-200 text-amber-700 text-sm rounded-xl hover:bg-amber-50 transition-colors">
                  + Add Testimonial
                </button>
              </div>
            )}

            {/* ── TRUST STATS ── */}
            {activeTab === 'trust' && (
              <div className="space-y-3">
                <p className="text-xs text-sage">These appear in the dark green trust strip below the hero. Max 4 stats recommended.</p>
                {(s.trust_stats ?? []).map((stat, i) => (
                  <div key={i} className="bg-green-50/60 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-primary">Stat {i + 1}</span>
                      <button onClick={() => { const n = [...(s.trust_stats ?? [])]; n.splice(i, 1); upd(s.id, { trust_stats: n }) }}
                        className="text-xs text-red-400 hover:text-red-600">✕ Remove</button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input value={stat.num} onChange={e => { const n = [...(s.trust_stats ?? [])]; n[i] = { ...n[i], num: e.target.value }; upd(s.id, { trust_stats: n }) }}
                        placeholder="27+" className={inputClass} />
                      <input value={stat.label} onChange={e => { const n = [...(s.trust_stats ?? [])]; n[i] = { ...n[i], label: e.target.value }; upd(s.id, { trust_stats: n }) }}
                        placeholder="Years of Practice" className={inputClass} />
                    </div>
                  </div>
                ))}
                <button onClick={() => upd(s.id, { trust_stats: [...(s.trust_stats ?? []), { num: '', label: '' }] })}
                  className="w-full py-2.5 border-2 border-dashed border-green-200 text-primary text-sm rounded-xl hover:bg-green-50 transition-colors">
                  + Add Stat
                </button>
              </div>
            )}

            {/* Save button bottom */}
            <div className="pt-2 border-t border-green-100 flex items-center gap-3">
              <button onClick={() => handleUpdate(s)} disabled={saving === s.id}
                className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primaryDark disabled:opacity-50 transition-colors">
                {saving === s.id ? 'Saving...' : '💾 Save Changes'}
              </button>
              {saved && <span className="text-sm text-green-600 font-medium">✓ Saved successfully!</span>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

interface ConditionItem {
  emoji: string
  label: string
  image_url?: string | null
}

const defaultConditionItems: ConditionItem[] = [
  { emoji: '😓', label: 'Stress & Anxiety' },
  { emoji: '💤', label: 'Insomnia & Poor Sleep' },
  { emoji: '🔥', label: 'Digestive Issues' },
  { emoji: '🦴', label: 'Joint Pain & Stiffness' },
  { emoji: '🧠', label: 'Mental Fatigue' },
  { emoji: '💆', label: 'Chronic Headaches' },
  { emoji: '⚡', label: 'Low Energy & Fatigue' },
  { emoji: '🌸', label: 'Skin Conditions' },
  { emoji: '⚖️', label: 'Weight Imbalance' },
  { emoji: '🌬️', label: 'Respiratory Issues' },
  { emoji: '💪', label: 'Muscle Tension' },
  { emoji: '🩺', label: 'Hormonal Imbalance' },
]

function ConditionsEditor() {
  const [conditions, setConditions] = useState<ConditionItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('site_content').select('content').eq('key', 'conditions').single()
    if (data?.content && Array.isArray(data.content)) {
      setConditions(data.content as ConditionItem[])
    } else {
      setConditions(defaultConditionItems)
    }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const updateItem = (index: number, patch: Partial<ConditionItem>) => {
    setConditions(prev => prev.map((c, i) => i === index ? { ...c, ...patch } : c))
  }

  const deleteItem = (index: number) => {
    setConditions(prev => prev.filter((_, i) => i !== index))
  }

  const addItem = () => {
    setConditions(prev => [...prev, { emoji: '🌿', label: '', image_url: '' }])
  }

  const handleSave = async () => {
    setSaveStatus('saving')
    const payload = conditions.map(c => ({
      emoji: c.emoji,
      label: c.label,
      image_url: c.image_url || null,
    }))
    const { error } = await supabase.from('site_content').upsert(
      { key: 'conditions', content: payload },
      { onConflict: 'key' }
    )
    if (error) {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
    } else {
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2000)
    }
  }

  if (loading) return <p className="text-sage font-body text-sm">Loading conditions...</p>

  const saveBtnLabel = { idle: '💾 Save Conditions', saving: 'Saving...', saved: '✓ Saved!', error: '✗ Error — Retry' }[saveStatus]
  const saveBtnClass = {
    idle: 'bg-primary hover:bg-primaryDark text-white',
    saving: 'opacity-60 cursor-not-allowed bg-primary text-white',
    saved: 'bg-green-600 text-white',
    error: 'bg-red-500 text-white',
  }[saveStatus]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="font-body text-xs font-semibold text-sage uppercase tracking-wide">{conditions.length} Conditions</p>
        <div className="flex gap-2">
          <button
            onClick={addItem}
            className="px-4 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-xs font-medium hover:bg-amber-100 transition-colors"
          >
            + Add Condition
          </button>
          <button
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
            className={`px-5 py-1.5 rounded-lg font-body font-medium text-sm transition-all duration-200 ${saveBtnClass}`}
          >
            {saveBtnLabel}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {conditions.map((c, i) => (
          <div key={i} className="bg-green-50/50 rounded-xl border border-green-100 p-4 space-y-3">
            <div className="flex items-center gap-3">
              {/* Emoji */}
              <div>
                <label className={labelClass}>Emoji</label>
                <input
                  value={c.emoji}
                  onChange={e => updateItem(i, { emoji: e.target.value })}
                  className="px-2 py-1.5 rounded-lg border border-green-100 font-body text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary/30"
                  style={{ width: 52 }}
                />
              </div>
              {/* Label */}
              <div className="flex-1">
                <label className={labelClass}>Label</label>
                <input
                  value={c.label}
                  onChange={e => updateItem(i, { label: e.target.value })}
                  placeholder="Condition name"
                  className={inputClass}
                />
              </div>
              {/* Delete */}
              <button
                onClick={() => deleteItem(i)}
                className="mt-5 px-3 py-1.5 bg-red-100 text-red-600 rounded-lg font-body text-xs hover:bg-red-200 transition-colors shrink-0"
              >
                ✕
              </button>
            </div>
            {/* Image URL */}
            <div>
              <label className={labelClass}>Image URL <span className="font-normal text-gray-400">(optional — shows image card instead of emoji chip)</span></label>
              <input
                value={c.image_url ?? ''}
                onChange={e => updateItem(i, { image_url: e.target.value || null })}
                placeholder="https://images.unsplash.com/..."
                className={inputClass}
              />
              {c.image_url && (
                <div className="mt-2 rounded-xl overflow-hidden border border-green-100" style={{ height: 50, width: 80 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.image_url} alt={c.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom save button */}
      <div className="pt-2 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saveStatus === 'saving'}
          className={`px-6 py-2.5 rounded-xl font-body font-medium text-sm transition-all duration-200 ${saveBtnClass}`}
        >
          {saveBtnLabel}
        </button>
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

function fmtAdminSlotTime(t: string) {
  const [h, m] = t.split(':').map(Number)
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`
}

function AppointmentsViewer() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAppointments = () => {
    setLoading(true)
    supabase
      .from('appointments')
      .select('*, slot:time_slots(date, start_time, end_time)')
      .order('created_at', { ascending: false })
      .then(({ data }) => { setAppointments((data ?? []) as Appointment[]); setLoading(false) })
  }

  useEffect(() => { fetchAppointments() }, [])

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('appointments').update({ status }).eq('id', id)
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a))
  }

  const deleteAppointment = async (id: string, name: string) => {
    if (!confirm(`Delete booking by "${name}"? This cannot be undone.`)) return
    await supabase.from('appointments').delete().eq('id', id)
    setAppointments(prev => prev.filter(a => a.id !== id))
  }

  if (loading) return <p className="text-sage font-body text-sm">Loading appointments...</p>

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-green-100 text-green-700',
    completed: 'bg-blue-100 text-blue-700',
    cancelled: 'bg-red-100 text-red-600',
  }

  const pendingCount = appointments.filter(a => !a.status || a.status === 'pending').length

  return (
    <div className="space-y-3">
      {/* Header with count + refresh */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="font-body text-sm text-gray-500">{appointments.length} total bookings</span>
          {pendingCount > 0 && (
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-white text-xs font-bold" style={{ background: '#D4A853' }}>{pendingCount}</span>
          )}
        </div>
        <button
          onClick={fetchAppointments}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition"
          style={{ color: '#1B6E5C', borderColor: '#D0EDE6', background: '#F0FAF7' }}
        >
          🔄 Refresh
        </button>
      </div>
      {appointments.length === 0 && (
        <p className="text-sage font-body text-sm text-center py-8">No appointments yet.</p>
      )}
      {appointments.map((a) => (
        <div key={a.id} className="bg-white rounded-xl border border-green-100 p-4 space-y-2">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="font-body font-semibold text-textMain text-sm">{a.name}</p>
              <div className="flex flex-wrap items-center gap-1.5 mt-1">
                <span className="font-body text-sage text-xs">{a.service}</span>
                {/* Duration & Price badges — only shown when set */}
                {a.selected_duration && (
                  <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                    ⏱ {a.selected_duration}
                  </span>
                )}
                {a.selected_price && (
                  <span className="inline-flex items-center gap-1 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                    {a.selected_price}
                  </span>
                )}
                {/* Slot date & time (from time_slots FK join) */}
                {a.slot ? (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    background: '#EFF6FF', border: '1px solid #BFDBFE',
                    color: '#1D4ED8', fontSize: 11, fontWeight: 700,
                    padding: '2px 8px', borderRadius: 999,
                  }}>
                    🕐 {new Date(a.slot.date + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} · {fmtAdminSlotTime(a.slot.start_time)}–{fmtAdminSlotTime(a.slot.end_time)}
                  </span>
                ) : (
                  <span className="text-sage text-xs">· {a.preferred_date ?? 'Date TBD'}</span>
                )}
              </div>
            </div>
            <select
              value={a.status}
              onChange={(e) => updateStatus(a.id, e.target.value)}
              className={`text-xs font-body font-medium px-2 py-1 rounded-full border-0 focus:outline-none cursor-pointer shrink-0 ${statusColors[a.status] ?? 'bg-gray-100 text-gray-600'}`}
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button
              onClick={() => deleteAppointment(a.id, a.name)}
              className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full transition hover:bg-red-50"
              title="Delete booking"
              style={{ color: '#ef4444' }}
            >
              🗑️
            </button>
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

// ─── Blog Editor ─────────────────────────────────────────────────────────────

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  image_url: string
  category: string
  published: boolean
  published_at: string | null
  created_at: string
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

const emptyBlog = (): Omit<BlogPost, 'id' | 'created_at'> => ({
  title: '', slug: '', excerpt: '', content: '', image_url: '', category: '', published: false, published_at: null,
})

function BlogEditor() {
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<string | null>(null) // 'new' | id
  const [form, setForm] = useState(emptyBlog())
  const [saving, setSaving] = useState(false)
  const [savedMsg, setSavedMsg] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('blogs').select('*').order('created_at', { ascending: false })
    setBlogs((data ?? []) as BlogPost[])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const selectBlog = (b: BlogPost) => {
    setSelected(b.id)
    setForm({
      title: b.title, slug: b.slug, excerpt: b.excerpt ?? '', content: b.content ?? '',
      image_url: b.image_url ?? '', category: b.category ?? '', published: b.published,
      published_at: b.published_at,
    })
  }

  const newBlog = () => {
    setSelected('new')
    setForm(emptyBlog())
  }

  const handleTitleChange = (title: string) => {
    setForm(f => ({ ...f, title, slug: selected === 'new' ? slugify(title) : f.slug }))
  }

  const handleSave = async () => {
    if (!form.title.trim()) return
    setSaving(true)
    const payload = {
      title: form.title, slug: form.slug || slugify(form.title),
      excerpt: form.excerpt, content: form.content,
      image_url: form.image_url || null, category: form.category || null,
      published: form.published,
      published_at: form.published ? (form.published_at || new Date().toISOString()) : null,
    }
    if (selected === 'new') {
      await supabase.from('blogs').insert(payload)
    } else {
      await supabase.from('blogs').update(payload).eq('id', selected)
    }
    setSaving(false)
    setSavedMsg('✓ Saved!')
    setTimeout(() => setSavedMsg(''), 2000)
    await load()
    if (selected === 'new') setSelected(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this blog post permanently?')) return
    await supabase.from('blogs').delete().eq('id', id)
    if (selected === id) { setSelected(null); setForm(emptyBlog()) }
    load()
  }

  const togglePublish = async (b: BlogPost) => {
    const newPub = !b.published
    await supabase.from('blogs').update({
      published: newPub,
      published_at: newPub ? (b.published_at || new Date().toISOString()) : null,
    }).eq('id', b.id)
    load()
  }

  if (loading) return <p className="text-sage font-body text-sm">Loading blogs...</p>

  return (
    <div className="space-y-4">
      {/* Blog list */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="font-body text-xs font-semibold text-sage uppercase tracking-wide">{blogs.length} Posts</p>
          <button onClick={newBlog}
            className="px-4 py-1.5 bg-accent text-white rounded-lg text-xs font-medium hover:opacity-90 transition-colors">
            + New Post
          </button>
        </div>
        {blogs.length === 0 && selected !== 'new' && (
          <p className="text-sage text-sm text-center py-8">No blog posts yet. Create your first!</p>
        )}
        {blogs.map(b => (
          <div key={b.id}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 border cursor-pointer transition-all ${selected === b.id ? 'bg-primary/5 border-primary/20' : 'bg-white border-green-100 hover:border-green-200'}`}
            onClick={() => selectBlog(b)}>
            <div className="flex-1 min-w-0">
              <p className="font-body text-sm font-semibold text-primary truncate">{b.title || 'Untitled'}</p>
              <p className="text-xs text-sage truncate">/{b.slug}</p>
            </div>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${b.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
              {b.published ? 'Live' : 'Draft'}
            </span>
            <button onClick={(e) => { e.stopPropagation(); togglePublish(b) }}
              className="text-xs px-2 py-1 rounded-lg bg-white border border-green-100 hover:bg-green-50 text-sage transition-colors shrink-0">
              {b.published ? 'Unpublish' : 'Publish'}
            </button>
            <button onClick={(e) => { e.stopPropagation(); handleDelete(b.id) }}
              className="text-xs px-2 py-1 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors shrink-0">✕</button>
          </div>
        ))}
      </div>

      {/* Editor */}
      {selected && (
        <div className="bg-white border border-green-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="bg-primary/5 border-b border-green-100 px-5 py-4 flex items-center justify-between">
            <p className="font-display font-semibold text-primary">{selected === 'new' ? 'New Post' : 'Edit Post'}</p>
            <div className="flex items-center gap-3">
              {savedMsg && <span className="text-xs text-green-600 font-medium">{savedMsg}</span>}
              <button onClick={handleSave} disabled={saving}
                className="px-5 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primaryDark disabled:opacity-50 transition-colors">
                {saving ? 'Saving...' : '💾 Save'}
              </button>
            </div>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <label className={labelClass}>Title</label>
              <input value={form.title} onChange={e => handleTitleChange(e.target.value)} placeholder="Article title..." className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Slug (URL)</label>
                <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="auto-generated" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Category</label>
                <input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} placeholder="e.g. Wellness, Treatments" className={inputClass} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Excerpt</label>
              <textarea value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} rows={2} placeholder="Short summary shown on card..." className={`${inputClass} resize-none`} />
            </div>
            <div>
              <label className={labelClass}>Image URL</label>
              <input value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} placeholder="https://..." className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Content (HTML or plain text)</label>
              <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} rows={10} placeholder="Write your article content here..." className={`${inputClass} resize-y`} />
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setForm(f => ({ ...f, published: !f.published }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.published ? 'bg-primary' : 'bg-gray-200'}`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${form.published ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
              <span className="font-body text-sm text-textMain">{form.published ? '✅ Published (Live)' : '📝 Draft (Hidden)'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Reviews Viewer ───────────────────────────────────────────────────────────

interface Review {
  id: string
  service_name: string
  name: string
  location?: string
  quote: string
  stars: number
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

function ReviewsViewer() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending')
  const [acting, setActing] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('reviews').select('*').order('created_at', { ascending: false })
    setReviews((data ?? []) as Review[])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const setStatus = async (id: string, status: 'approved' | 'rejected') => {
    setActing(id)
    await supabase.from('reviews').update({ status }).eq('id', id)
    await load()
    setActing(null)
  }

  const deleteReview = async (id: string) => {
    if (!confirm('Delete this review permanently?')) return
    await supabase.from('reviews').delete().eq('id', id)
    await load()
  }

  const filtered = filter === 'all' ? reviews : reviews.filter(r => r.status === filter)
  const counts = {
    pending: reviews.filter(r => r.status === 'pending').length,
    approved: reviews.filter(r => r.status === 'approved').length,
    rejected: reviews.filter(r => r.status === 'rejected').length,
  }

  if (loading) return <p className="text-sage font-body text-sm">Loading reviews...</p>

  return (
    <div className="space-y-4">
      {/* Filter tabs */}
      <div className="flex gap-2">
        {(['pending', 'approved', 'rejected', 'all'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors capitalize ${filter === f ? 'bg-primary text-white' : 'bg-green-50 text-primary hover:bg-green-100'}`}>
            {f} {f !== 'all' && counts[f] > 0 && <span className="ml-1 bg-white/30 px-1.5 py-0.5 rounded-full">{counts[f]}</span>}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-sage text-sm text-center py-8">No {filter} reviews yet.</p>
      )}

      {filtered.map(r => (
        <div key={r.id} className={`rounded-xl border p-4 space-y-3 ${r.status === 'pending' ? 'bg-amber-50 border-amber-200' : r.status === 'approved' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-100'}`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm text-primary">{r.name}</span>
                {r.location && <span className="text-xs text-sage">· {r.location}</span>}
                <span className="text-amber-500 text-xs">{'★'.repeat(r.stars)}</span>
              </div>
              <span className="text-xs text-sage bg-white px-2 py-0.5 rounded-full border border-green-100">{r.service_name}</span>
            </div>
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${r.status === 'pending' ? 'bg-amber-100 text-amber-700' : r.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
              {r.status}
            </span>
          </div>
          <p className="text-sm text-gray-700 italic leading-relaxed">&ldquo;{r.quote}&rdquo;</p>
          <div className="flex gap-2">
            {r.status !== 'approved' && (
              <button onClick={() => setStatus(r.id, 'approved')} disabled={acting === r.id}
                className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primaryDark disabled:opacity-50 transition-colors">
                ✓ Approve
              </button>
            )}
            {r.status !== 'rejected' && (
              <button onClick={() => setStatus(r.id, 'rejected')} disabled={acting === r.id}
                className="px-3 py-1.5 bg-red-100 text-red-600 rounded-lg text-xs font-medium hover:bg-red-200 disabled:opacity-50 transition-colors">
                ✕ Reject
              </button>
            )}
            <button onClick={() => deleteReview(r.id)}
              className="px-3 py-1.5 bg-gray-100 text-gray-500 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors ml-auto">
              🗑 Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── About Page Editor ───────────────────────────────────────────────────────

const defaultAboutContent = {
  hero_eyebrow: 'Our Story',
  hero_heading: 'About AK Ayurveda',
  hero_subtext: 'Rooted in 5,000 years of Vedic wisdom, practised in the heart of London.',
  mission1_icon: '🌿', mission1_title: 'Our Mission', mission1_text: 'To restore balance and wellbeing through the timeless principles of Ayurveda, tailored to modern life.',
  mission2_icon: '🏛️', mission2_title: 'Our Heritage', mission2_text: 'Drawing from over 5,000 years of Vedic wisdom, our treatments are rooted in authentic Ayurvedic tradition.',
  mission3_icon: '🌍', mission3_title: 'Our Reach', mission3_text: 'Based in London, we serve clients from across the UK and beyond who seek genuine Ayurvedic care.',
  story_heading: 'Our Journey',
  story_para1: 'AK Ayurveda was founded with a single purpose: to bring authentic Ayurvedic healing to London. Frustrated by the lack of genuine, personalised Ayurvedic care in the UK, our founders set out to create a clinic that honours the full depth of this ancient science.',
  story_para2: 'Every treatment at AK Ayurveda is rooted in classical Ayurvedic texts and delivered with modern sensitivity. We believe true healing addresses not just symptoms, but the root imbalances that cause them.',
  story_para3: 'Today, AK Ayurveda serves hundreds of clients seeking relief from stress, digestive issues, sleep disorders, and more — through therapies that have stood the test of thousands of years.',
  story_image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80',
  practitioner_name: 'Dr. Anjali Kumar',
  practitioner_title: 'Chief Ayurvedic Practitioner',
  practitioner_bio: 'Dr. Anjali Kumar trained at the Ayurvedic Medical College in Kerala and has over 15 years of clinical experience. She has treated thousands of patients across India and the UK, specialising in Panchakarma and chronic lifestyle disorders.',
  practitioner_image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=80',
}

type AboutContent = typeof defaultAboutContent

function AboutEditor() {
  const [data, setData] = useState<AboutContent>(defaultAboutContent)
  const { status, saving, saved, error } = useSaveStatus()

  useEffect(() => {
    supabase.from('site_content').select('content').eq('key', 'about').single()
      .then(({ data: d }) => {
        if (d?.content && typeof d.content === 'object') {
          setData((prev) => ({ ...prev, ...(d.content as Partial<AboutContent>) }))
        }
      })
  }, [])

  const handleChange = (name: string, value: string) => setData((p) => ({ ...p, [name]: value }))

  const handleSave = async () => {
    saving()
    const { error: err } = await supabase.from('site_content').upsert(
      { key: 'about', content: data },
      { onConflict: 'key' }
    )
    err ? error() : saved()
  }

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="bg-green-50/50 rounded-xl p-5 space-y-4">
        <p className="font-body text-xs font-semibold text-primary uppercase tracking-wide">Hero Section</p>
        <Field label="Hero Eyebrow" name="hero_eyebrow" value={data.hero_eyebrow} onChange={handleChange} />
        <Field label="Hero Heading" name="hero_heading" value={data.hero_heading} onChange={handleChange} />
        <Field label="Hero Subtext" name="hero_subtext" value={data.hero_subtext} onChange={handleChange} textarea rows={2} />
      </div>

      {/* Missions */}
      <div className="bg-green-50/50 rounded-xl p-5 space-y-4">
        <p className="font-body text-xs font-semibold text-primary uppercase tracking-wide">Mission Strip</p>
        {([1, 2, 3] as const).map((n) => (
          <div key={n} className="bg-white rounded-xl p-4 space-y-3 border border-green-100">
            <p className="font-body text-xs font-semibold text-sage">Mission {n}</p>
            <div className="grid grid-cols-5 gap-3">
              <Field label="Icon" name={`mission${n}_icon`} value={(data as Record<string, string>)[`mission${n}_icon`]} onChange={handleChange} />
              <div className="col-span-4">
                <Field label="Title" name={`mission${n}_title`} value={(data as Record<string, string>)[`mission${n}_title`]} onChange={handleChange} />
              </div>
            </div>
            <Field label="Text" name={`mission${n}_text`} value={(data as Record<string, string>)[`mission${n}_text`]} onChange={handleChange} textarea rows={2} />
          </div>
        ))}
      </div>

      {/* Story */}
      <div className="bg-green-50/50 rounded-xl p-5 space-y-4">
        <p className="font-body text-xs font-semibold text-primary uppercase tracking-wide">Our Story Section</p>
        <Field label="Story Heading" name="story_heading" value={data.story_heading} onChange={handleChange} />
        <Field label="Story Paragraph 1" name="story_para1" value={data.story_para1} onChange={handleChange} textarea rows={3} />
        <Field label="Story Paragraph 2" name="story_para2" value={data.story_para2} onChange={handleChange} textarea rows={3} />
        <Field label="Story Paragraph 3" name="story_para3" value={data.story_para3} onChange={handleChange} textarea rows={3} />
        <div>
          <Field label="Story Image URL" name="story_image" value={data.story_image} onChange={handleChange} />
          {data.story_image && (
            <div className="mt-2 rounded-xl overflow-hidden border border-green-100" style={{ height: 120 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={data.story_image} alt="Story preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
        </div>
      </div>

      {/* Practitioner */}
      <div className="bg-green-50/50 rounded-xl p-5 space-y-4">
        <p className="font-body text-xs font-semibold text-primary uppercase tracking-wide">Practitioner Section</p>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Practitioner Name" name="practitioner_name" value={data.practitioner_name} onChange={handleChange} />
          <Field label="Practitioner Title" name="practitioner_title" value={data.practitioner_title} onChange={handleChange} />
        </div>
        <Field label="Practitioner Bio" name="practitioner_bio" value={data.practitioner_bio} onChange={handleChange} textarea rows={4} />
        <div>
          <Field label="Practitioner Image URL" name="practitioner_image" value={data.practitioner_image} onChange={handleChange} />
          {data.practitioner_image && (
            <div className="mt-2 rounded-xl overflow-hidden border border-green-100" style={{ height: 100, width: 100 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={data.practitioner_image} alt="Practitioner preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />
            </div>
          )}
        </div>
      </div>

      <SaveButton status={status} onClick={handleSave} />
    </div>
  )
}

// ─── Conditions Page Editor ───────────────────────────────────────────────────

const defaultConditionsPageContent = {
  hero_eyebrow: 'Conditions We Support',
  hero_heading: 'Conditions We Support',
  hero_subtext: 'Ayurveda offers a holistic approach to many modern health challenges.',
  intro_text: 'In Ayurveda, every condition is understood through the lens of your unique constitution (Prakriti) and current imbalances (Vikriti). Rather than treating symptoms in isolation, we work to restore the underlying balance of Vata, Pitta, and Kapha — allowing the body to heal naturally.',
}

type ConditionsPageContent = typeof defaultConditionsPageContent

function ConditionsPageEditor() {
  const [data, setData] = useState<ConditionsPageContent>(defaultConditionsPageContent)
  const { status, saving, saved, error } = useSaveStatus()

  useEffect(() => {
    supabase.from('site_content').select('content').eq('key', 'conditions_page').single()
      .then(({ data: d }) => {
        if (d?.content && typeof d.content === 'object') {
          setData((prev) => ({ ...prev, ...(d.content as Partial<ConditionsPageContent>) }))
        }
      })
  }, [])

  const handleChange = (name: string, value: string) => setData((p) => ({ ...p, [name]: value }))

  const handleSave = async () => {
    saving()
    const { error: err } = await supabase.from('site_content').upsert(
      { key: 'conditions_page', content: data },
      { onConflict: 'key' }
    )
    err ? error() : saved()
  }

  return (
    <div className="space-y-6">
      <div className="bg-green-50/50 rounded-xl p-5 space-y-4">
        <p className="font-body text-xs font-semibold text-primary uppercase tracking-wide">Hero Section</p>
        <Field label="Hero Eyebrow" name="hero_eyebrow" value={data.hero_eyebrow} onChange={handleChange} />
        <Field label="Hero Heading" name="hero_heading" value={data.hero_heading} onChange={handleChange} />
        <Field label="Hero Subtext" name="hero_subtext" value={data.hero_subtext} onChange={handleChange} textarea rows={2} />
      </div>
      <div className="bg-green-50/50 rounded-xl p-5 space-y-4">
        <p className="font-body text-xs font-semibold text-primary uppercase tracking-wide">Intro Paragraph</p>
        <Field label="Intro Text" name="intro_text" value={data.intro_text} onChange={handleChange} textarea rows={4} />
      </div>
      <SaveButton status={status} onClick={handleSave} />
    </div>
  )
}

// ─── SlotCell — hover reveals Block/Delete buttons ───────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SlotCell({ slot, appt, bg, tc, onToggleBlock, onDelete, onOpenModal, toggling, btnTiny, fmtST }: any) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => { if (slot.is_booked && appt) onOpenModal(slot, appt) }}
      title={slot.is_booked && appt ? `${appt.name} · ${appt.service}\n📞 ${appt.phone}\n✉️ ${appt.email}` : slot.is_blocked ? 'Blocked' : 'Available'}
      style={{ padding: '4px 5px', borderRadius: 5, background: bg, cursor: slot.is_booked ? 'pointer' : 'default', fontSize: 9, position: 'relative' }}
    >
      <p style={{ fontWeight: 700, color: tc, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{fmtST(slot.start_time)}</p>
      {appt && <p style={{ color: '#1E40AF', margin: 0, fontSize: 8, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{appt.name.split(' ')[0]}</p>}
      {slot.is_blocked && <p style={{ color: '#9CA3AF', margin: 0, fontSize: 8 }}>Blocked</p>}
      {!slot.is_booked && hovered && (
        <div style={{ display: 'flex', gap: 2, marginTop: 2 }}>
          <button onClick={e => { e.stopPropagation(); onToggleBlock(slot) }} disabled={toggling === slot.id}
            style={{ ...btnTiny, background: slot.is_blocked ? '#D1FAE5' : '#F3F4F6', color: slot.is_blocked ? '#065F46' : '#6B7280' }}>
            {slot.is_blocked ? 'Unblock' : 'Block'}
          </button>
          <button onClick={e => { e.stopPropagation(); onDelete(slot.id) }}
            style={{ ...btnTiny, background: '#FEE2E2', color: '#991B1B' }}>✕</button>
        </div>
      )}
    </div>
  )
}

// ─── Slots Manager ────────────────────────────────────────────────────────────

function getAdminMonday(d: Date): Date {
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  const mon = new Date(d)
  mon.setDate(d.getDate() + diff)
  mon.setHours(0, 0, 0, 0)
  return mon
}

function slotYMD(d: Date): string {
  return d.toISOString().split('T')[0]
}

function fmtST(t: string): string {
  const [h, m] = t.split(':').map(Number)
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`
}

const ADMIN_WEEK_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

type SlotWithBooked = TimeSlot & { is_booked: boolean }
type SlotAppt = { id: string; slot_id: string; name: string; email: string; phone: string; service: string; status: string }

function SlotsManager() {
  const [weekStart, setWeekStart] = useState<Date>(() => getAdminMonday(new Date()))
  const [weekSlots, setWeekSlots] = useState<SlotWithBooked[]>([])
  const [weekAppts, setWeekAppts] = useState<SlotAppt[]>([])
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({ todayBooked: 0, todayFree: 0, weekTotal: 0, pendingCount: 0 })

  const [createMode, setCreateMode] = useState<'bulk' | 'single'>('bulk')
  const [creating, setCreating] = useState(false)
  const [createMsg, setCreateMsg] = useState('')

  const [bulkForm, setBulkForm] = useState({
    fromDate: '', toDate: '',
    days: [true, true, true, true, true, false, false],
    startTime: '09:00', endTime: '17:00', duration: 60,
  })
  const [singleForm, setSingleForm] = useState({ date: '', startTime: '09:00', endTime: '10:00' })

  const [modalData, setModalData] = useState<{ slot: SlotWithBooked; appt: SlotAppt } | null>(null)
  const [toggling, setToggling] = useState<string | null>(null)

  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart)
    d.setDate(d.getDate() + i)
    return slotYMD(d)
  })

  const fetchWeek = useCallback(async () => {
    setLoading(true)
    const { data: slots } = await supabase
      .from('time_slots').select('*')
      .gte('date', weekDates[0]).lte('date', weekDates[6])
      .order('start_time')

    const slotIds = (slots ?? []).map(s => s.id)
    let appts: SlotAppt[] = []
    if (slotIds.length > 0) {
      const { data } = await supabase
        .from('appointments')
        .select('id, slot_id, name, email, phone, service, status')
        .in('slot_id', slotIds).neq('status', 'cancelled')
      appts = (data ?? []) as SlotAppt[]
    }

    const bookedIds = new Set(appts.map(a => a.slot_id))
    const enriched: SlotWithBooked[] = (slots ?? []).map(s => ({ ...s, is_booked: bookedIds.has(s.id) }))
    setWeekSlots(enriched)
    setWeekAppts(appts)

    const today = slotYMD(new Date())
    const todaySlots = enriched.filter(s => s.date === today && !s.is_blocked)
    const { count: pendingCount } = await supabase
      .from('appointments').select('id', { count: 'exact', head: true }).eq('status', 'pending')

    setStats({
      todayBooked: todaySlots.filter(s => s.is_booked).length,
      todayFree: todaySlots.filter(s => !s.is_booked).length,
      weekTotal: enriched.length,
      pendingCount: pendingCount ?? 0,
    })
    setLoading(false)
  }, [weekStart]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetchWeek() }, [fetchWeek])

  const computeBulkDates = () => {
    if (!bulkForm.fromDate || !bulkForm.toDate) return []
    const dates: string[] = []
    const cur = new Date(bulkForm.fromDate + 'T00:00:00')
    const end = new Date(bulkForm.toDate + 'T00:00:00')
    while (cur <= end) {
      const dow = cur.getDay()
      const idx = dow === 0 ? 6 : dow - 1
      if (bulkForm.days[idx]) dates.push(slotYMD(cur))
      cur.setDate(cur.getDate() + 1)
    }
    return dates
  }

  const countBulkSlots = () => {
    const dates = computeBulkDates()
    const [sh, sm] = bulkForm.startTime.split(':').map(Number)
    const [eh, em] = bulkForm.endTime.split(':').map(Number)
    const perDay = Math.max(0, Math.floor(((eh * 60 + em) - (sh * 60 + sm)) / bulkForm.duration))
    return dates.length * perDay
  }

  const handleBulkCreate = async () => {
    const dates = computeBulkDates()
    if (!dates.length) { setCreateMsg('No dates match — check date range and day selection.'); return }
    setCreating(true); setCreateMsg('')
    try {
      const res = await fetch('/api/slots', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dates, start_time: bulkForm.startTime, end_time: bulkForm.endTime, duration_minutes: bulkForm.duration }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setCreateMsg(`✓ Created ${data.created} slot${data.created !== 1 ? 's' : ''}`)
      fetchWeek()
    } catch (err) { setCreateMsg(`✗ ${(err as Error).message}`) }
    finally { setCreating(false) }
  }

  const handleSingleCreate = async () => {
    if (!singleForm.date) { setCreateMsg('Pick a date first.'); return }
    setCreating(true); setCreateMsg('')
    try {
      const res = await fetch('/api/slots', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dates: [singleForm.date], start_time: singleForm.startTime, end_time: singleForm.endTime, duration_minutes: 60 }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setCreateMsg('✓ Slot created')
      fetchWeek()
    } catch (err) { setCreateMsg(`✗ ${(err as Error).message}`) }
    finally { setCreating(false) }
  }

  const handleToggleBlock = async (slot: SlotWithBooked) => {
    setToggling(slot.id)
    await fetch(`/api/slots/${slot.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_blocked: !slot.is_blocked }),
    })
    setToggling(null); fetchWeek()
  }

  const handleDeleteSlot = async (id: string) => {
    if (!confirm('Delete this slot?')) return
    const res = await fetch(`/api/slots/${id}`, { method: 'DELETE' })
    const data = await res.json()
    if (!res.ok) { alert(data.error); return }
    fetchWeek()
  }

  const today = slotYMD(new Date())
  const slotsByDate = weekDates.reduce<Record<string, SlotWithBooked[]>>((acc, d) => {
    acc[d] = weekSlots.filter(s => s.date === d)
    return acc
  }, {})
  const getAppt = (slotId: string) => weekAppts.find(a => a.slot_id === slotId)

  const inp12: React.CSSProperties = { padding: '8px', borderRadius: 8, border: '1.5px solid #D0EDE6', fontSize: 12, width: '100%', boxSizing: 'border-box' }
  const lbl11: React.CSSProperties = { fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 4 }
  const btnTiny: React.CSSProperties = { fontSize: 10, fontWeight: 700, padding: '3px 6px', borderRadius: 5, border: 'none', cursor: 'pointer' }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { label: 'Today Booked', value: stats.todayBooked, accent: '#1B6E5C', bg: '#F0FAF7' },
          { label: 'Today Free', value: stats.todayFree, accent: '#0F3D34', bg: '#D0EDE6' },
          { label: 'Week Slots', value: stats.weekTotal, accent: '#6B7280', bg: '#F9FAFB' },
          { label: 'Pending Confirm', value: stats.pendingCount, accent: '#D97706', bg: '#FFFBEB' },
        ].map(st => (
          <div key={st.label} style={{ background: st.bg, borderRadius: 14, padding: '14px 18px', border: '1px solid rgba(0,0,0,0.05)' }}>
            <p style={{ fontSize: 26, fontWeight: 800, color: st.accent, margin: 0, fontFamily: 'Cormorant Garamond, Georgia, serif' }}>{st.value}</p>
            <p style={{ fontSize: 11, color: '#9CA3AF', margin: '2px 0 0', fontWeight: 600 }}>{st.label}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 16, alignItems: 'start' }}>

        {/* Slot Creator */}
        <div style={{ background: '#fff', borderRadius: 18, border: '1.5px solid #D0EDE6', overflow: 'hidden' }}>
          <div style={{ background: '#F0FAF7', padding: '14px 18px', borderBottom: '1px solid #D0EDE6' }}>
            <p style={{ fontWeight: 700, color: '#0F3D34', fontSize: 13, margin: 0 }}>🕐 Create Slots</p>
          </div>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid #F0F0F0' }}>
            <div style={{ display: 'flex', borderRadius: 9, overflow: 'hidden', border: '1.5px solid #D0EDE6' }}>
              {(['bulk', 'single'] as const).map(m => (
                <button key={m} onClick={() => setCreateMode(m)} style={{
                  flex: 1, padding: '7px 0', fontSize: 11, fontWeight: 700,
                  background: createMode === m ? '#1B6E5C' : '#fff',
                  color: createMode === m ? '#fff' : '#9CA3AF',
                  border: 'none', cursor: 'pointer',
                }}>
                  {m === 'bulk' ? '📅 Bulk' : '➕ Single'}
                </button>
              ))}
            </div>
          </div>
          <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {createMode === 'bulk' ? (
              <>
                <div>
                  <label style={lbl11}>Date Range</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                    <input type="date" value={bulkForm.fromDate} onChange={e => setBulkForm(p => ({ ...p, fromDate: e.target.value }))} style={inp12} />
                    <input type="date" value={bulkForm.toDate} onChange={e => setBulkForm(p => ({ ...p, toDate: e.target.value }))} style={inp12} />
                  </div>
                </div>
                <div>
                  <label style={lbl11}>Days of Week</label>
                  <div style={{ display: 'flex', gap: 3 }}>
                    {['M','T','W','T','F','S','S'].map((d, i) => (
                      <button key={i} onClick={() => setBulkForm(p => { const nd = [...p.days]; nd[i] = !nd[i]; return { ...p, days: nd } })}
                        style={{ width: 28, height: 28, borderRadius: 7, fontSize: 10, fontWeight: 700, border: '1.5px solid ' + (bulkForm.days[i] ? '#1B6E5C' : '#D0EDE6'), background: bulkForm.days[i] ? '#1B6E5C' : '#F0FAF7', color: bulkForm.days[i] ? '#fff' : '#9CA3AF', cursor: 'pointer' }}>
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={lbl11}>Time Range</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                    <input type="time" value={bulkForm.startTime} onChange={e => setBulkForm(p => ({ ...p, startTime: e.target.value }))} style={inp12} />
                    <input type="time" value={bulkForm.endTime} onChange={e => setBulkForm(p => ({ ...p, endTime: e.target.value }))} style={inp12} />
                  </div>
                </div>
                <div>
                  <label style={lbl11}>Duration</label>
                  <select value={bulkForm.duration} onChange={e => setBulkForm(p => ({ ...p, duration: Number(e.target.value) }))} style={inp12}>
                    <option value={30}>30 minutes</option>
                    <option value={60}>60 minutes</option>
                    <option value={90}>90 minutes</option>
                  </select>
                </div>
                <div style={{ padding: '8px 10px', borderRadius: 8, background: '#F0FAF7', textAlign: 'center' }}>
                  <p style={{ fontSize: 11, color: '#1B6E5C', fontWeight: 700, margin: 0 }}>
                    ~{countBulkSlots()} slots across {computeBulkDates().length} days
                  </p>
                </div>
                <button onClick={handleBulkCreate} disabled={creating}
                  style={{ padding: '9px', borderRadius: 9, fontSize: 12, fontWeight: 700, background: creating ? '#D1D5DB' : '#1B6E5C', color: '#fff', border: 'none', cursor: creating ? 'not-allowed' : 'pointer' }}>
                  {creating ? 'Creating…' : '📅 Create Slots'}
                </button>
              </>
            ) : (
              <>
                <div><label style={lbl11}>Date</label><input type="date" value={singleForm.date} onChange={e => setSingleForm(p => ({ ...p, date: e.target.value }))} style={inp12} /></div>
                <div><label style={lbl11}>Start Time</label><input type="time" value={singleForm.startTime} onChange={e => setSingleForm(p => ({ ...p, startTime: e.target.value }))} style={inp12} /></div>
                <div><label style={lbl11}>End Time</label><input type="time" value={singleForm.endTime} onChange={e => setSingleForm(p => ({ ...p, endTime: e.target.value }))} style={inp12} /></div>
                <button onClick={handleSingleCreate} disabled={creating}
                  style={{ padding: '9px', borderRadius: 9, fontSize: 12, fontWeight: 700, background: creating ? '#D1D5DB' : '#1B6E5C', color: '#fff', border: 'none', cursor: creating ? 'not-allowed' : 'pointer' }}>
                  {creating ? 'Creating…' : '➕ Create Slot'}
                </button>
              </>
            )}
            {createMsg && (
              <p style={{ fontSize: 11, fontWeight: 600, padding: '7px 10px', borderRadius: 7, background: createMsg.startsWith('✓') ? '#F0FAF7' : '#FEF2F2', color: createMsg.startsWith('✓') ? '#1B6E5C' : '#EF4444', margin: 0 }}>
                {createMsg}
              </p>
            )}
          </div>
        </div>

        {/* Weekly Calendar */}
        <div style={{ background: '#fff', borderRadius: 18, border: '1.5px solid #D0EDE6', overflow: 'hidden' }}>
          {/* Week nav */}
          <div style={{ background: '#F0FAF7', padding: '12px 16px', borderBottom: '1px solid #D0EDE6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button onClick={() => { const d = new Date(weekStart); d.setDate(d.getDate() - 7); setWeekStart(d) }}
              style={{ padding: '5px 10px', borderRadius: 7, border: '1.5px solid #D0EDE6', background: '#fff', cursor: 'pointer', fontSize: 11, fontWeight: 600, color: '#1B6E5C' }}>← Prev</button>
            <span style={{ fontWeight: 700, color: '#0F3D34', fontSize: 12 }}>
              {weekDates[0]} → {weekDates[6]}{loading && <span style={{ color: '#9CA3AF', fontSize: 10, marginLeft: 6 }}>Loading…</span>}
            </span>
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={fetchWeek} style={{ padding: '5px 8px', borderRadius: 7, border: '1.5px solid #D0EDE6', background: '#F0FAF7', cursor: 'pointer', fontSize: 11, color: '#1B6E5C', fontWeight: 600 }}>🔄</button>
              <button onClick={() => { const d = new Date(weekStart); d.setDate(d.getDate() + 7); setWeekStart(d) }}
                style={{ padding: '5px 10px', borderRadius: 7, border: '1.5px solid #D0EDE6', background: '#fff', cursor: 'pointer', fontSize: 11, fontWeight: 600, color: '#1B6E5C' }}>Next →</button>
            </div>
          </div>
          {/* Legend */}
          <div style={{ padding: '6px 16px', borderBottom: '1px solid #F0F0F0', display: 'flex', gap: 14 }}>
            {[{ c: '#D1FAE5', l: 'Free' }, { c: '#DBEAFE', l: 'Booked' }, { c: '#F3F4F6', l: 'Blocked' }].map(x => (
              <div key={x.l} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: x.c, border: '1px solid rgba(0,0,0,0.08)' }} />
                <span style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600 }}>{x.l}</span>
              </div>
            ))}
          </div>
          {/* 7-col grid */}
          <div style={{ overflowX: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(100px, 1fr))', minWidth: 700 }}>
              {/* Headers */}
              {weekDates.map((d, i) => {
                const isToday = d === today
                const dt = new Date(d + 'T00:00:00')
                return (
                  <div key={d} style={{ padding: '10px 6px', textAlign: 'center', background: isToday ? '#F0FAF7' : '#FAFAFA', borderBottom: '1px solid #E5E7EB', borderRight: i < 6 ? '1px solid #E5E7EB' : 'none' }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', margin: 0 }}>{ADMIN_WEEK_LABELS[i]}</p>
                    <p style={{ fontSize: 15, fontWeight: 800, margin: '1px 0 0', color: isToday ? '#1B6E5C' : '#0F3D34' }}>{dt.getDate()}</p>
                    {isToday && <p style={{ fontSize: 8, color: '#D4A853', fontWeight: 700, margin: 0, letterSpacing: '0.04em' }}>TODAY</p>}
                  </div>
                )
              })}
              {/* Slot cells */}
              {weekDates.map((d, di) => {
                const daySlots = slotsByDate[d] ?? []
                return (
                  <div key={d} style={{ padding: 5, minHeight: 100, borderRight: di < 6 ? '1px solid #E5E7EB' : 'none', display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {daySlots.length === 0 ? (
                      <p style={{ fontSize: 9, color: '#D1D5DB', textAlign: 'center', marginTop: 12 }}>—</p>
                    ) : daySlots.map(slot => {
                      const appt = slot.is_booked ? getAppt(slot.id) : undefined
                      const bg = slot.is_blocked ? '#F3F4F6' : slot.is_booked ? '#DBEAFE' : '#D1FAE5'
                      const tc = slot.is_blocked ? '#9CA3AF' : slot.is_booked ? '#1E40AF' : '#065F46'
                      return (
                        <SlotCell key={slot.id} slot={slot} appt={appt} bg={bg} tc={tc}
                          onToggleBlock={handleToggleBlock} onDelete={handleDeleteSlot}
                          onOpenModal={(s: SlotWithBooked, a: SlotAppt) => setModalData({ slot: s, appt: a })}
                          toggling={toggling} btnTiny={btnTiny} fmtST={fmtST} />
                      )
                    })}
                    <button onClick={() => { setSingleForm(p => ({ ...p, date: d })); setCreateMode('single') }}
                      style={{ padding: '2px', borderRadius: 5, background: 'transparent', border: '1.5px dashed #D0EDE6', cursor: 'pointer', fontSize: 9, color: '#D1D5DB', fontWeight: 600, marginTop: 'auto' }}>
                      +
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Slot detail modal */}
      {modalData && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 16 }}
          onClick={() => setModalData(null)}>
          <div style={{ background: '#fff', borderRadius: 20, padding: 24, maxWidth: 380, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <h3 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 18, color: '#0F3D34', margin: 0 }}>Booking Details</h3>
              <button onClick={() => setModalData(null)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#9CA3AF' }}>✕</button>
            </div>
            <div style={{ background: '#F0FAF7', borderRadius: 10, padding: 14, marginBottom: 14 }}>
              <p style={{ fontSize: 12, color: '#1B6E5C', fontWeight: 700, margin: '0 0 3px' }}>
                📅 {new Date(modalData.slot.date + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
              <p style={{ fontSize: 12, color: '#0F3D34', margin: 0 }}>🕐 {fmtST(modalData.slot.start_time)} – {fmtST(modalData.slot.end_time)}</p>
            </div>
            {[
              { l: 'Name', v: modalData.appt.name },
              { l: 'Email', v: modalData.appt.email },
              { l: 'Phone', v: modalData.appt.phone },
              { l: 'Service', v: modalData.appt.service },
              { l: 'Status', v: modalData.appt.status },
            ].map(row => (
              <div key={row.l} style={{ display: 'flex', gap: 10, marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: '#9CA3AF', width: 52, flexShrink: 0, paddingTop: 1 }}>{row.l}</span>
                <span style={{ fontSize: 13, color: '#1A1A1A', fontWeight: row.l === 'Service' || row.l === 'Name' ? 600 : 400 }}>{row.v}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main Admin Panel ────────────────────────────────────────────────────────

type AdminTab = 'hero' | 'stats' | 'services' | 'doctor' | 'conditions' | 'testimonials' | 'faqs' | 'contact' | 'appointments' | 'slots' | 'reviews' | 'blogs' | 'about' | 'conditions_page'

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
  { id: 'slots', label: 'Slots', icon: '🕐' },
  { id: 'reviews', label: 'Reviews', icon: '⭐' },
  { id: 'blogs', label: 'Blog Posts', icon: '📝' },
  { id: 'about', label: 'About', icon: '🏥' },
  { id: 'conditions_page', label: 'Conditions Page', icon: '📋' },
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
      case 'slots': return <SlotsManager />
      case 'reviews': return <ReviewsViewer />
      case 'blogs': return <BlogEditor />
      case 'about': return <AboutEditor />
      case 'conditions_page': return <ConditionsPageEditor />
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
        <main className="flex-1 p-4 md:p-6 overflow-y-auto w-full">
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
