# Supabase Setup Guide

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Project Name**: Clean Up Bros CRM
   - **Database Password**: (generate a strong password - save it!)
   - **Region**: Choose closest to Sydney (ap-southeast-1 or ap-southeast-2)
5. Click "Create new project" (takes ~2 minutes)

## Step 2: Get Your API Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these two values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (the long string under "Project API keys")

3. Update your `.env.local` file:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 3: Create Database Tables

In Supabase dashboard, go to **SQL Editor** and run these queries:

### 1. Create Submissions Table

```sql
-- Create submissions table
CREATE TABLE submissions (
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

-- Create index for faster queries
CREATE INDEX idx_submissions_created_at ON submissions(created_at DESC);
CREATE INDEX idx_submissions_type ON submissions(type);
CREATE INDEX idx_submissions_status ON submissions(status);

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
```

### 2. Create Admin Users Table

```sql
-- Create admin_users table
CREATE TABLE admin_users (
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
```

### 3. Enable Realtime (for live updates)

```sql
-- Enable realtime for submissions table
ALTER PUBLICATION supabase_realtime ADD TABLE submissions;
```

### 4. Create Storage Bucket for File Uploads

In Supabase dashboard:
1. Go to **Storage** → **Create a new bucket**
2. Name: `job-applications`
3. Public bucket: **No** (private)
4. Click "Create bucket"

Then run this SQL to set up storage policies:

```sql
-- Storage policies for job-applications bucket
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
```

## Step 4: Create Your Admin Account

### Option A: Using Supabase Dashboard (Recommended)

1. Go to **Authentication** → **Users** → **Add user**
2. Enter your email
3. Set a password
4. Click "Create user"
5. Copy the User UID

Then run this SQL to add yourself to admin_users:

```sql
INSERT INTO admin_users (id, email)
VALUES ('your-user-uid-here', 'your-email@example.com');
```

### Option B: Using the App's Sign Up Flow

The app will automatically create the admin_users record when you sign up.

## Step 5: Test Your Connection

1. Restart your dev server: `npm run dev`
2. Check browser console for any Supabase errors
3. Try submitting a test form
4. Log into admin dashboard and verify you see the submission

## Database Schema Overview

### `submissions` Table
| Column | Type | Description |
|--------|------|-------------|
| id | TEXT | Unique submission ID |
| created_at | TIMESTAMP | When submitted |
| type | TEXT | Service type (Residential, Commercial, etc.) |
| status | TEXT | Pending, Confirmed, or Canceled |
| data | JSONB | Complete form data |
| summary | TEXT | AI-generated summary |
| lead_score | INTEGER | AI lead score (0-100) |
| lead_reasoning | TEXT | Why this score |
| admin_notes | TEXT | Admin's private notes |

### `admin_users` Table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Links to auth.users |
| email | TEXT | Admin email |
| created_at | TIMESTAMP | Account created |

## Security Features

✅ **Row Level Security (RLS)**: Enabled on all tables
✅ **Public form submissions**: Anyone can submit
✅ **Protected admin data**: Only authenticated admins can view
✅ **Secure file storage**: Private bucket with access control
✅ **Real-time subscriptions**: Only for authenticated users

## Troubleshooting

### "Supabase credentials not found"
- Check `.env.local` has correct VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
- Restart dev server after updating .env

### "Row Level Security policy violation"
- Make sure you've run all the RLS policies from Step 3
- Check you're logged in when accessing admin dashboard

### "Failed to fetch"
- Verify your Project URL is correct
- Check your internet connection
- Ensure Supabase project is not paused (free tier pauses after inactivity)

### Forms not saving to Supabase
- Check browser console for errors
- Verify submissions table exists
- Ensure RLS policy allows anon inserts

## Next Steps

After setup:
1. Test form submission from homepage
2. Log into admin dashboard
3. Verify real-time updates work
4. Try uploading files in job applications
5. Test on mobile device

## Cost & Limits (Free Tier)

- **Database**: 500 MB storage, unlimited API requests
- **Auth**: Unlimited users
- **Storage**: 1 GB files
- **Bandwidth**: 2 GB/month

This should be plenty for your business. Upgrade only if you exceed these limits.

---

**Need Help?** Check [Supabase Docs](https://supabase.com/docs) or contact support.
