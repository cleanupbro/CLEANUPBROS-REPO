-- ==========================================
-- CLEAN UP BROS - DATABASE SETUP
-- Run this in Supabase SQL Editor
-- ==========================================

-- 1. CREATE SUBMISSIONS TABLE
-- Stores all form submissions (quotes, applications, feedback)
CREATE TABLE IF NOT EXISTS submissions (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    type TEXT NOT NULL,
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Confirmed', 'Canceled')),
    data JSONB NOT NULL,
    summary TEXT,
    lead_score INTEGER CHECK (lead_score >= 0 AND lead_score <= 100),
    lead_reasoning TEXT,
    admin_notes TEXT
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_submissions_type ON submissions(type);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);

-- Enable Row Level Security (RLS)
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert (public forms)
CREATE POLICY "Anyone can insert submissions"
ON submissions FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Policy: Authenticated users can read all
CREATE POLICY "Authenticated users can read all submissions"
ON submissions FOR SELECT
TO authenticated
USING (true);

-- Policy: Authenticated users can update all
CREATE POLICY "Authenticated users can update submissions"
ON submissions FOR UPDATE
TO authenticated
USING (true);

-- ==========================================

-- 2. CREATE ADMIN USERS TABLE
-- Stores admin user information
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Policy: Only authenticated users can read their own data
CREATE POLICY "Users can read own data"
ON admin_users FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- ==========================================

-- 3. ENABLE REALTIME (for live updates)
ALTER PUBLICATION supabase_realtime ADD TABLE submissions;

-- ==========================================

-- 4. CREATE STORAGE BUCKET (for file uploads)
-- This needs to be done in Supabase Storage UI, not SQL
-- But here's the policy SQL for reference:

-- After creating bucket 'job-applications' in Storage UI, run:
/*
CREATE POLICY "Anyone can upload job application files"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'job-applications');

CREATE POLICY "Authenticated users can view all files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'job-applications');

CREATE POLICY "Authenticated users can delete files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'job-applications');
*/

-- ==========================================
-- SETUP COMPLETE!
-- ==========================================

-- VERIFY TABLES CREATED:
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('submissions', 'admin_users');

-- VERIFY RLS ENABLED:
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('submissions', 'admin_users');
