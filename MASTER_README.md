# MASTER README - Complete Handoff Document
## Clean Up Bros & OpBros.Automation Workspace

**Last Updated:** December 29, 2025
**Owner:** Hafsah Nuzhat / Shamal Krishna
**Handoff Created By:** Claude Code (Opus 4.5)

---

## QUICK REFERENCE

| Project | URL | Stack | Status |
|---------|-----|-------|--------|
| Clean Up Bros | https://cleanupbros.com.au | Vite + React 19 + Tailwind | LIVE |
| OpBros.Automation | https://opbros.online | Next.js 14 + Tailwind | LIVE |
| N8N Backend | https://nioctibinu.online | N8N Automation | LIVE (18 workflows) |

---

## PROJECT 1: CLEAN UP BROS QUOTE PORTAL

### Overview
- **Purpose:** Customer-facing quote portal for cleaning services
- **Business:** Professional cleaning company based in Liverpool, NSW (Western Sydney)
- **Services:** Residential, Commercial, End-of-Lease, Airbnb turnover cleaning
- **Phone:** +61 406 764 585
- **Email:** cleanupbros.au@gmail.com

### Technical Stack
```yaml
Frontend: Vite 6.2.1 + React 19 + TypeScript
Styling: Tailwind CSS 4.1.4 + Custom Antigravity Theme
Backend: N8N workflows at nioctibinu.online
Payments: Square API (via N8N)
Database: Supabase (gift cards), Google Sheets (leads)
Hosting: Vercel (auto-deploy from GitHub)
Analytics: Google Analytics G-TQW2MRZ309
```

### Project Structure
```
clean-up-bros-quote-&-application-portal/
├── App.tsx                    # Main app with view routing
├── index.html                 # Entry point + Antigravity CSS theme
├── constants.ts               # Webhook URLs
├── types.ts                   # TypeScript interfaces
├── components/
│   ├── Header.tsx             # Navigation header
│   ├── Footer.tsx             # Site footer
│   ├── ChatWidget.tsx         # AI chat integration
│   ├── AntigravityBackground.tsx  # Canvas particle effect
│   └── [20+ more components]
├── views/
│   ├── LandingView.tsx        # Homepage
│   ├── ResidentialQuoteView.tsx
│   ├── CommercialQuoteView.tsx
│   ├── AirbnbQuoteView.tsx
│   ├── JobApplicationView.tsx
│   ├── GiftCardPurchaseView.tsx
│   ├── AdminDashboardView.tsx
│   └── [10+ more views]
├── services/
│   ├── giftCardService.ts     # Supabase CRUD
│   └── squareService.ts       # Square payment API
└── .claude/commands/
    └── debug.md               # Debug skill (/debug)
```

### Webhook Endpoints (N8N)
All webhooks are at `https://nioctibinu.online/webhook/`

| Webhook | Path | Status |
|---------|------|--------|
| Residential Quote | `/98d35453-4f18-40ca-bdfa-ba3aaa02646c` | ACTIVE |
| Commercial Quote | `/bb5fdb61-31d7-4001-9dd1-44ef7dc64d32` | ACTIVE |
| Airbnb Quote | `/5d3f6ff4-5f08-4ccf-9b78-03b62ae6b72f` | ACTIVE |
| Job Application | `/67f764f2-adff-481e-aa49-fd3de1feecde` | ACTIVE |
| Client Feedback | `/client-feedback` | ACTIVE |
| Landing Lead | `/8fe0b2c9-3d5b-44f5-84ff-0d0ef896e1fa` | ACTIVE |
| Booking Confirmation | `/booking-confirmed` | ACTIVE |
| Payment Link (Square) | `/create-payment-link` | ACTIVE |
| AI Chat | `/cub-ai-chat` | ACTIVE |
| SMS Follow-up | `/cub-sms-followup` | ACTIVE |
| Inbound Call | `/cub-inbound-call` | ACTIVE |
| Outbound Call | `/cub-outbound-call` | ACTIVE |

### GitHub & Deployment
```
Repository: https://github.com/cleanupbro/MY-CLAUDE-CODE-BUILD-.git
Branch: main
Vercel: Auto-deploys on push to main
Domain: cleanupbros.com.au → Vercel
```

### Recent Changes (Dec 29, 2025)
1. Added complete Antigravity CSS theme (glassmorphism, animations)
2. Added AntigravityBackground canvas particle effect
3. Fixed form text visibility (dark text on light backgrounds)
4. Added Google Analytics G-TQW2MRZ309
5. Created comprehensive debug skill (/debug)
6. Updated SEO meta tags

### Known Issues
- Gift card purchase flow needs Supabase configuration verification
- Some views may need theme consistency review

---

## PROJECT 2: OPBROS.AUTOMATION

### Overview
- **Purpose:** AI Automation Agency website
- **Tagline:** "Stop Hiring. Start Automating."
- **Target:** 5-50 employee businesses
- **Price Range:** $500 - $20,000

### Technical Stack
```yaml
Frontend: Next.js 14.2.21 + TypeScript
Styling: Tailwind CSS + Antigravity Theme
Hosting: Vercel (auto-deploy from GitHub)
Lead Capture: N8N webhook
```

### Project Structure
```
opbros.md/opbros-automation/website/
├── src/app/
│   ├── page.tsx               # Homepage
│   ├── services/page.tsx      # Services page
│   ├── pricing/page.tsx       # Pricing + ROI Calculator
│   ├── about/page.tsx         # About page
│   ├── contact/page.tsx       # Contact page
│   ├── blog/page.tsx          # Blog listing
│   └── case-studies/page.tsx  # Case studies
├── src/components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── AntigravityBackground.tsx
│   └── LeadCapture.tsx
```

### GitHub & Deployment
```
Repository: https://github.com/cleanupbro/opbros.automation1
Branch: main
Vercel: Auto-deploys on push
Domain: opbros.online → Vercel
```

---

## N8N WORKFLOWS (18 ACTIVE)

All workflows run on: `https://nioctibinu.online`

### Clean Up Bros Workflows

| ID | Name | Status | Nodes |
|----|------|--------|-------|
| 49xi6gSdDwMlcHmj | CLEAN UP BROS ROI - OPTIMIZED | ACTIVE | 13 |
| BhC9oeocD3MLWDRK | AI Chat Widget (Gemini) | ACTIVE | 6 |
| FO3EBleUNJlLkscB | Outbound Sales Caller (ElevenLabs AI) | ACTIVE | 6 |
| aK91nwonDiEdNLxQ | Inbound Call Agent (ElevenLabs AI) | ACTIVE | 5 |
| Qw5wXjnkwktS7C9e | Booking Confirmation & Reminders | ACTIVE | 6 |
| TWo7Fvva39DKed5t | Accounting Logger | ACTIVE | 11 |
| UkiGz64ysmifd3q9 | Review Request Automator | ACTIVE | 4 |
| WMPRz55gvZx9ePOb | SMS Follow-up (Twilio) | ACTIVE | 6 |
| b3OulillXkWze5nK | Payment Link + Notifications | ACTIVE | 6 |
| j4xK5E8kdx8OC1Is | Gift Card System | ACTIVE | 3 |
| nHp2wFED5I6iW8fT | Telegram Assistant | ACTIVE | 9 |
| pw5VQWwoNYQ2IAdQ | Email Follow-Up Automator | ACTIVE | 7 |

### OpBros Workflows

| ID | Name | Status | Nodes |
|----|------|--------|-------|
| 1y4ZJiQ9Z2gnDVYr | Lead Capture | ACTIVE | 4 |
| U9mZhtJiWUoJAKjL | SMS v2 | ACTIVE | 5 |
| XCUlLOSgBUiKX2q5 | ROI Report | ACTIVE | 4 |
| yrHqLfn5uUbxaq5p | AI Chat | ACTIVE | 7 |

### Inactive/Testing Workflows

| ID | Name | Status |
|----|------|--------|
| ED04aRzwOmsA3gOA | Call Transcript to Telegram | INACTIVE |
| xRF5aBAZZ8BLptYb | Google Sheets Outbound Caller | INACTIVE |

---

## API KEYS & CREDENTIALS

**Location:** `/Users/shamalkrishna/Documents/cleanupbros-os/.secrets/API_KEYS.md`

### Services Available

| Service | Purpose |
|---------|---------|
| **N8N** | 4 API keys for workflow automation |
| **Twilio** | SMS (+15162102609) and Voice (+61256553786) |
| **ElevenLabs** | AI voice calling |
| **Square** | Payment processing (Production) |
| **OpenAI** | AI completions |
| **Claude** | AI completions |
| **Google AI Studio** | Gemini API |
| **Perplexity** | AI search |
| **DeepSeek** | AI completions |
| **Grok** | AI completions |
| **Telegram** | Bot notifications |
| **Twitter/X** | Social posting |
| **LinkedIn** | Social posting |
| **Instagram** | Social posting |
| **Supabase** | Database (gift cards) |
| **Pinecone** | Vector database |

---

## SKILLS & AGENTS

### Skills Location
```
/Users/shamalkrishna/Documents/cleanupbros-os/ugc-ads/daily_creative_agent/SKILLS.md
```

### Claude Commands (Clean Up Bros)
```
.claude/commands/debug.md    # Trigger with /debug or debug.md
```

### Agent Directives
```
/Users/shamalkrishna/Documents/cleanupbros-os/.workspace/directives/
├── MASTER_AGENT.md           # Primary agent config
├── CLAUDE_CODE_AGENT.md      # Development agent
└── ANTIGRAVITY_AGENT.md      # Workflow orchestration
```

### Domain Agents (10 modules)
Each module in cleanupbros-os has its own agent:
1. lead-to-client
2. ugc-ads
3. lean-scraper-outreach
4. service-ops
5. pricing-and-quotes
6. reception-and-support
7. reputation-and-reviews
8. team-and-training
9. finance-and-metrics
10. website-and-funnels

---

## CENTRAL HUB (Shared Brain)

**Location:** `/Users/shamalkrishna/Documents/cleanupbros-os/_CENTRAL/`

| File | Purpose |
|------|---------|
| SHARED_MEMORY.md | Cross-session state |
| LEARNING_LOG.md | Lessons learned (avoid mistakes) |
| ERROR_LOG.md | Error tracking |
| MASTER_BRAIN.md | Core knowledge |

### Before Any Task
```bash
cat _CENTRAL/LEARNING_LOG.md   # Avoid repeating mistakes
cat _CENTRAL/SHARED_MEMORY.md  # Understand current state
```

### After Any Error
```bash
# 1. Log to _CENTRAL/ERROR_LOG.md
# 2. Add lesson to _CENTRAL/LEARNING_LOG.md
# 3. Update _CENTRAL/SHARED_MEMORY.md
```

---

## QUICK COMMANDS

### Clean Up Bros
```bash
cd "/Users/shamalkrishna/Desktop/CLAUDECODE🤖.MD/clean-up-bros-quote-&-application-portal"
npm run dev          # Start dev server (localhost:3001)
npm run build        # Build for production
git push origin main # Auto-deploys to Vercel
```

### OpBros
```bash
cd "/Users/shamalkrishna/Desktop/CLAUDECODE🤖.MD/opbros.md/opbros-automation/website"
npm run dev          # Start dev server (localhost:3000)
npm run build        # Build for production
git push origin main # Auto-deploys to Vercel
```

### N8N Health Check
```bash
curl -s https://nioctibinu.online/healthz
```

---

## DEBUGGING PROTOCOL

When issues occur, use the debug skill:
```
/debug
```

Or manually:
1. Check `_CENTRAL/ERROR_LOG.md` for recent errors
2. Check `_CENTRAL/LEARNING_LOG.md` for lessons
3. Run diagnostics (git status, npm run build)
4. Test N8N webhooks with curl
5. Check browser console for frontend errors

### Common Webhook Test
```bash
curl -X POST https://nioctibinu.online/webhook/98d35453-4f18-40ca-bdfa-ba3aaa02646c \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

---

## LESSONS LEARNED

Key lessons from LEARNING_LOG.md:

1. **LESSON-002:** Always verify N8N workflow EXISTS and is ACTIVATED (not just JSON file)
2. **LESSON-005:** API keys are in `.secrets/API_KEYS.md` - never duplicate
3. **LESSON-007:** Next.js with unicode paths needs v14.x (not 16)
4. **LESSON-008:** Never run `npm install` with sudo
5. **LESSON-009:** Verify git remote matches Vercel-connected repo

---

## GIT REPOSITORIES

| Project | Repository |
|---------|------------|
| Clean Up Bros | https://github.com/cleanupbro/MY-CLAUDE-CODE-BUILD-.git |
| OpBros | https://github.com/cleanupbro/opbros.automation1 |
| CleanUpBros OS | Local only (not on GitHub) |

---

## CONTACT & SUPPORT

**Business Owner:** Hafsah Nuzhat
**Technical Contact:** Shamal Krishna
**Email:** cleanupbros.au@gmail.com
**Phone:** +61 406 764 585
**Telegram Group:** -1003155659527

---

## SESSION HANDOFF NOTES

### What Was Done (Dec 29, 2025)
1. Complete antigravity CSS theme applied to Clean Up Bros
2. Google Analytics integrated
3. Form text visibility fixed
4. AntigravityBackground added to App.tsx
5. Debug skill created
6. SEO meta tags updated

### What's Pending
1. Gift card purchase flow - needs testing with real Supabase config
2. Full theme consistency check across all views
3. Header scroll effects like OpBros

### What's Working
- All 12 N8N quote/lead webhooks
- AI Chat widget
- SMS follow-up system
- Voice calling (Twilio + ElevenLabs)
- Payment link generation (Square)
- Telegram notifications

---

## FILE LOCATIONS SUMMARY

| Resource | Path |
|----------|------|
| Clean Up Bros | `/Users/shamalkrishna/Desktop/CLAUDECODE🤖.MD/clean-up-bros-quote-&-application-portal/` |
| OpBros | `/Users/shamalkrishna/Desktop/CLAUDECODE🤖.MD/opbros.md/opbros-automation/` |
| Central Hub | `/Users/shamalkrishna/Documents/cleanupbros-os/_CENTRAL/` |
| API Keys | `/Users/shamalkrishna/Documents/cleanupbros-os/.secrets/API_KEYS.md` |
| Skills | `/Users/shamalkrishna/Documents/cleanupbros-os/ugc-ads/daily_creative_agent/SKILLS.md` |
| Agent Directives | `/Users/shamalkrishna/Documents/cleanupbros-os/.workspace/directives/` |

---

*Handoff document created by Claude Code (Opus 4.5) - December 29, 2025*
*Ready for next developer to continue work*
