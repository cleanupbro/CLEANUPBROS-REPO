# DEBUG SKILL - Clean Up Bros Portal
## Comprehensive Debugging Protocol

**Trigger:** `/debug` or `debug.md`
**Version:** 1.0
**Last Updated:** December 29, 2025

---

## IMMEDIATE ACTIONS

When this skill is triggered, Claude MUST:

### 1. READ ERROR CONTEXT
```bash
# Check recent errors
cat /Users/shamalkrishna/Documents/cleanupbros-os/_CENTRAL/ERROR_LOG.md

# Check lessons learned (avoid repeating mistakes)
cat /Users/shamalkrishna/Documents/cleanupbros-os/_CENTRAL/LEARNING_LOG.md
```

### 2. RUN DIAGNOSTICS
```bash
# Git status - check for uncommitted changes
git status

# Check if dev server is running
lsof -i :3001 || echo "Dev server not running"

# Check for TypeScript errors
npm run build 2>&1 | head -50
```

### 3. VERIFY LIVE SYSTEMS
```bash
# Test N8N health
curl -s https://nioctibinu.online/healthz || echo "N8N unreachable"

# Test website
curl -s -o /dev/null -w "%{http_code}" https://cleanupbros.com.au || echo "Website unreachable"
```

---

## DEBUG CHECKLIST

### Frontend Issues
- [ ] Check browser console for errors (ask user for screenshot)
- [ ] Verify CSS classes are defined in Tailwind config or index.html
- [ ] Check for missing imports in components
- [ ] Verify component is exported correctly (default vs named)
- [ ] Check for `'use client'` directives in Vite project (NOT needed - remove them)

### Backend/Webhook Issues (LESSON-002)
- [ ] Verify N8N workflow EXISTS (not just JSON file)
- [ ] Verify workflow is ACTIVATED in N8N
- [ ] Test webhook endpoint directly with curl
- [ ] Check N8N execution logs for errors
- [ ] Verify API key is correct (X-N8N-API-KEY header)

### API Issues (LESSON-005)
- [ ] API keys are in: `/Users/shamalkrishna/Documents/cleanupbros-os/.secrets/API_KEYS.md`
- [ ] N8N API uses: `X-N8N-API-KEY` header
- [ ] Google APIs require OAuth browser login (can't automate)

### Deployment Issues (LESSON-009)
- [ ] Verify git remote matches Vercel-connected repo: `git remote -v`
- [ ] Vercel repo: `https://github.com/cleanupbro/CLEANUPBROS-REPO.git`
- [ ] If mismatch, fix with: `git remote set-url origin <correct-url>`
- [ ] Check Vercel dashboard for deployment status

### NPM/Package Issues (LESSON-008)
- [ ] If permission denied: `sudo chown -R $(whoami) ~/.npm`
- [ ] Never run `npm install` with sudo
- [ ] Clear cache if needed: `npm cache clean --force`

### Next.js Issues (LESSON-007) - For OpBros project
- [ ] Path with emoji/unicode? Use Next.js 14.x (not 16)
- [ ] Turbopack bug with unicode paths
- [ ] Downgrade: `npm install next@14.2.21`

---

## N8N WEBHOOK QUICK TEST

```bash
# Test Residential webhook
curl -X POST https://nioctibinu.online/webhook/98d35453-4f18-40ca-bdfa-ba3aaa02646c \
  -H "Content-Type: application/json" \
  -d '{"test": true}'

# Test Commercial webhook
curl -X POST https://nioctibinu.online/webhook/bb5fdb61-31d7-4001-9dd1-44ef7dc64d32 \
  -H "Content-Type: application/json" \
  -d '{"test": true}'

# Test Airbnb webhook
curl -X POST https://nioctibinu.online/webhook/5d3f6ff4-5f08-4ccf-9b78-03b62ae6b72f \
  -H "Content-Type: application/json" \
  -d '{"test": true}'

# Test Jobs webhook
curl -X POST https://nioctibinu.online/webhook/67f764f2-adff-481e-aa49-fd3de1feecde \
  -H "Content-Type: application/json" \
  -d '{"test": true}'

# Test Feedback webhook
curl -X POST https://nioctibinu.online/webhook/client-feedback \
  -H "Content-Type: application/json" \
  -d '{"test": true}'

# Test Gift Card webhook
curl -X POST https://nioctibinu.online/webhook/gift-card-purchase \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

---

## COMMON FIXES

### CSS Animation Not Working
1. Check if animation class is defined in `index.html` or `tailwind.config.js`
2. Add missing keyframes to `@layer utilities` in index.html
3. Example fix:
```css
@keyframes my-animation {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}
.animate-my-animation {
  animation: my-animation 6s ease-in-out infinite;
}
```

### Form Text Not Readable
1. Check text color: Should be `text-[#1D1D1F]` on light backgrounds
2. Check background: Should be `bg-[#F5F5F7]` or similar
3. Check placeholder: `placeholder-gray-500` (not gray-400 - too light)
4. Check `.input` class definition in index.html

### Webhook 404 Error
1. Workflow doesn't exist in N8N - create it
2. Workflow exists but not activated - activate it
3. Wrong webhook path - verify in N8N dashboard
4. Use N8N MCP tools to check:
   - `mcp__n8n-mcp__n8n_list_workflows`
   - `mcp__n8n-mcp__n8n_health_check`

### Git Push Not Updating Site
1. Check remote: `git remote -v`
2. Should be: `https://github.com/cleanupbro/CLEANUPBROS-REPO.git`
3. If wrong: `git remote set-url origin https://github.com/cleanupbro/CLEANUPBROS-REPO.git`
4. Force push if needed: `git push -f origin main`

---

## ERROR LOGGING PROTOCOL

When an error is found, LOG IT:

```yaml
#### ERROR-XXX: [Short Description]
Time: HH:MM AEDT
Project: Clean Up Bros Quote Portal
Agent: Claude Code
Error Type: [404/500/CSS/JS/etc]
Endpoint/File: [Where it happened]
Message: [Error message]
Root Cause: [Why it happened]
Resolution: [How it was fixed]
Status: RESOLVED
Lesson Added: [LESSON-XXX if applicable]
```

Log to: `/Users/shamalkrishna/Documents/cleanupbros-os/_CENTRAL/ERROR_LOG.md`

---

## AFTER DEBUGGING

1. **Log the error** to ERROR_LOG.md
2. **Add lesson** to LEARNING_LOG.md if new pattern found
3. **Update SHARED_MEMORY.md** with current state
4. **Commit and push** all fixes
5. **Verify deployment** on Vercel

---

## QUICK COMMANDS

| Issue | Command |
|-------|---------|
| Build errors | `npm run build` |
| Start dev server | `npm run dev` |
| Git status | `git status` |
| Push changes | `git add . && git commit -m "fix: description" && git push` |
| Check N8N | `mcp__n8n-mcp__n8n_health_check` |
| List workflows | `mcp__n8n-mcp__n8n_list_workflows` |

---

## PROJECT PATHS

| Resource | Path |
|----------|------|
| Project Root | `/Users/shamalkrishna/Desktop/CLAUDECODE🤖.MD/clean-up-bros-quote-&-application-portal` |
| Error Log | `/Users/shamalkrishna/Documents/cleanupbros-os/_CENTRAL/ERROR_LOG.md` |
| Learning Log | `/Users/shamalkrishna/Documents/cleanupbros-os/_CENTRAL/LEARNING_LOG.md` |
| API Keys | `/Users/shamalkrishna/Documents/cleanupbros-os/.secrets/API_KEYS.md` |
| N8N Backend | `https://nioctibinu.online` |
| Live Site | `https://cleanupbros.com.au` |
| Git Repo | `https://github.com/cleanupbro/CLEANUPBROS-REPO.git` |

---

*Debug systematically. Log everything. Learn from every error.*
