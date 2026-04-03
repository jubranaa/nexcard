-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── PROFILES ──────────────────────────────────────────────────────────────────
create table profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  email       text,
  created_at  timestamptz default now()
);

alter table profiles enable row level security;
create policy "Users can read/write own profile"
  on profiles for all using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, email) values (new.id, new.email);
  return new;
end;
$$;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ── CARDS ──────────────────────────────────────────────────────────────────────
create table cards (
  id          uuid default uuid_generate_v4() primary key,
  user_id     uuid references profiles(id) on delete cascade not null,
  slug        text unique not null,
  name        text not null,
  title       text,
  company     text,
  phone       text,
  email       text,
  website     text,
  linkedin    text,
  twitter     text,
  bio         text,
  avatar_url  text,
  card_color  text default '#1a1a2e',
  is_active   boolean default true,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

alter table cards enable row level security;

create policy "Anyone can read active cards"
  on cards for select using (is_active = true);

create policy "Users can manage own cards"
  on cards for all using (auth.uid() = user_id);

-- ── CARD VIEWS ──────────────────────────────────────────────────────────────────
create table card_views (
  id          uuid default uuid_generate_v4() primary key,
  card_id     uuid references cards(id) on delete cascade not null,
  viewed_at   timestamptz default now(),
  referrer    text
);

alter table card_views enable row level security;

create policy "Anyone can insert views"
  on card_views for insert with check (true);

create policy "Card owners can read own views"
  on card_views for select using (
    exists (select 1 from cards where cards.id = card_id and cards.user_id = auth.uid())
  );

-- View count helper
create or replace function get_card_view_count(card_uuid uuid)
returns bigint language sql security definer as $$
  select count(*) from card_views where card_id = card_uuid;
$$;

-- ── STORAGE ────────────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true);

create policy "Anyone can read avatars"
  on storage.objects for select using (bucket_id = 'avatars');

create policy "Authenticated users can upload avatars"
  on storage.objects for insert with check (
    bucket_id = 'avatars' and auth.role() = 'authenticated'
  );

create policy "Users can update own avatars"
  on storage.objects for update using (
    bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]
  );
