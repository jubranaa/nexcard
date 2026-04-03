'use client'
import { useEffect, useRef } from 'react'
import QRCode from 'qrcode'
import type { Card } from '@/lib/supabase'

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

export default function CardPreview({ card, viewCount }: { card: Card; viewCount?: number }) {
  const qrRef = useRef<HTMLCanvasElement>(null)
  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/card/${card.slug}`
    : `https://nexcard.io/card/${card.slug}`

  useEffect(() => {
    if (!qrRef.current || !card.slug) return
    QRCode.toCanvas(qrRef.current, shareUrl, {
      width: 80,
      margin: 1,
      color: { dark: '#000000', light: '#ffffff' },
    })
  }, [card.slug, shareUrl])

  const bg = card.card_color || '#1a1a2e'
  const textColor = '#ffffff'

  return (
    <div
      className="rounded-2xl p-6 text-white shadow-xl"
      style={{ background: bg, color: textColor, minHeight: 320 }}
    >
      {/* Avatar + name */}
      <div className="flex items-center gap-4 mb-5">
        {card.avatar_url ? (
          <img
            src={card.avatar_url}
            alt={card.name}
            className="w-14 h-14 rounded-full object-cover border-2 border-white/20"
          />
        ) : (
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-semibold border-2 border-white/20"
            style={{ background: 'rgba(255,255,255,0.15)' }}
          >
            {card.name ? initials(card.name) : '?'}
          </div>
        )}
        <div>
          <h2 className="font-semibold text-lg leading-tight">{card.name || 'Your Name'}</h2>
          {card.title && <p className="text-sm opacity-80">{card.title}</p>}
          {card.company && <p className="text-xs opacity-60">{card.company}</p>}
        </div>
      </div>

      {/* Bio */}
      {card.bio && (
        <p className="text-xs opacity-70 mb-5 leading-relaxed border-t border-white/10 pt-4">{card.bio}</p>
      )}

      {/* Contact details */}
      <div className="space-y-2.5 mb-5">
        {card.phone && (
          <a href={`tel:${card.phone}`} className="flex items-center gap-2.5 text-sm opacity-90 hover:opacity-100">
            <PhoneIcon />
            <span>{card.phone}</span>
          </a>
        )}
        {card.email && (
          <a href={`mailto:${card.email}`} className="flex items-center gap-2.5 text-sm opacity-90 hover:opacity-100">
            <EmailIcon />
            <span>{card.email}</span>
          </a>
        )}
        {card.website && (
          <a href={`https://${card.website.replace(/^https?:\/\//, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-sm opacity-90 hover:opacity-100">
            <GlobeIcon />
            <span>{card.website.replace(/^https?:\/\//, '')}</span>
          </a>
        )}
        {card.linkedin && (
          <a href={`https://${card.linkedin.replace(/^https?:\/\//, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-sm opacity-90 hover:opacity-100">
            <LinkedInIcon />
            <span>LinkedIn</span>
          </a>
        )}
        {card.twitter && (
          <a href={`https://twitter.com/${card.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-sm opacity-90 hover:opacity-100">
            <TwitterIcon />
            <span>{card.twitter.startsWith('@') ? card.twitter : `@${card.twitter}`}</span>
          </a>
        )}
      </div>

      {/* QR + stats */}
      {card.slug && (
        <div className="border-t border-white/10 pt-4 flex items-end justify-between">
          <div>
            <div className="bg-white rounded-lg p-1.5 inline-block qr-white-bg">
              <canvas ref={qrRef} />
            </div>
            <p className="text-xs opacity-50 mt-1.5">Scan to connect</p>
          </div>
          {viewCount !== undefined && (
            <div className="text-right">
              <p className="text-2xl font-semibold">{viewCount}</p>
              <p className="text-xs opacity-50">card views</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function PhoneIcon() {
  return (
    <span className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.15)' }}>
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    </span>
  )
}

function EmailIcon() {
  return (
    <span className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.15)' }}>
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    </span>
  )
}

function GlobeIcon() {
  return (
    <span className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.15)' }}>
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
      </svg>
    </span>
  )
}

function LinkedInIcon() {
  return (
    <span className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.15)' }}>
      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 8h5v16H0V8zm7.5 0h4.8v2.2h.07C13.07 8.9 14.8 8 16.8 8c4.5 0 5.2 3 5.2 6.8V24h-5v-8.3c0-2-.04-4.5-2.7-4.5-2.72 0-3.13 2.1-3.13 4.35V24H7.5V8z"/>
      </svg>
    </span>
  )
}

function TwitterIcon() {
  return (
    <span className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.15)' }}>
      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    </span>
  )
}
