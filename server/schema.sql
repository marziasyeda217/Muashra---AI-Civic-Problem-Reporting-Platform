-- ====================================================================
-- MUASHRA SUPABASE DATABASE SCHEMA & PERMISSIONS SETUP
-- Run this in your Supabase Dashboard: SQL Editor -> New Query -> Run
-- ====================================================================

-- 1. Create complaints table if not exists
CREATE TABLE IF NOT EXISTS public.complaints (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    formal_urdu TEXT,
    formal_english TEXT,
    category TEXT,
    department TEXT,
    status TEXT DEFAULT 'pending',
    urgency TEXT DEFAULT 'medium',
    upvotes INTEGER DEFAULT 1,
    city TEXT,
    address TEXT,
    latitude NUMERIC,
    longitude NUMERIC,
    image_url TEXT,
    user_id TEXT,
    citizen_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create users table if not exists
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'citizen',
    city TEXT,
    department TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. FIX PERMISSION DENIED (ERROR 42501):
-- Disable Row Level Security so anon and service role can sync data freely
ALTER TABLE public.complaints DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- 4. Grant explicit table privileges to anon, authenticated, and service_role
GRANT ALL ON TABLE public.complaints TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.users TO anon, authenticated, service_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;