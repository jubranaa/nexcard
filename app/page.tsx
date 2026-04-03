import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 bg-[#f8f7f4]">
      <div className="max-w-xl w-full text-center fade-up">
        {/* Logo */}
        <div className="inline-flex items-center gap-2 mb-12">
          <div className="w-8 h-8 rounded-lg bg-[#1a1a2e] flex items-center justify-center">
            <span className="text-white text-sm font-bold">N</span>
          </div>
          <span className="text-xl font-semibold tracking-tight">NexCard</span>
        </div>

        <h1 className="text-5xl font-semibold tracking-tight text-[#1a1a2e] mb-4 leading-tight">
          Your card.<br />Always with you.
        </h1>
        <p className="text-lg text-gray-500 mb-10 leading-relaxed">
          Create a beautiful digital business card. Share with a link, QR code, or NFC tap — no printing ever again.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/auth"
            className="px-8 py-3.5 bg-[#1a1a2e] text-white rounded-xl font-medium text-sm hover:bg-[#2a2a3e] transition-colors"
          >
            Create your card — free
          </Link>
          <Link
            href="/card/demo"
            className="px-8 py-3.5 border border-gray-200 text-gray-700 rounded-xl font-medium text-sm hover:bg-white transition-colors"
          >
            See an example
          </Link>
        </div>

        {/* Social proof */}
        <p className="mt-10 text-xs text-gray-400">
          No credit card required · Takes 2 minutes to set up
        </p>
      </div>
    </main>
  )
}
