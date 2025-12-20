# OAuth Setup Guide for Clean Up Bros

## Supabase OAuth Configuration

### 1. OAuth App Settings

**Name:** CLEAN UP BROS

**Redirect URIs (Add all):**
```
http://localhost:3000/auth/callback
http://localhost:3001/auth/callback
https://cleanupbros.com.au/auth/callback
https://www.cleanupbros.com.au/auth/callback
```

**Public Client:** ✅ Enabled (for PKCE flow)

### 2. After Creating OAuth App

You'll receive:
- **Client ID** (safe to expose in frontend)
- **Client Secret** (keep secure, backend only)

Add to `.env.local`:
```env
VITE_OAUTH_CLIENT_ID=your_client_id_here
OAUTH_CLIENT_SECRET=your_client_secret_here  # Backend only
```

### 3. Supabase Auth Configuration

In Supabase Dashboard → Authentication → URL Configuration:

**Site URL:** `https://cleanupbros.com.au`

**Redirect URLs (Allowed):**
```
http://localhost:3000/**
http://localhost:3001/**
https://cleanupbros.com.au/**
https://www.cleanupbros.com.au/**
```

### 4. Enable Auth Providers (Optional)

If you want social login (Google, Facebook, etc.):

#### Google OAuth:
1. Go to Google Cloud Console
2. Create OAuth 2.0 Client ID
3. Add redirect URI: `https://your-project.supabase.co/auth/v1/callback`
4. Add to Supabase: Authentication → Providers → Google

#### GitHub OAuth:
1. Go to GitHub Settings → Developer settings
2. New OAuth App
3. Authorization callback URL: `https://your-project.supabase.co/auth/v1/callback`
4. Add to Supabase: Authentication → Providers → GitHub

### 5. Update AuthService.ts

If you want to add social login, update `services/authService.ts`:

```typescript
// Google Sign In
export const signInWithGoogle = async (): Promise<AuthResult> => {
  if (!isSupabaseConfigured() || !supabase) {
    return { success: false, error: 'Supabase not configured' };
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
};

// GitHub Sign In
export const signInWithGitHub = async (): Promise<AuthResult> => {
  if (!isSupabaseConfigured() || !supabase) {
    return { success: false, error: 'Supabase not configured' };
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
};
```

### 6. Create Auth Callback Handler

Create `views/AuthCallbackView.tsx`:

```typescript
import { useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

export const AuthCallbackView = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Auth callback error:', error);
        navigate('/AdminLogin?error=auth_failed');
        return;
      }

      if (session) {
        // Store session
        localStorage.setItem('cleanUpBrosAdminSession', 'true');
        localStorage.setItem('cleanUpBrosAdminEmail', session.user.email || '');

        // Redirect to dashboard
        navigate('/AdminDashboard');
      } else {
        navigate('/AdminLogin');
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin h-12 w-12 border-4 border-brand-gold border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>Completing authentication...</p>
      </div>
    </div>
  );
};
```

### 7. Security Best Practices

✅ **Use PKCE flow** (Public Client enabled)
✅ **Verify redirect URIs** match exactly
✅ **Store Client Secret securely** (backend only, never expose)
✅ **Use HTTPS in production** (required for OAuth)
✅ **Implement CSRF protection** (Supabase handles this)
✅ **Set session expiry** (24 hours recommended)

### 8. Testing OAuth Flow

1. **Local Testing:**
   ```bash
   npm run dev
   # Visit http://localhost:3000/AdminLogin
   # Click "Sign in with Google" (if enabled)
   # Should redirect to Google, then back to /auth/callback
   ```

2. **Production Testing:**
   - Deploy to production URL
   - Test OAuth flow end-to-end
   - Verify redirect works correctly
   - Check session persistence

### 9. Troubleshooting

**"Redirect URI mismatch" error:**
- Ensure redirect URI matches exactly (including protocol, domain, path)
- Check for trailing slashes
- Verify in Supabase dashboard

**"Invalid client" error:**
- Check Client ID is correct
- Verify Client Secret (if using confidential client)
- Ensure OAuth app is enabled

**Session not persisting:**
- Check localStorage is accessible
- Verify session storage in Supabase
- Check cookie settings (SameSite, Secure)

**CORS errors:**
- Add domain to Supabase allowed origins
- Check redirect URIs include all domains

### 10. Recommended OAuth Providers

For Clean Up Bros, I recommend:

1. **Email/Password** (primary) ✅
   - Already implemented
   - Most straightforward
   - No additional setup needed

2. **Google OAuth** (optional)
   - Easy for customers
   - High trust
   - Good for admin login

3. **Microsoft OAuth** (optional)
   - Good for commercial clients
   - Enterprise integration

**Skip:**
- Facebook (not professional for B2B)
- Twitter (not necessary)
- Apple (unless you have iOS app)

---

## Quick Reference

**Supabase Dashboard:**
- Authentication → Providers
- Authentication → URL Configuration
- Authentication → Email Templates

**Documentation:**
- Supabase Auth: https://supabase.com/docs/guides/auth
- OAuth 2.0: https://oauth.net/2/
- PKCE Flow: https://oauth.net/2/pkce/

---

**Last Updated:** December 21, 2025
