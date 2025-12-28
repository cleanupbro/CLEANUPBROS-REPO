# PROJECT CONTEXT - Clean Up Bros Quote Portal
## Read This First Every Session (Saves Tokens)

**Last Updated:** December 28, 2025
**Status:** LIVE on Vercel

---

## WHAT THIS FILE IS

This is the **project context** - everything about THIS specific project:
- Current state, what's working, what's not
- Webhooks, APIs, deployment info
- File structure and where things are
- Where we left off

This is NOT a skill file. Skills teach HOW to do things (like website design patterns).
This file tells you WHAT exists in this project right now.

---

## PROJECT STATE

```yaml
Project: Clean Up Bros Quote Portal
Path: Desktop/CLAUDECODE🤖.MD/clean-up-bros-quote-&-application-portal/
Stack: Vite + React 19 + TypeScript + Tailwind CSS
Theme: Antigravity (floating orbs, teal #008080)
Status: LIVE - All systems working
```

---

## QUICK COMMANDS

```bash
# Start dev server
npm run dev  # → http://localhost:3001

# Build for production
npm run build

# Deploy (auto via GitHub push)
git add . && git commit -m "message" && git push origin main
# Vercel auto-deploys on push
```

---

## DEPLOYMENT

| Item | Value |
|------|-------|
| GitHub | https://github.com/cleanupbro/MY-CLAUDE-CODE-BUILD-.git |
| Vercel | https://vercel.com/shamals-projects-0f4386e4/my-claude-code-build |
| Live URL | https://cleanupbros.com.au |
| Auto-Deploy | Yes - on push to main |

---

## BRAND COLORS

```css
--teal: #008080       /* Primary - buttons, focus states */
--teal-dark: #006666  /* Hover states */
--gold: #F2B705       /* Accent - prices, highlights */
--navy: #0B2545       /* Hero backgrounds */
--navy-light: #134074 /* Gradients */
--green: #34a853      /* Success states */
```

---

## WEBHOOKS (All Working - Dec 28)

```
RESIDENTIAL:  /webhook/98d35453-4f18-40ca-bdfa-ba3aaa02646c
COMMERCIAL:   /webhook/bb5fdb61-31d7-4001-9dd1-44ef7dc64d32
AIRBNB:       /webhook/5d3f6ff4-5f08-4ccf-9b78-03b62ae6b72f
JOBS:         /webhook/67f764f2-adff-481e-aa49-fd3de1feecde
FEEDBACK:     /webhook/client-feedback
LANDING:      /webhook/8fe0b2c9-3d5b-44f5-84ff-0d0ef896e1fa
GIFT_CARD:    /webhook/gift-card-purchase
PAYMENT:      /webhook/create-payment-link

Base URL: https://nioctibinu.online
```

---

## KEY FILES

### Views (in /views/)
| File | Purpose |
|------|---------|
| LandingView.tsx | Homepage with hero + quick quote |
| ResidentialQuoteView.tsx | Multi-step residential form |
| CommercialQuoteView.tsx | Commercial quote form |
| AirbnbQuoteView.tsx | Airbnb turnover form |
| ServicesView.tsx | Services listing |
| AboutView.tsx | About page |
| ContactView.tsx | Contact form |
| ReviewsView.tsx | Customer reviews |
| GiftCardPurchaseView.tsx | Buy gift cards |
| CheckBalanceView.tsx | Check gift card balance |
| ClientFeedbackView.tsx | Customer feedback + NPS |
| AdminLoginView.tsx | Admin authentication |
| AdminDashboardView.tsx | Admin panel |

### Components (in /components/)
| File | Purpose |
|------|---------|
| AntigravityBackground.tsx | FloatingCard wrapper + orbs |
| MultiStepForm.tsx | Step-by-step form component |
| Header.tsx | Navigation header |
| Footer.tsx | Site footer |

### Styling
| File | Purpose |
|------|---------|
| index.html | Tailwind config + .input/.select classes |
| styles/design-system.css | Animations + glassmorphism |

---

## ANTIGRAVITY THEME PATTERNS

### Hero Section Template
```tsx
<section className="relative min-h-[60vh] flex items-center justify-center pt-16 overflow-hidden">
  <div className="absolute inset-0 bg-gradient-to-br from-[#0B2545] via-[#134074] to-[#0B2545]" />

  {/* Floating orbs */}
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    <div className="absolute w-64 h-64 rounded-full bg-[#F2B705]/30 blur-3xl top-10 -left-32 animate-drift" />
    <div className="absolute w-48 h-48 rounded-full bg-[#008080]/30 blur-3xl bottom-10 -right-24 animate-drift" style={{ animationDelay: '2s' }} />
  </div>

  <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 animate-fadeInUp">
      Your Title <span className="gradient-text-brand">Highlight</span>
    </h1>
  </div>
</section>
```

### FloatingCard Usage
```tsx
import { FloatingCard } from '../components/AntigravityBackground';

<FloatingCard delay={0.1}>
  <div className="floating-card bg-white rounded-3xl p-8 border border-gray-100 shadow-xl">
    {/* Content */}
  </div>
</FloatingCard>
```

### Form Input Styling
```css
/* Already in index.html - just use class="input" or class="select" */
.input { /* Teal focus, gray-100 bg */ }
.select { /* Same styling */ }
.checkbox-label { /* Teal on check */ }
.btn-primary { /* Teal gradient */ }
```

---

## TESTING WEBHOOKS

```bash
# Test Residential
curl -X POST "https://nioctibinu.online/webhook/98d35453-4f18-40ca-bdfa-ba3aaa02646c" \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test","email":"test@test.com","phone":"0400000000","suburb":"Test","TEST":true}'

# Test Telegram directly
curl -X POST "https://api.telegram.org/bot7851141818:AAE7KnPJUL5QW82OhaLN2aaE7Shpq1tQQbk/sendMessage" \
  -H "Content-Type: application/json" \
  -d '{"chat_id":"-1003155659527","text":"Test message"}'
```

---

## COMMON TASKS

### Add New View
1. Create `views/NewView.tsx`
2. Add lazy import in `App.tsx`
3. Add case in `renderView()` switch
4. Add to `ViewType` in `types.ts`
5. Add navigation in Header if needed

### Update Styling
1. Form inputs: Edit `.input` in `index.html`
2. Buttons: Edit `.btn-primary` in `index.html`
3. Animations: Edit `styles/design-system.css`
4. Colors: Edit Tailwind config in `index.html`

### Deploy Changes
1. Make changes
2. Test locally: `npm run dev`
3. Build: `npm run build`
4. Push: `git add . && git commit -m "message" && git push origin main`
5. Vercel auto-deploys

---

## TROUBLESHOOTING

### NPM Cache Error
```bash
sudo chown -R $(whoami) ~/.npm
```

### Port Already in Use
Dev server falls back to 3001 if 3000 is busy

### Webhook Not Working
1. Check N8N dashboard: https://nioctibinu.online
2. Verify workflow is ACTIVE
3. Test with curl

---

## WHERE I LEFT OFF (Dec 28, 2025)

**Completed:**
- All views updated with Antigravity theme
- Form styling fixed (teal colors)
- All 7 webhooks tested and working
- Telegram notifications active
- Deployed to Vercel

**Next Session Can:**
- Add more pages as needed
- Enhance admin dashboard
- Set up Google Sheets logging (needs OAuth in N8N)

---

*Read this file first. It tells you where we are, not how to build things.*
