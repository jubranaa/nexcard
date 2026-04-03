'use client'
import { useState, useRef } from 'react'
import { supabase, slugify, upsertCard, uploadAvatar, type Card } from '@/lib/supabase'
import CardPreview from './CardPreview'

const COLORS = [
  '#1a1a2e', '#185FA5', '#0F6E56', '#534AB7',
  '#993C1D', '#2C2C2A', '#7B2869', '#1B4332',
]

type Props = { userId: string; initialCard: Card | null }

export default function CardEditor({ userId, initialCard }: Props) {
  const [card, setCard] = useState<Partial<Card>>(initialCard ?? {
    name: '', title: '', company: '', phone: '',
    email: '', website: '', linkedin: '', twitter: '',
    bio: '', card_color: '#1a1a2e', avatar_url: '',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  function update(field: string, value: string) {
    setCard(prev => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadAvatar(userId, file)
      setCard(prev => ({ ...prev, avatar_url: url }))
    } catch (err) {
      console.error(err)
    }
    setUploading(false)
  }

  async function handleSave() {
    if (!card.name) return alert('Please enter your name.')
    setSaving(true)
    try {
      const slug = initialCard?.slug ?? slugify(card.name!)
      await upsertCard({ ...card, user_id: userId, slug, name: card.name! })
      setSaved(true)
    } catch (err: any) {
      alert(err.message)
    }
    setSaving(false)
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const slug = initialCard?.slug ?? slugify(card.name ?? '')
  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/card/${slug}`

  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#1a1a2e] flex items-center justify-center">
            <span className="text-white text-xs font-bold">N</span>
          </div>
          <span className="font-semibold tracking-tight text-sm">NexCard</span>
        </div>
        <div className="flex items-center gap-3">
          {slug && (
            <a
              href={shareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-500 hover:text-gray-800 underline underline-offset-2"
            >
              View live card ↗
            </a>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-[#1a1a2e] text-white rounded-lg text-sm font-medium hover:bg-[#2a2a3e] transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save card'}
          </button>
          <button onClick={handleSignOut} className="text-xs text-gray-400 hover:text-gray-600">
            Sign out
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Editor */}
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-[#1a1a2e] mb-1">Your card</h2>
            <p className="text-sm text-gray-500">Edit your details below. Changes preview live.</p>
          </div>

          {/* Avatar upload */}
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer overflow-hidden border-2 border-dashed border-gray-200 hover:border-gray-400 transition-colors"
              onClick={() => fileRef.current?.click()}
            >
              {card.avatar_url ? (
                <img src={card.avatar_url} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs text-gray-400 text-center leading-tight px-1">
                  {uploading ? '…' : 'Add photo'}
                </span>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            <div>
              <p className="text-sm font-medium text-gray-700">Profile photo</p>
              <p className="text-xs text-gray-400">JPG, PNG — max 5MB</p>
            </div>
          </div>

          {/* Fields */}
          {[
            { label: 'Full name *', field: 'name', placeholder: 'Ahmad Al-Rashid' },
            { label: 'Job title', field: 'title', placeholder: 'Founder & CEO' },
            { label: 'Company', field: 'company', placeholder: 'NexCard' },
            { label: 'Phone', field: 'phone', placeholder: '+966 50 123 4567' },
            { label: 'Email', field: 'email', placeholder: 'ahmad@nexcard.io' },
            { label: 'Website', field: 'website', placeholder: 'nexcard.io' },
            { label: 'LinkedIn URL', field: 'linkedin', placeholder: 'linkedin.com/in/ahmad' },
            { label: 'Twitter / X', field: 'twitter', placeholder: '@ahmad' },
          ].map(({ label, field, placeholder }) => (
            <div key={field}>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">{label}</label>
              <input
                type="text"
                placeholder={placeholder}
                value={(card as any)[field] ?? ''}
                onChange={e => update(field, e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm bg-white placeholder-gray-300 focus:outline-none focus:border-[#1a1a2e]"
              />
            </div>
          ))}

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Short bio</label>
            <textarea
              rows={3}
              placeholder="A sentence about you or your work…"
              value={card.bio ?? ''}
              onChange={e => update('bio', e.target.value)}
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm bg-white placeholder-gray-300 focus:outline-none focus:border-[#1a1a2e] resize-none"
            />
          </div>

          {/* Card color */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-2">Card color</label>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => update('card_color', c)}
                  style={{ background: c }}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${card.card_color === c ? 'border-gray-800 scale-110' : 'border-transparent'}`}
                />
              ))}
            </div>
          </div>

          {/* Share URL */}
          {slug && (
            <div className="p-4 bg-white border border-gray-100 rounded-xl">
              <p className="text-xs text-gray-500 mb-1">Your share link</p>
              <div className="flex items-center gap-2">
                <code className="text-sm text-[#1a1a2e] flex-1 truncate">{shareUrl}</code>
                <button
                  onClick={() => navigator.clipboard.writeText(shareUrl)}
                  className="text-xs px-2 py-1 border border-gray-200 rounded-md hover:bg-gray-50"
                >
                  Copy
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Live preview */}
        <div className="lg:sticky lg:top-10 h-fit">
          <p className="text-xs font-medium text-gray-500 mb-3 uppercase tracking-wide">Live preview</p>
          <CardPreview card={card as Card} />
        </div>
      </div>
    </div>
  )
}
