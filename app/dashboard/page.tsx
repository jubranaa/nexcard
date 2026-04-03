import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { redirect } from 'next/navigation'
import { getMyCard } from '@/lib/supabase'
import CardEditor from '@/components/CardEditor'

export default async function DashboardPage() {
  const cookieStore = cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
{ cookies: { get: (name: string) => cookieStore.get(name)?.value } }  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  const card = await getMyCard(user.id)

  return <CardEditor userId={user.id} initialCard={card} />
}
