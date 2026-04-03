# NexCard — Digital Business Card App

Full-stack Next.js 14 + Supabase app. Users create a digital business card, get a shareable URL + QR code, and track how many times it's been viewed.

## Stack
- **Next.js 14** (App Router) — frontend + API
- **Supabase** — auth, database, file storage
- **Tailwind CSS** — styling
- **qrcode** — QR code generation
- **Vercel** — deployment

## Project structure

```
nexcard/
├── app/
│   ├── page.tsx              # Landing page
│   ├── auth/page.tsx         # Sign up / sign in
│   ├── dashboard/page.tsx    # Card editor (protected)
│   └── card/[slug]/page.tsx  # Public card page
├── components/
│   ├── CardEditor.tsx        # Full editor UI
│   └── CardPreview.tsx       # Live card preview + QR
├── lib/
│   └── supabase.ts           # Client, types, helpers
└── supabase/
    └── migrations/
        └── 001_schema.sql    # Full DB schema
```

## Setup (10 minutes)

### 1. Create Supabase project
1. Go to [supabase.com](https://supabase.com) → New project
2. Copy your **Project URL** and **anon key** from Settings → API

### 2. Run the schema
1. Go to Supabase → SQL Editor
2. Paste the contents of `supabase/migrations/001_schema.sql`
3. Click Run

### 3. Enable Google OAuth (optional)
1. Supabase → Authentication → Providers → Google
2. Add your Google OAuth credentials

### 4. Set up environment variables
```bash
cp .env.local.example .env.local
# Fill in your Supabase URL and anon key
```

### 5. Install and run
```bash
npm install
npm run dev
# Open http://localhost:3000
```

### 6. Deploy to Vercel
```bash
npx vercel
# Add your env vars in Vercel dashboard
```

## Key flows

| Flow | Route |
|------|-------|
| Landing page | `/` |
| Sign up / sign in | `/auth` |
| Edit your card | `/dashboard` |
| Public card (shareable) | `/card/[slug]` |

## What's included
- Email + Google OAuth
- Card editor with live preview
- Avatar photo upload (Supabase Storage)
- Auto-generated shareable URL + QR code
- Public card page with SEO metadata
- View count tracking
- 8 card color themes

## Next steps (v2)
- NFC tag writing (Expo + react-native-nfc-manager)
- Stripe billing for premium themes
- Analytics dashboard with charts
- Contact saving / vCard export
- Team / org accounts
