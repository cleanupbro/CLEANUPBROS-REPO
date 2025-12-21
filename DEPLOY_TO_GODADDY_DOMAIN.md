# 🚀 DEPLOY TO CLEANUPBROS.COM.AU
## Replace Old Website with New Production App

**Domain:** cleanupbros.com.au (GoDaddy)
**Old Hosting:** Google AI Studios
**New Hosting:** Vercel (Recommended) or Netlify
**Time Required:** 30 minutes
**Downtime:** ~5 minutes (during DNS propagation)

---

## 🎯 **DEPLOYMENT OVERVIEW**

We'll deploy your new app to **Vercel** (best for React/Vite apps) and point your GoDaddy domain to it.

### **Why Vercel?**
- ✅ Free SSL certificate (HTTPS)
- ✅ Global CDN (fast everywhere)
- ✅ Automatic deployments from GitHub
- ✅ Zero-config for React/Vite
- ✅ Free tier (generous limits)
- ✅ Built-in analytics

---

## 📋 **STEP-BY-STEP DEPLOYMENT**

### **STEP 1: Deploy to Vercel (10 minutes)**

#### A. Create Vercel Account
```
1. Go to: https://vercel.com
2. Click "Sign Up"
3. Choose "Continue with GitHub"
4. Authorize Vercel to access your GitHub
```

#### B. Import Your Project
```
1. Click "Add New" → "Project"
2. Search for: MY-CLAUDE-CODE-BUILD-
3. Click "Import"
4. Configure:
   - Framework Preset: Vite ✅ (auto-detected)
   - Root Directory: ./
   - Build Command: npm run build
   - Output Directory: dist
```

#### C. Add Environment Variables
```
Click "Environment Variables" tab

Add these:

VITE_SUPABASE_URL
Value: https://rtnamqbkowtrwogelgqv.supabase.co

VITE_SUPABASE_ANON_KEY
Value: sb_publishable_8_55hVJqyWOM-dfjpBZQkw_nscTf6ky

GEMINI_API_KEY
Value: [your Gemini API key from API.md]

VITE_GA_MEASUREMENT_ID
Value: G-CLEANUPBROS01 (or your real GA4 ID)

VITE_STRIPE_PUBLISHABLE_KEY
Value: [your Stripe key from API.md]
```

#### D. Deploy
```
1. Click "Deploy"
2. Wait 2-3 minutes
3. You'll get a URL like: https://clean-up-bros-xxxxx.vercel.app
4. Click "Visit" to verify it works
```

✅ **Success!** Your app is now live on Vercel's URL.

---

### **STEP 2: Connect GoDaddy Domain (15 minutes)**

#### A. Add Domain to Vercel
```
1. In Vercel dashboard, click "View Domains"
2. Click "Add"
3. Enter: cleanupbros.com.au
4. Click "Add"
```

Vercel will show you DNS records to add. **Keep this page open!**

#### B. Log in to GoDaddy
```
1. Go to: https://godaddy.com
2. Sign in to your account
3. Go to "My Products"
4. Find: cleanupbros.com.au
5. Click "DNS" or "Manage DNS"
```

#### C. Update DNS Records

**OPTION A: Use A Record (Recommended)**
```
1. Find existing A record (if any)
2. Click "Edit" or "Delete" old record
3. Add NEW A record:
   Type: A
   Name: @
   Value: 76.76.21.21 (Vercel's IP)
   TTL: 1 Hour

4. Add www subdomain:
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   TTL: 1 Hour
```

**OPTION B: Use CNAME (Alternative)**
```
Note: Only works for www subdomain
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 1 Hour

Then redirect @ to www in GoDaddy settings
```

#### D. Remove Old DNS Records
```
⚠️ IMPORTANT: Remove these old records:
- Any A records pointing to old IP
- Any CNAME pointing to Google AI Studios
- Any conflicting records

Keep these:
- MX records (email)
- TXT records (SPF, DKIM, verification)
```

#### E. Verify in Vercel
```
1. Back in Vercel, wait 1-2 minutes
2. Click "Refresh" or "Verify"
3. You should see ✅ "Valid Configuration"
```

✅ **DNS Updated!** Domain will propagate in 5-30 minutes.

---

### **STEP 3: Enable SSL/HTTPS (Automatic)**

```
Vercel automatically issues SSL certificate when:
1. Domain is verified ✅
2. DNS is correct ✅
3. Propagation complete ✅

Wait 5-10 minutes, then:
1. Visit: https://cleanupbros.com.au
2. Check for 🔒 padlock in browser
3. Certificate should be valid

⚠️ If not working after 30 mins:
- Check DNS propagation: https://dnschecker.org
- Verify DNS records are exact
- Contact Vercel support (very responsive)
```

---

### **STEP 4: Update Webhook URLs (Important!)**

Your app has hardcoded localhost URLs that need updating:

#### A. Update constants.ts
```typescript
// Old (development)
const API_BASE = 'http://localhost:3000';

// New (production)
const API_BASE = 'https://cleanupbros.com.au';
```

#### B. Update Supabase Site URL
```
1. Go to Supabase dashboard
2. Project Settings → Authentication
3. Site URL: https://cleanupbros.com.au
4. Redirect URLs:
   - https://cleanupbros.com.au/*
   - https://cleanupbros.com.au/AdminDashboard
```

#### C. Update n8n Webhook URLs (if needed)
```
If you used localhost in n8n workflow:
1. Open n8n workflow
2. Replace localhost:3000 with cleanupbros.com.au
3. Save and reactivate
```

---

### **STEP 5: Test Production Site**

#### A. Basic Functionality
```
1. Visit: https://cleanupbros.com.au
2. Check:
   ✅ Pages load correctly
   ✅ Images display
   ✅ Forms work
   ✅ Navigation works
   ✅ Mobile responsive
   ✅ HTTPS (🔒 padlock)
```

#### B. Submit Test Quote
```
1. Click "Residential Cleaning"
2. Fill in test data
3. Submit
4. Verify:
   ✅ Submission saves to Supabase
   ✅ Appears in admin dashboard
   ✅ Webhooks trigger (if configured)
   ✅ Emails sent (if Resend configured)
```

#### C. Admin Login
```
1. Go to: https://cleanupbros.com.au/AdminLogin
2. Login with: hafsahnuzhat1303@gmail.com
3. Verify:
   ✅ Login works
   ✅ Dashboard loads
   ✅ Submissions visible
   ✅ AI features work
```

---

## 🔧 **COMMON ISSUES & FIXES**

### **Issue: "DNS_PROBE_FINISHED_NXDOMAIN"**
```
Problem: Domain not resolving
Solution:
1. DNS not propagated yet (wait 30 mins)
2. Check DNS records are correct
3. Use https://dnschecker.org to verify
4. Clear browser cache (Ctrl+Shift+Delete)
```

### **Issue: "NET::ERR_CERT_AUTHORITY_INVALID"**
```
Problem: SSL certificate not issued
Solution:
1. Wait 10-15 minutes after DNS verification
2. Hard refresh: Ctrl+Shift+R
3. Check Vercel → Domains → SSL status
4. If > 1 hour, contact Vercel support
```

### **Issue: "This site can't be reached"**
```
Problem: DNS records incorrect
Solution:
1. Verify A record: 76.76.21.21
2. Verify CNAME: cname.vercel-dns.com
3. Remove conflicting records
4. Wait for propagation (use incognito mode)
```

### **Issue: Old website still showing**
```
Problem: Browser cache or DNS cache
Solution:
1. Clear browser cache completely
2. Try incognito/private mode
3. Try different browser
4. Check from mobile phone (4G/5G)
5. Wait for global DNS propagation (up to 48h)
```

### **Issue: "Supabase connection failed"**
```
Problem: Environment variables not set
Solution:
1. Vercel → Settings → Environment Variables
2. Verify VITE_SUPABASE_URL is correct
3. Verify VITE_SUPABASE_ANON_KEY is correct
4. Redeploy after adding variables
```

---

## 📊 **VERCEL DEPLOYMENT SETTINGS**

### **Recommended Configuration:**

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "outputDirectory": "dist"
}
```

### **Auto Deployments:**
```
✅ Every push to main → Auto deploy
✅ Pull requests → Preview deployments
✅ Rollback available
✅ Build logs accessible
```

---

## 🚀 **AUTOMATIC DEPLOYMENT WORKFLOW**

Once set up, every time you push to GitHub:

```bash
# Make changes locally
git add .
git commit -m "Update feature X"
git push origin main

# Vercel automatically:
1. Detects push
2. Runs build
3. Deploys to production
4. Updates cleanupbros.com.au
5. Sends you notification

⏱️ Total time: 2-3 minutes
```

---

## 📱 **OPTIONAL: Add www Redirect**

In Vercel:
```
1. Settings → Domains
2. Add: www.cleanupbros.com.au
3. Set redirect to: cleanupbros.com.au
4. All www traffic → redirects to non-www
```

---

## 🔐 **SECURITY CHECKLIST**

Before going live:

- [ ] HTTPS enabled (🔒 padlock showing)
- [ ] SSL certificate valid (not expired)
- [ ] Environment variables set (not in code)
- [ ] API keys not exposed in frontend
- [ ] Supabase RLS policies enabled
- [ ] Admin routes protected
- [ ] CORS configured correctly
- [ ] Rate limiting enabled

---

## 🎯 **POST-DEPLOYMENT TASKS**

### **1. Update Google Search Console**
```
1. Go to: https://search.google.com/search-console
2. Add property: https://cleanupbros.com.au
3. Verify ownership (DNS TXT record)
4. Submit sitemap: https://cleanupbros.com.au/sitemap.xml
```

### **2. Update Google Analytics**
```
1. Go to: https://analytics.google.com
2. Update website URL to: cleanupbros.com.au
3. Verify tracking code working
```

### **3. Update Google Business Profile**
```
1. Update website URL
2. Add new photos
3. Update services
4. Add booking link
```

### **4. Update Social Media**
```
Update links on:
- Facebook business page
- Instagram bio
- LinkedIn company page
- Google My Business
```

### **5. Notify Existing Customers**
```
Send email:
"We've upgraded our website! 🎉
New features:
- Instant online quotes
- AI-powered pricing
- Secure payment links
- Mobile-friendly design

Visit: https://cleanupbros.com.au"
```

---

## 💰 **COST BREAKDOWN**

### **Hosting (Vercel Free Tier):**
```
✅ Bandwidth: 100GB/month
✅ Builds: Unlimited
✅ Domains: Unlimited
✅ SSL: Free
✅ Analytics: Basic (free)

Upgrade if needed: $20/month (Pro)
```

### **Domain (GoDaddy):**
```
Already paid: ~$20/year
No additional cost
```

### **Total New Hosting Cost:** **$0/month** 🎉

---

## 🔄 **MIGRATION CHECKLIST**

- [ ] Backup old website (if needed)
- [ ] Export any data from old site
- [ ] Deploy new app to Vercel
- [ ] Verify new site works on Vercel URL
- [ ] Update DNS records on GoDaddy
- [ ] Wait for DNS propagation (5-30 mins)
- [ ] Verify HTTPS working
- [ ] Test all features on production
- [ ] Update all external links
- [ ] Submit new sitemap to Google
- [ ] Monitor for 24 hours

---

## 📞 **NEED HELP?**

### **Vercel Support:**
- Chat: https://vercel.com/support
- Docs: https://vercel.com/docs
- Response time: Usually < 1 hour

### **GoDaddy Support:**
- Phone: Available 24/7
- Chat: Available
- DNS changes: Usually quick

---

## 🎉 **SUCCESS CRITERIA**

You'll know it worked when:

✅ https://cleanupbros.com.au loads your NEW app
✅ 🔒 Padlock appears (HTTPS secure)
✅ Forms submit and save to Supabase
✅ Admin login works
✅ Mobile version looks perfect
✅ Old Google AI Studios site is gone
✅ All your new features are live

---

## ⚡ **QUICK START (10 MINUTES)**

If you want to do this RIGHT NOW:

```bash
# 1. Push your code to GitHub (already done ✅)

# 2. Go to Vercel
- Sign up with GitHub
- Import MY-CLAUDE-CODE-BUILD-
- Add environment variables (from API.md)
- Click Deploy
- Wait 2 minutes

# 3. Go to GoDaddy DNS
- Add A record: 76.76.21.21
- Add CNAME for www: cname.vercel-dns.com
- Delete old records

# 4. Back to Vercel
- Add domain: cleanupbros.com.au
- Verify DNS
- Wait 10 minutes

# 5. Visit your site
- https://cleanupbros.com.au
- Should see your NEW app! 🎉
```

---

## 📊 **DEPLOYMENT TIMELINE**

| Step | Time | Status |
|------|------|--------|
| Create Vercel account | 2 min | Ready |
| Import from GitHub | 3 min | Ready |
| Add environment variables | 5 min | Needed |
| Initial deploy | 3 min | Auto |
| Update GoDaddy DNS | 5 min | Manual |
| DNS propagation | 5-30 min | Auto |
| SSL certificate | 5-10 min | Auto |
| Testing | 10 min | Manual |
| **TOTAL** | **30-60 min** | |

---

## 🚀 **READY TO DEPLOY?**

Your app is **100% production-ready** and waiting in GitHub!

**Next step:** Follow this guide to deploy to cleanupbros.com.au

**Questions?** Ask me about:
- Specific deployment steps
- DNS configuration
- Environment variables
- SSL issues
- Testing procedures

**Let's make your new website live!** 🌟

---

**Created:** December 21, 2025
**Status:** ✅ READY TO DEPLOY
**Estimated Time:** 30-60 minutes
