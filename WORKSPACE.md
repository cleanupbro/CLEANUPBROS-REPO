# Workspace Knowledge Base

> Complete guide to understanding the Clean Up Bros codebase structure, architecture, and workflows.

---

## 📚 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Directory Structure](#directory-structure)
4. [Key Components](#key-components)
5. [Data Flow](#data-flow)
6. [API Integrations](#api-integrations)
7. [Design System](#design-system)
8. [Common Patterns](#common-patterns)
9. [Development Workflow](#development-workflow)
10. [Troubleshooting](#troubleshooting)

---

## Project Overview

### What is Clean Up Bros?

Clean Up Bros is a comprehensive **cleaning services platform** that automates the entire customer journey:

```
Customer fills quote → AI processes → Admin notified → Payment link sent → Booking confirmed
```

### Core Business Logic

1. **Quote Generation** - Customers request quotes for cleaning services
2. **AI Pricing** - Google Gemini AI calculates estimated prices
3. **Lead Scoring** - AI analyzes and scores each lead
4. **Automation** - n8n workflows handle notifications and emails
5. **Payment** - Square payment links for easy checkout
6. **Tracking** - Admin dashboard for monitoring all submissions

### Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19 + TypeScript + Vite |
| **Styling** | Tailwind CSS (Apple-inspired design) |
| **Database** | Supabase (PostgreSQL) |
| **Authentication** | Supabase Auth |
| **AI** | Google Gemini AI |
| **Payments** | Square API |
| **Email** | Resend |
| **Automation** | n8n |
| **Notifications** | Telegram Bot API |
| **Hosting** | Vercel |
| **Domain** | GoDaddy → cleanupbros.com.au |

---

## Architecture

### High-Level Architecture

```
┌─────────────┐
│   Customer  │
│   (Browser) │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│   React Frontend (Vite)         │
│   - Quote Forms                 │
│   - Admin Dashboard             │
│   - Public Pages                │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│   Supabase (Backend)            │
│   - PostgreSQL Database         │
│   - Row Level Security          │
│   - Real-time Subscriptions     │
└──────┬──────────────────────────┘
       │
       ├──────────────┬───────────────┬────────────────┐
       ▼              ▼               ▼                ▼
┌──────────┐  ┌───────────┐  ┌──────────────┐  ┌────────────┐
│ n8n      │  │ Gemini AI │  │ Square API   │  │ Resend     │
│ Workflow │  │ Pricing   │  │ Payments     │  │ Email      │
└──────────┘  └───────────┘  └──────────────┘  └────────────┘
       │
       ▼
┌──────────────┐
│ Telegram Bot │
│ Notifications│
└──────────────┘
```

### Request Flow Example

**Customer Submits Residential Quote:**

1. User fills `ResidentialQuoteForm.tsx`
2. Form validation with Zod schemas
3. AI pricing via `services/geminiService.ts`
4. Data saved to Supabase `submissions` table
5. n8n webhook triggered
6. n8n sends:
   - Telegram notification to admin
   - Welcome email to customer via Resend
7. Admin reviews in `AdminDashboard.tsx`
8. Admin generates Square payment link
9. Customer receives payment email
10. Customer pays via Square
11. Booking confirmed

---

## Directory Structure

### Root Directory

```
clean-up-bros-quote-&-application-portal/
├── src/                         # Source code
├── public/                      # Static assets
├── documentation/               # Project documentation
├── email_templates/             # HTML email templates
├── node_modules/                # Dependencies
├── .env.local                   # Environment variables (gitignored)
├── .gitignore                   # Git ignore rules
├── package.json                 # Dependencies and scripts
├── tsconfig.json               # TypeScript config
├── vite.config.ts              # Vite config
├── tailwind.config.ts          # Tailwind CSS config
├── README.md                    # Main documentation
├── CHANGELOG.md                 # Version history
├── WORKSPACE.md                 # This file
└── n8n_workflow_complete.json  # n8n automation workflow
```

### src/ Directory (Main Source)

```
src/
├── main.tsx                    # React entry point
├── App.tsx                     # Main app component with routing
├── index.css                   # Global styles + Tailwind imports
├── constants.ts                # App-wide constants
│
├── components/                 # Reusable React components
│   ├── Navigation.tsx          # Main navigation bar
│   ├── Footer.tsx             # Footer component
│   ├── LoadingSpinner.tsx     # Loading state component
│   └── [other components]
│
├── views/                      # Page-level components
│   ├── LandingView.tsx        # Homepage
│   ├── ResidentialQuoteForm.tsx
│   ├── CommercialQuoteForm.tsx
│   ├── AirbnbQuoteForm.tsx
│   ├── JobApplicationForm.tsx
│   ├── ClientFeedbackForm.tsx
│   ├── AdminDashboard.tsx     # Admin control panel
│   ├── AdminLogin.tsx         # Admin authentication
│   ├── ServicesView.tsx       # Services page
│   ├── AboutView.tsx          # About page
│   ├── ContactView.tsx        # Contact page
│   ├── ReviewsView.tsx        # Reviews page
│   ├── GiftCardPurchaseView.tsx
│   └── ThankYouView.tsx       # Confirmation page
│
├── services/                   # API service modules
│   ├── supabaseClient.ts      # Supabase initialization
│   ├── geminiService.ts       # AI pricing and insights
│   ├── squareService.ts       # Payment link generation
│   └── analytics.ts           # Google Analytics
│
├── utils/                      # Utility functions
│   ├── validators.ts          # Form validation schemas
│   ├── formatters.ts          # Data formatting helpers
│   └── helpers.ts             # General helper functions
│
└── types/                      # TypeScript type definitions
    ├── index.ts               # Main type exports
    ├── forms.ts               # Form data types
    └── database.ts            # Database schema types
```

### public/ Directory

```
public/
├── vite.svg                   # Vite logo
├── cleanupbrosbible.md/       # Media assets folder
│   ├── ADS/                   # Video advertisements (.mp4)
│   ├── Company Logo/          # Brand logos (.png)
│   ├── Mascot/               # Mascot images (.png)
│   └── Before and After/      # Service photos
└── [other static files]
```

---

## Key Components

### 1. Navigation System

**File:** `src/components/Navigation.tsx`

**Purpose:** Main navigation bar with view switching logic

**Key Features:**
- Logo and brand name
- Navigation menu (Home, Services, About, Contact, Reviews, Gift Cards)
- View switching without page reloads
- Admin login button
- Mobile-responsive hamburger menu
- Sticky positioning on scroll

**Navigation Pattern:**
```tsx
const [currentView, setCurrentView] = useState<View>('Landing');

const navigateTo = (view: View) => {
  setCurrentView(view);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
```

### 2. Quote Forms

**Files:**
- `src/views/ResidentialQuoteForm.tsx`
- `src/views/CommercialQuoteForm.tsx`
- `src/views/AirbnbQuoteForm.tsx`

**Common Pattern:**
```tsx
// 1. State management
const [formData, setFormData] = useState<FormData>(initialState);
const [currentStep, setCurrentStep] = useState(1);

// 2. AI pricing
const { estimatedPrice, loading } = useGeminiPricing(formData);

// 3. Form submission
const handleSubmit = async () => {
  // Validate with Zod
  const validated = schema.parse(formData);

  // Save to Supabase
  await supabase.from('submissions').insert({
    ...validated,
    estimated_price: estimatedPrice
  });

  // Trigger n8n webhook (automatic via Supabase)

  // Navigate to thank you page
  navigateTo('ThankYou');
};
```

### 3. Admin Dashboard

**File:** `src/views/AdminDashboard.tsx`

**Key Features:**
- Real-time submission list
- Advanced filtering (date range, service type, status)
- Export to CSV
- Payment link generation
- Analytics cards (revenue, conversion rate, avg deal size)
- AI insights panel

**Data Loading:**
```tsx
useEffect(() => {
  const loadSubmissions = async () => {
    const { data } = await supabase
      .from('submissions')
      .select('*')
      .order('created_at', { ascending: false });

    setSubmissions(data || []);
  };

  loadSubmissions();
}, []);
```

### 4. AI Service Integration

**File:** `src/services/geminiService.ts`

**Functions:**
- `estimatePrice(formData)` - Calculate price based on inputs
- `analyzeSubmission(submission)` - Lead scoring and insights
- `generateInsights(submissions)` - Batch analytics

**Example:**
```typescript
export async function estimatePrice(params: {
  serviceType: string;
  propertySize: number;
  bedrooms?: number;
  // ...
}): Promise<number> {
  const prompt = `Calculate cleaning service price for: ${JSON.stringify(params)}`;

  const response = await gemini.generateContent(prompt);
  const price = parseFloat(response.text());

  return Math.round(price * 100) / 100;
}
```

---

## Data Flow

### Database Schema (Supabase)

#### submissions table

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `created_at` | timestamp | Auto-generated |
| `service_type` | text | 'residential', 'commercial', 'airbnb', 'job_application', 'client_feedback' |
| `customer_name` | text | Full name |
| `customer_email` | text | Email address |
| `customer_phone` | text | Phone number |
| `estimated_price` | numeric | AI-generated estimate |
| `status` | text | 'pending', 'contacted', 'quoted', 'booked', 'completed' |
| `lead_score` | integer | 1-10 AI scoring |
| `metadata` | jsonb | Service-specific data |

#### users table

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key (from Supabase Auth) |
| `email` | text | Admin email |
| `created_at` | timestamp | Account creation |

### Row Level Security (RLS)

**submissions table:**
```sql
-- Enable RLS
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (for public quote forms)
CREATE POLICY "Allow public insert" ON submissions
  FOR INSERT WITH CHECK (true);

-- Only authenticated users can view/update
CREATE POLICY "Allow authenticated read" ON submissions
  FOR SELECT USING (auth.uid() IS NOT NULL);
```

---

## API Integrations

### 1. Supabase

**Configuration:** `src/services/supabaseClient.ts`

```typescript
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
```

**Common Operations:**

```typescript
// Insert
await supabase.from('submissions').insert(data);

// Query
const { data } = await supabase
  .from('submissions')
  .select('*')
  .eq('service_type', 'residential');

// Real-time subscription
supabase
  .channel('submissions')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'submissions'
  }, handleNewSubmission)
  .subscribe();
```

### 2. Google Gemini AI

**Configuration:** `src/services/geminiService.ts`

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
```

**Rate Limits:** 15 requests/minute (free tier)

### 3. Square Payments

**Configuration:** `src/services/squareService.ts`

```typescript
import { Client, Environment } from 'square';

const client = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: Environment.Production
});

export async function createPaymentLink(amount: number, description: string) {
  const response = await client.checkoutApi.createPaymentLink({
    // ...
  });
  return response.result.paymentLink.url;
}
```

### 4. n8n Automation

**Workflow Triggers:**
- New submission in Supabase
- Payment completed
- Admin action (manual trigger)

**Workflow Actions:**
- Send Telegram notification
- Send email via Resend
- Update CRM
- Generate payment link

**Workflow File:** `n8n_workflow_complete.json`

**Import Instructions:**
1. Login to n8n at https://nioctibinu.online
2. Go to Workflows → Import
3. Upload `n8n_workflow_complete.json`
4. Update credentials for each node
5. Activate workflow

---

## Design System

### Color Palette

```css
/* Primary Colors */
--brand-gold: #F2B705;      /* CTA buttons, accents */
--brand-navy: #1D1D1F;      /* Text, dark backgrounds */

/* Apple-Style Colors */
--apple-blue: #0071e3;      /* Links, interactive elements */
--apple-subtext: #86868b;   /* Secondary text */
--apple-bg: #F5F5F7;        /* Light backgrounds */

/* Gradients */
background: linear-gradient(to bottom right, from-black/70 via-black/50 to-black/70);
background: linear-gradient(to bottom right, from-#F5F5F7 to-white);
background: linear-gradient(to bottom right, from-#1D1D1F to-gray-900);
```

### Typography Scale

```css
/* Headings */
text-7xl (72px)  - Hero titles
text-6xl (60px)  - Major headings
text-5xl (48px)  - Page headings
text-4xl (36px)  - Section headings
text-3xl (30px)  - Subsection headings
text-2xl (24px)  - Card titles
text-xl  (20px)  - Large body text
text-lg  (18px)  - Body text
text-base (16px) - Default text
text-sm  (14px)  - Small text
text-xs  (12px)  - Tiny text
```

### Component Classes

**Apple-Style Card:**
```css
.apple-card {
  @apply bg-white rounded-2xl shadow-lg p-6;
}
```

**Button Styles:**
```css
.btn-primary {
  @apply bg-brand-gold text-brand-navy px-8 py-3 rounded-full
         font-semibold hover:shadow-xl transition-all duration-300
         transform hover:scale-105;
}

.btn-secondary {
  @apply bg-transparent border-2 border-brand-navy text-brand-navy
         px-8 py-3 rounded-full font-semibold hover:bg-brand-navy
         hover:text-white transition-all duration-300;
}
```

**Hero Section:**
```css
.hero-unit {
  @apply min-h-[650px] md:min-h-[750px] bg-black text-white
         mb-0 relative group overflow-hidden;
}

.hero-unit-text {
  @apply relative z-10 flex flex-col items-center justify-center
         h-full px-4 text-center;
}
```

### Animation Classes

```css
/* Slow zoom for backgrounds */
@keyframes slow-zoom {
  from { transform: scale(1); }
  to { transform: scale(1.1); }
}

.animate-slow-zoom {
  animation: slow-zoom 20s ease-in-out infinite alternate;
}

/* Floating animation */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

/* Fade in up */
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out;
}
```

---

## Common Patterns

### 1. Multi-Step Forms

**Pattern Used In:** All quote forms

```tsx
const [currentStep, setCurrentStep] = useState(1);
const totalSteps = 4;

const nextStep = () => {
  if (currentStep < totalSteps) {
    setCurrentStep(currentStep + 1);
  }
};

const prevStep = () => {
  if (currentStep > 1) {
    setCurrentStep(currentStep - 1);
  }
};

// Render based on step
{currentStep === 1 && <PropertyDetailsStep />}
{currentStep === 2 && <CleaningPreferencesStep />}
{currentStep === 3 && <ContactDetailsStep />}
{currentStep === 4 && <ReviewAndSubmitStep />}
```

### 2. Loading States

```tsx
const [loading, setLoading] = useState(false);

const handleAction = async () => {
  setLoading(true);
  try {
    await performAction();
  } finally {
    setLoading(false);
  }
};

return (
  <button disabled={loading}>
    {loading ? <LoadingSpinner /> : 'Submit'}
  </button>
);
```

### 3. Error Handling

```tsx
const [error, setError] = useState<string | null>(null);

try {
  const result = await riskyOperation();
  setError(null);
} catch (err) {
  setError(err instanceof Error ? err.message : 'An error occurred');
  console.error('Operation failed:', err);
}

{error && (
  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
    {error}
  </div>
)}
```

### 4. Form Validation with Zod

```tsx
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Phone must be 10 digits')
});

try {
  const validated = schema.parse(formData);
  // Proceed with validated data
} catch (error) {
  if (error instanceof z.ZodError) {
    // Handle validation errors
    setErrors(error.errors);
  }
}
```

---

## Development Workflow

### Daily Development Routine

```bash
# 1. Start development server
npm run dev

# 2. Open browser
# http://localhost:3000

# 3. Make changes to code
# Files auto-reload on save

# 4. Check browser console for errors (F12)

# 5. When ready to deploy:
git add .
git commit -m "feat: description"
git push origin main

# 6. Vercel auto-deploys (2-3 minutes)
# Check https://cleanupbros.com.au
```

### Adding a New Page

1. **Create view component:**
```tsx
// src/views/NewPageView.tsx
import React from 'react';
import { NavigationProps } from '../types';

const NewPageView: React.FC<NavigationProps> = ({ navigateTo }) => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="hero-unit">
        <div className="hero-unit-text">
          <h1 className="text-5xl md:text-7xl font-bold">
            New Page
          </h1>
        </div>
        <div className="absolute inset-0 bg-cover bg-center animate-slow-zoom"
             style={{ backgroundImage: `url(...)` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        {/* Your content here */}
      </div>
    </div>
  );
};

export default NewPageView;
```

2. **Add to types:**
```tsx
// src/types/index.ts
export type View =
  | 'Landing'
  | 'NewPage'  // Add this
  | ...;
```

3. **Add to App.tsx:**
```tsx
// src/App.tsx
import NewPageView from './views/NewPageView';

// In renderView function:
case 'NewPage':
  return <NewPageView navigateTo={navigateTo} />;
```

4. **Add to Navigation:**
```tsx
// src/components/Navigation.tsx
<button onClick={() => navigateTo('NewPage')}>
  New Page
</button>
```

### Adding a New API Integration

1. **Create service file:**
```tsx
// src/services/newService.ts
const API_KEY = import.meta.env.VITE_NEW_API_KEY;

export async function callAPI(data: any) {
  const response = await fetch('https://api.example.com', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  return response.json();
}
```

2. **Add environment variable:**
```bash
# .env.local
VITE_NEW_API_KEY=your_api_key_here
```

3. **Use in component:**
```tsx
import { callAPI } from '../services/newService';

const handleAction = async () => {
  const result = await callAPI(formData);
  console.log(result);
};
```

---

## Troubleshooting

### Common Issues

#### 1. "Module not found" errors

**Cause:** Missing dependencies

**Fix:**
```bash
npm install
```

#### 2. Environment variables not working

**Cause:** Variables must start with `VITE_` for frontend access

**Fix:**
```env
# ❌ Wrong
API_KEY=abc123

# ✅ Correct
VITE_API_KEY=abc123
```

**Restart dev server after changes:**
```bash
npm run dev
```

#### 3. Supabase connection failed

**Check:**
- VITE_SUPABASE_URL is correct
- VITE_SUPABASE_ANON_KEY is correct
- Project is active in Supabase dashboard
- RLS policies allow access

#### 4. Build fails on Vercel

**Common causes:**
- Missing environment variables in Vercel dashboard
- TypeScript errors
- Missing dependencies

**Check:**
1. Vercel Dashboard → Project → Settings → Environment Variables
2. Build logs for specific errors
3. Run `npm run build` locally to test

#### 5. Changes not showing on live site

**Fix:**
```bash
# Hard refresh browser
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (Mac)

# Or clear browser cache
```

**Check deployment:**
- Vercel Dashboard → Deployments
- Ensure latest deployment shows "Ready"
- Check deployment logs for errors

---

## Quick Reference

### Important URLs

| Resource | URL |
|----------|-----|
| **Live Site** | https://cleanupbros.com.au |
| **Admin Dashboard** | https://cleanupbros.com.au/AdminLogin |
| **Vercel Dashboard** | https://vercel.com/cleanupbro/my-claude-code-build |
| **Supabase Dashboard** | https://supabase.com/dashboard/project/rtnamqbkowtrwogelgqv |
| **n8n Workflows** | https://nioctibinu.online |
| **GitHub Repo** | https://github.com/cleanupbro/MY-CLAUDE-CODE-BUILD- |

### Important Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run preview         # Preview production build

# Git
git status              # Check changes
git add .               # Stage all changes
git commit -m "msg"     # Commit changes
git push origin main    # Push to GitHub

# Deployment
# Automatic on push to main - no manual deployment needed
```

### File Locations

| What | Where |
|------|-------|
| **Forms** | `src/views/*Form.tsx` |
| **Services** | `src/services/*.ts` |
| **Components** | `src/components/*.tsx` |
| **Types** | `src/types/*.ts` |
| **Styles** | `src/index.css`, `tailwind.config.ts` |
| **Config** | `vite.config.ts`, `tsconfig.json` |
| **Env Vars** | `.env.local` (gitignored) |
| **Documentation** | `documentation/`, `*.md` files |

---

## Learning Path

### New to the Project?

1. **Start Here:**
   - Read `README.md` - Overview and setup
   - Read `CHANGELOG.md` - Recent changes
   - Run `npm run dev` - See it in action

2. **Understand the Flow:**
   - Fill out a quote form on localhost
   - Check browser console (F12) for logs
   - See data in Supabase dashboard

3. **Explore the Code:**
   - Read `src/App.tsx` - Main app structure
   - Read `src/views/LandingView.tsx` - Homepage
   - Read `src/views/ResidentialQuoteForm.tsx` - Form example

4. **Make Small Changes:**
   - Edit text in `LandingView.tsx`
   - Change a color in `tailwind.config.ts`
   - Add a new navigation link

5. **Deploy:**
   - Commit changes: `git commit -m "test"`
   - Push: `git push origin main`
   - Watch deployment in Vercel dashboard
   - See changes live at cleanupbros.com.au

### Key Files to Know

**Most Important:**
1. `src/App.tsx` - Main routing and view switching
2. `src/components/Navigation.tsx` - Navigation bar
3. `src/views/LandingView.tsx` - Homepage
4. `src/views/AdminDashboard.tsx` - Admin panel
5. `src/services/supabaseClient.ts` - Database connection

**Configuration:**
6. `vite.config.ts` - Build configuration
7. `tailwind.config.ts` - Design system
8. `.env.local` - API keys and secrets

**Documentation:**
9. `README.md` - Main docs
10. `CHANGELOG.md` - Version history
11. `WORKSPACE.md` - This file

---

## Next Steps

After understanding this workspace:

1. **Try making a change:**
   - Edit a page title
   - Add a new navigation link
   - Change a color

2. **Deploy your change:**
   - Commit and push to GitHub
   - Watch auto-deployment
   - See it live

3. **Explore deeper:**
   - Read other `.md` files in `documentation/`
   - Study n8n workflow
   - Review email templates

4. **Build something new:**
   - Add a new form
   - Create a new page
   - Integrate a new API

---

**Questions?** Check the other documentation files or contact the development team.

**Last Updated:** December 23, 2025
**Version:** 1.1.0
