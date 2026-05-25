-- Run this in your Supabase SQL editor

-- Categories table
create table categories (
  id serial primary key,
  name text not null unique,
  color text not null default '#6366f1',
  created_at timestamp with time zone default now()
);

-- Expenses table
create table expenses (
  id serial primary key,
  amount numeric(10,2) not null check (amount > 0),
  description text,
  category_id integer references categories(id) on delete set null,
  date date not null default current_date,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table categories enable row level security;
alter table expenses enable row level security;

-- Allow public read/write (personal app, no auth needed)
create policy "public_all" on categories for all using (true) with check (true);
create policy "public_all" on expenses for all using (true) with check (true);

-- Seed default categories
insert into categories (name, color) values
  ('Food', '#ef4444'),
  ('Fun', '#8b5cf6'),
  ('Car', '#f59e0b'),
  ('GYM', '#10b981'),
  ('Med', '#3b82f6');
