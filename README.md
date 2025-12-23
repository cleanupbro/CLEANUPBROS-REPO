# 🌟 Clean Up Bros - Quote & Application Portal

> **Production-ready cleaning services platform with AI-powered pricing, automated workflows, and seamless payment integration.**

[![Live Site](https://img.shields.io/badge/Live-cleanupbros.com.au-success)](https://cleanupbros.com.au)
[![Deployment](https://img.shields.io/badge/Deployment-Vercel-black)](https://vercel.com)
[![Framework](https://img.shields.io/badge/Framework-React%2019-blue)](https://react.dev)
[![Build](https://img.shields.io/badge/Build-Vite-purple)](https://vitejs.dev)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Development Workflow](#-development-workflow)
- [Deployment](#-deployment)
- [API Integrations](#-api-integrations)
- [Project Structure](#-project-structure)
- [Available Scripts](#-available-scripts)
- [Logs & Monitoring](#-logs--monitoring)
- [Troubleshooting](#-troubleshooting)

---

## 🎯 Overview

**Clean Up Bros** is a comprehensive cleaning services platform that automates the entire customer journey from quote request to payment completion.

### **Live URLs:**
- **Production:** https://cleanupbros.com.au
- **WWW:** https://www.cleanupbros.com.au
- **Vercel URL:** https://my-claude-code-build.vercel.app

### **Key Capabilities:**
- AI-powered instant price estimation using Google Gemini
- Automated lead scoring and qualification
- Multi-channel admin notifications (Telegram, Email, SMS)
- Secure payment link generation via Square
- Complete backend automation with n8n workflows
- Professional email communications via Resend
- Real-time analytics and insights dashboard

---

## ✨ Features

### **Customer-Facing:**
- 🏠 **Residential Cleaning Quotes** - Multi-step form with AI pricing
- 🏢 **Commercial Cleaning Quotes** - Custom pricing for businesses
- 🏖️ **Airbnb Turnover Quotes** - Specialized short-term rental cleaning
- 💼 **Job Applications** - Streamlined cleaner recruitment
- ⭐ **Client Feedback** - NPS scoring and testimonial collection
- 📱 **Mobile-First Design** - Responsive across all devices
- 🎨 **Glassmorphism UI** - Modern Apple-style design

### **Admin Features:**
- 📊 **Analytics Dashboard** - Revenue, conversion, lead metrics
- 🔍 **Advanced Filtering** - Search, filter, export submissions
- 💳 **Payment Link Generation** - One-click Square payment links
- 🤖 **AI Insights** - Automated lead scoring and analysis
- 📧 **Email Preview** - Review automated customer emails
- 🔒 **Secure Authentication** - Supabase auth with RLS
- 📈 **Performance Metrics** - Track KPIs and growth

### **Automation:**
- ⚡ **Instant Notifications** - Telegram + Email alerts on new quotes
- 📨 **Welcome Emails** - Automated customer onboarding
- 💰 **Payment Requests** - Auto-generated Square payment links
- 📋 **CRM Integration** - n8n workflow automation
- 🔄 **Status Updates** - Real-time submission tracking

---

## 🛠️ Tech Stack

### **Frontend:**
- React 19, TypeScript, Vite, Tailwind CSS, Zod

### **Backend & Services:**
- Supabase, n8n, Square API, Resend, Telegram Bot API, Google Gemini AI

### **Hosting & Deployment:**
- Vercel, GitHub, GoDaddy

---

## 🚀 Getting Started

### **Prerequisites:**
- Node.js >= 18.0.0
- npm >= 9.0.0
- Git

### **Installation:**

```bash
# Clone repository
git clone https://github.com/cleanupbro/MY-CLAUDE-CODE-BUILD-.git
cd MY-CLAUDE-CODE-BUILD-

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Add your environment variables (see below)

# Start development server
npm run dev

# Visit: http://localhost:3000
```

---

## 🔑 Environment Variables

Create `.env.local` in the root directory:

```env
# SUPABASE
VITE_SUPABASE_URL=https://rtnamqbkowtrwogelgqv.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_8_55hVJqyWOM-dfjpBZQkw_nscTf6ky

# GOOGLE ANALYTICS
VITE_GA_MEASUREMENT_ID=G-CLEANUPBROS01

# SQUARE PAYMENTS (Optional - for production)
SQUARE_ACCESS_TOKEN=sq0atp-xxxxx
SQUARE_LOCATION_ID=LXXXXX
SQUARE_APPLICATION_ID=sq0idp-xxxxx

# RESEND EMAIL (Optional - for production)
RESEND_API_KEY=re_xxxxx
RESEND_FROM_EMAIL=hello@cleanupbros.com.au

# TELEGRAM BOT (Optional - for production)
TELEGRAM_BOT_TOKEN=123456:ABC-DEF...
TELEGRAM_ADMIN_CHAT_ID=123456789

# GEMINI AI (Optional)
GEMINI_API_KEY=AIzaSy...
```

**See `API.md` for detailed instructions on obtaining all API keys.**

---

## 💻 Development Workflow

### **Daily Development:**

```bash
# 1. Pull latest changes
git pull origin main

# 2. Start dev server
npm run dev

# 3. Make your changes

# 4. Test locally at http://localhost:3000

# 5. Commit changes
git add .
git commit -m "feat: Description"

# 6. Push to GitHub
git push origin main

# 7. Vercel auto-deploys (2-3 minutes)
# Visit https://cleanupbros.com.au to see changes live
```

---

## 🚀 Deployment

### **Automatic Deployment:**

**Every push to `main` branch triggers automatic deployment!**

```bash
git push origin main
# → Vercel automatically builds and deploys
# → Site updates at cleanupbros.com.au in 2-3 minutes
```

### **Deployment Status:**
- **Vercel Dashboard:** https://vercel.com/cleanupbro/my-claude-code-build
- **View Logs:** Deployments → Click deployment → Build Logs
- **Rollback:** Promote previous deployment if needed

---

## 🔗 API Integrations

### **1. Supabase** (Database & Auth)
- Tables: `submissions`, `users`
- Logs: Supabase Dashboard → Logs
- Authentication: Email/password with RLS

### **2. Square** (Payment Processing)
- Generate payment links for confirmed bookings
- Logs: Square Dashboard → Transactions
- Rate limits: 500 requests/minute

### **3. Resend** (Email Service)
- Send welcome, payment, admin emails
- Templates in `email_templates/` folder
- Logs: Resend Dashboard → Emails
- Rate limits: 100 emails/day (free tier)

### **4. Telegram Bot** (Admin Notifications)
- Instant push notifications on new quotes
- Setup: See `TELEGRAM_BOT_SETUP.md`
- Logs: n8n executions

### **5. Google Gemini AI** (AI Features)
- Price estimation and lead scoring
- Rate limits: 15 requests/minute (free tier)

### **6. n8n** (Workflow Automation)
- Hosted at: https://nioctibinu.online
- Import workflow: `n8n_workflow_complete.json`
- Logs: Executions tab

---

## 📁 Project Structure

```
├── src/
│   ├── components/         # React components
│   ├── views/             # Page views
│   ├── services/          # API services
│   ├── utils/             # Utilities
│   ├── types/             # TypeScript types
│   └── constants.ts       # App constants
│
├── email_templates/       # HTML email templates
├── documentation/         # Complete docs
├── test_data.sql         # Sample data
├── n8n_workflow_complete.json  # n8n workflow
└── .env.local            # Environment variables
```

---

## 📜 Available Scripts

```bash
# Development
npm run dev              # Start dev server (http://localhost:3000)

# Build
npm run build           # Build for production
npm run preview         # Preview production build

# Type Checking
npm run type-check      # Validate TypeScript types
```

---

## 📊 Logs & Monitoring

### **Development Logs:**
- Terminal output from `npm run dev`
- Hot reload updates, build status

### **Build Logs (Vercel):**
- Vercel Dashboard → Deployments → Build Logs
- Shows npm install, vite build, deployment steps

### **Database Logs (Supabase):**
- Supabase Dashboard → Logs → API Logs
- All database queries and errors

### **Workflow Logs (n8n):**
- https://nioctibinu.online → Executions
- All automation workflow runs

### **Error Logs:**
- Browser Console (F12) → Frontend errors
- Vercel Logs → Build/deployment errors
- Supabase Logs → Database errors
- n8n Executions → Workflow errors

---

## 🐛 Troubleshooting

### **Build Fails - "terser not found":**
```bash
npm install terser --save-dev
git push origin main
```

### **Environment Variables Not Working:**
```bash
# Verify .env.local exists
# Variables must start with VITE_ for frontend
# Restart dev server after changes
npm run dev
```

### **Supabase Connection Failed:**
- Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
- Verify project is active in Supabase Dashboard
- Check RLS policies

### **Site Not Updating After Push:**
- Check Vercel Dashboard → Deployments
- Hard refresh: Ctrl+Shift+R
- Clear browser cache

### **SSL Certificate Issues:**
- Wait 5-10 minutes after DNS verification
- Check Vercel → Domains → SSL status
- Hard refresh browser

---

## 📞 Support

### **Documentation:**
- **API Keys:** `API.md`
- **Deployment:** `DEPLOY_TO_GODADDY_DOMAIN.md`
- **Setup Guide:** `COMPLETE_SETUP_TESTING_GUIDE.md`
- **n8n Workflows:** `N8N_BACKEND_SETUP.md`
- **Telegram:** `TELEGRAM_BOT_SETUP.md`

### **Contact:**
- **Email:** cleanupbros.au@gmail.com
- **Phone:** +61 406 764 585
- **Website:** https://cleanupbros.com.au

---

## 🎯 Quick Links

| Resource | URL |
|----------|-----|
| **Live Site** | https://cleanupbros.com.au |
| **Admin Login** | https://cleanupbros.com.au/AdminLogin |
| **Vercel Dashboard** | https://vercel.com/cleanupbro/my-claude-code-build |
| **Supabase** | https://supabase.com/dashboard/project/rtnamqbkowtrwogelgqv |
| **n8n Workflows** | https://nioctibinu.online |
| **GitHub Repo** | https://github.com/cleanupbro/MY-CLAUDE-CODE-BUILD- |

---

## 🎨 Recent Updates (v1.1.0 - December 23, 2025)

**Major UI/UX Redesign** - All public pages redesigned with modern Apple-inspired aesthetic:

- ✅ **Reviews Page** - Full-width hero, modern review cards, trust badges
- ✅ **Gift Cards Page** - Enhanced purchase flow, benefits showcase, dark gradient summary
- ✅ **About Page** - Animated story section, stats display, service areas
- ✅ **Services Page** - Core services grid, add-ons section, process flow
- ✅ **Contact Page** - Contact form, info cards, FAQ section

**Design Highlights:**
- Large, bold typography (text-5xl to text-7xl)
- Apple-style cards with smooth hover animations
- Professional color scheme (Gold #F2B705, Navy #1D1D1F)
- Full-width hero sections with background images
- Consistent gradient overlays and shadows

See [CHANGELOG.md](CHANGELOG.md) for complete details.

---

## ✨ Production Ready

This is a **production-grade application** with enterprise features worth $15,000-$25,000 if built by an agency.

**Status:** 🟢 Live on cleanupbros.com.au
**Last Updated:** December 23, 2025
**Version:** 1.1.0

Made with ❤️ by Clean Up Bros Development Team
