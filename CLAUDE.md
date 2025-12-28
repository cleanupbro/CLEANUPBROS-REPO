# CLAUDE.md - Clean Up Bros Quote Portal
## Project-Specific Instructions

**Status:** LIVE at https://cleanupbros.com.au
**Stack:** Vite + React 19 + Tailwind CSS
**Last Updated:** December 28, 2025

---

## SHARED RESOURCES (Use Symlinks)

```
_SHARED/              → Shared with OpBros project
├── API_KEYS.md/      → All API keys (single source)
├── skills/           → 20 skill files
└── backend/          → Backend configs

_CENTRAL/             → Shared brain
├── SHARED_MEMORY.md  → Session context
├── LEARNING_LOG.md   → Lessons learned
└── ERROR_LOG.md      → Error tracking
```

---

## BEFORE ANY TASK

1. Read `_CENTRAL/LEARNING_LOG.md`
2. Read `_CENTRAL/SHARED_MEMORY.md`
3. Read `PROJECT_CONTEXT.md` (this project's state)

---

## AFTER ANY ERROR

1. Log to `_CENTRAL/ERROR_LOG.md`
2. Add lesson to `_CENTRAL/LEARNING_LOG.md`

---

## PROJECT FILES

| File | Purpose |
|------|---------|
| PROJECT_CONTEXT.md | Current state, webhooks, where we left off |
| SESSION_HANDOFF.md | Session-to-session context |
| App.tsx | Main app with view routing |
| views/ | All page components |
| components/ | Reusable UI components |

---

## QUICK COMMANDS

```bash
npm run dev          # Start dev server (localhost:3001)
npm run build        # Build for production
git push origin main # Auto-deploys to Vercel
```

---

## LIVE INFRASTRUCTURE

| Service | URL |
|---------|-----|
| Website | https://cleanupbros.com.au |
| N8N | https://nioctibinu.online |
| GitHub | https://github.com/cleanupbro/MY-CLAUDE-CODE-BUILD-.git |
| Vercel | Auto-deploy on push |

---

## RULES

- Plan before building
- Ask before major changes
- Use `_SHARED/skills/` for how-to
- Read `PROJECT_CONTEXT.md` for what exists
- Never duplicate API keys

---

*Clean Up Bros - Making Your Space Shine*
