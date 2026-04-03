import { notFound } from 'next/navigation'
import { getCardBySlug, logView, getViewCount } from '@/lib/supabase'
import CardPreview from '@/components/CardPreview'
import type { Metadata } from 'next'
import Link from 'next/link'

type Props = { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const card = await getCardBySlug(params.slug)
  if (!card) return { title: 'Card not found' }
  return {
    title: `${card.name} — NexCard`,
    description: card.bio || `${card.title ?? ''} ${card.company ? `at ${card.company}` : ''}`.trim(),
    openGraph: {
      title: card.name,
      description: card.bio ?? card.title ?? '',
      images: card.avatar_url ? [card.avatar_url] : [],
    },
  }
}

export default async function PublicCardPage({ params }: Props) {
  const card = await getCardBySlug(params.slug)
  if (!card) notFound()

  // Log view (fire and forget)
  logView(card.id)
  const viewCount = await getViewCount(card.id)

  return (
    <main className="min-h-screen bg-[#f8f7f4] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm fade-up">
        <CardPreview card={card} viewCount={viewCount} />

        {/* Save contact button */}
        <div className="mt-4 space-y-2">
          {card.email && (
            <a
              href={`mailto:${card.email}`}
              className="block w-full text-center py-3 bg-[#1a1a2e] text-white rounded-xl text-sm font-medium hover:bg-[#2a2a3e] transition-colors"
            >
              Send an email
            </a>
          )}
          {card.phone && (
            <a
              href={`tel:${card.phone}`}
              className="block w-full text-center py-3 border border-gray-200 text-gray-700 bg-white rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Call {card.name.split(' ')[0]}
            </a>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-8">
          Powered by{' '}
          <Link href="/" className="text-gray-600 font-medium hover:underline">
            NexCard
          </Link>
          {' '}· Create your free card
        </p>
      </div>
    </main>
  )
}
