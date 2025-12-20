# MODERN PROFESSIONAL IMAGES FOR CLEAN UP BROS
# Apple-Style Glassmorphism Theme

**Created:** December 21, 2025
**Theme:** Mirror Glass + Professional Cleaning Industry

---

## 🎨 CURATED PROFESSIONAL IMAGES (Unsplash)

All images are high-quality (4K+), royalty-free, and optimized for cleaning services.

### HERO IMAGES (Main Landing Page)

**Primary Hero - Residential Cleaning:**
```
https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?q=80&w=2940&auto=format&fit=crop
Modern minimalist home interior with natural light - perfect for residential cleaning
```

**Commercial Cleaning Hero:**
```
https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2940&auto=format&fit=crop
Modern glass office building - professional commercial space
```

**Airbnb/Vacation Rental:**
```
https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=2940&auto=format&fit=crop
Luxury modern vacation rental interior
```

---

### SERVICE-SPECIFIC IMAGES

**1. Residential Cleaning:**
```
Living Room:
https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2940&auto=format&fit=crop

Kitchen:
https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?q=80&w=2940&auto=format&fit=crop

Bathroom:
https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=2940&auto=format&fit=crop

Bedroom:
https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=2940&auto=format&fit=crop
```

**2. Commercial Cleaning:**
```
Office Space:
https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=2940&auto=format&fit=crop

Conference Room:
https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2940&auto=format&fit=crop

Lobby/Reception:
https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2940&auto=format&fit=crop

Glass Windows/Facades:
https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2940&auto=format&fit=crop
```

**3. Airbnb Cleaning:**
```
Modern Apartment:
https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2940&auto=format&fit=crop

Luxury Suite:
https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2940&auto=format&fit=crop

Cozy Rental:
https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2940&auto=format&fit=crop
```

**4. Cleaning Team/Staff:**
```
Professional Cleaners:
https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2940&auto=format&fit=crop

Cleaning Equipment:
https://images.unsplash.com/photo-1563453392212-326f5e854473?q=80&w=2940&auto=format&fit=crop

Team at Work:
https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?q=80&w=2940&auto=format&fit=crop
```

---

### BACKGROUND PATTERNS (Subtle)

**For Sections:**
```
Subtle Texture:
https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2940&auto=format&fit=crop&blur=40

Minimal Gradient:
https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=2940&auto=format&fit=crop&blur=50
```

---

## 🎭 HOW TO APPLY GLASSMORPHISM

### Example 1: Hero Section with Glass Card

```tsx
<div className="relative min-h-screen">
  {/* Background Image */}
  <div
    className="absolute inset-0 bg-cover bg-center"
    style={{backgroundImage: 'url(https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?q=80&w=2940&auto=format&fit=crop)'}}
  />

  {/* Gradient Overlay */}
  <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60" />

  {/* Glass Content Card */}
  <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
    <div className="glass-card max-w-2xl p-12 text-center">
      <h1 className="text-6xl font-bold text-white mb-6 text-gradient-gold">
        Clean Up Bros
      </h1>
      <p className="text-xl text-white/90 mb-8">
        Sydney's Premier Cleaning Service
      </p>
      <button className="glass-button text-white glow-gold">
        Get Quote Now
      </button>
    </div>
  </div>
</div>
```

### Example 2: Service Cards with Glass Effect

```tsx
<div className="grid md:grid-cols-3 gap-6">
  <div className="glass-card-dark p-8 hover:scale-105 transition-transform">
    <div className="premium-badge mb-4">Premium</div>
    <h3 className="text-2xl font-bold text-white mb-2">Residential</h3>
    <p className="text-white/80">Professional home cleaning</p>
    <button className="glass-button mt-6 w-full">Learn More</button>
  </div>

  <div className="glass-card-dark p-8 hover:scale-105 transition-transform">
    <div className="premium-badge mb-4">Business</div>
    <h3 className="text-2xl font-bold text-white mb-2">Commercial</h3>
    <p className="text-white/80">Office & workspace cleaning</p>
    <button className="glass-button mt-6 w-full">Learn More</button>
  </div>

  <div className="glass-card-dark p-8 hover:scale-105 transition-transform">
    <div className="premium-badge mb-4">Hospitality</div>
    <h3 className="text-2xl font-bold text-white mb-2">Airbnb</h3>
    <p className="text-white/80">Vacation rental turnover</p>
    <button className="glass-button mt-6 w-full">Learn More</button>
  </div>
</div>
```

---

## 🎨 COLOR PALETTE (Apple-Inspired)

```css
/* Primary Colors */
--brand-gold: #F2B705;
--brand-navy: #0B2545;
--apple-blue: #0071e3;
--apple-gray: #F5F5F7;

/* Glass Effect Colors */
--glass-light: rgba(255, 255, 255, 0.1);
--glass-dark: rgba(0, 0, 0, 0.3);
--glass-border: rgba(255, 255, 255, 0.2);

/* Gradients */
--gold-gradient: linear-gradient(135deg, #F2B705 0%, #FFD700 100%);
--blue-gradient: linear-gradient(135deg, #0071e3 0%, #00a6ff 100%);
--dark-gradient: linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 100%);
```

---

## 📐 LAYOUT RECOMMENDATIONS

### Hero Section (Full-width)
- **Height:** 100vh (full viewport)
- **Image:** High-quality 4K minimum
- **Overlay:** Dark gradient (60% black → 30% black → 60% black)
- **Glass Card:** Centered, max-width 800px
- **Text:** Large heading (72px), white with gold accent

### Service Grid
- **Layout:** 3 columns on desktop, 1 on mobile
- **Cards:** Glass effect with dark background
- **Spacing:** 24px gap between cards
- **Hover:** Scale 1.05, glow effect

### Testimonials/Reviews
- **Background:** Subtle pattern or solid color
- **Cards:** White glass cards
- **Layout:** Carousel or 3-column grid

---

## 🚀 QUICK IMPLEMENTATION

### Step 1: Update LandingView.tsx

Replace image URLs in the `HeroUnit` components:

```typescript
// Main Hero
imageUrl="https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?q=80&w=2940&auto=format&fit=crop"

// Residential
imageUrl="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2940&auto=format&fit=crop"

// Commercial
imageUrl="https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=2940&auto=format&fit=crop"

// Airbnb
imageUrl="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=2940&auto=format&fit=crop"
```

### Step 2: Add Glass Classes

```tsx
// Replace regular cards with glass cards
className="glass-card p-8"

// Add premium badges
<div className="premium-badge">Premium Service</div>

// Use glass buttons
<button className="glass-button glow-gold">Get Quote</button>
```

### Step 3: Apply Animations

```tsx
// Stagger animation for cards
<div className="stagger-children grid md:grid-cols-3 gap-6">
  <div className="glass-card">...</div>
  <div className="glass-card">...</div>
  <div className="glass-card">...</div>
</div>

// Floating elements
<div className="float-animation">
  <img src="..." alt="..." />
</div>
```

---

## 💡 PRO TIPS

1. **Image Optimization:**
   - Add `?q=80&w=2940&auto=format&fit=crop` to all Unsplash URLs
   - Use `blur=40` for background patterns
   - WebP format loads faster

2. **Performance:**
   - Lazy load images below the fold
   - Use responsive images with srcset
   - Preload hero image for instant display

3. **Glassmorphism Best Practices:**
   - Use on dark or busy backgrounds only
   - Keep blur between 10-20px for readability
   - Add subtle borders for definition
   - Limit to 2-3 glass layers max (performance)

4. **Accessibility:**
   - Ensure text contrast ratio > 4.5:1
   - Add alt text to all images
   - Use semantic HTML

5. **Mobile Optimization:**
   - Reduce blur on mobile (10px vs 20px desktop)
   - Stack cards vertically
   - Use larger touch targets (48px min)

---

## 🎬 ANIMATED HERO EXAMPLE

```tsx
<div className="relative min-h-screen overflow-hidden">
  {/* Animated Background */}
  <div
    className="absolute inset-0 bg-cover bg-center animate-slow-zoom"
    style={{
      backgroundImage: 'url(https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?q=80&w=2940&auto=format&fit=crop)'
    }}
  />

  {/* Gradient Overlay */}
  <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70" />

  {/* Content */}
  <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
    <div className="glass-card max-w-4xl p-16 text-center stagger-children">
      <div className="premium-badge mx-auto mb-6">Sydney's #1 Cleaning Service</div>

      <h1 className="text-7xl font-bold mb-6 text-gradient-gold">
        Clean Up Bros
      </h1>

      <p className="text-2xl text-white/90 mb-4">
        Professional Cleaning Services
      </p>

      <p className="text-lg text-white/70 mb-12 max-w-2xl mx-auto">
        Residential • Commercial • Airbnb • Post-Construction
      </p>

      <div className="flex gap-4 justify-center flex-wrap">
        <button className="glass-button glow-gold text-white text-lg px-10 py-4">
          Get Instant Quote
        </button>
        <button className="glass-button text-white text-lg px-10 py-4">
          View Services
        </button>
      </div>

      <div className="mt-12 flex gap-8 justify-center text-white/80">
        <div>
          <div className="text-3xl font-bold text-gradient-gold">500+</div>
          <div className="text-sm">Happy Clients</div>
        </div>
        <div className="divider-glass w-px"></div>
        <div>
          <div className="text-3xl font-bold text-gradient-gold">4.9★</div>
          <div className="text-sm">Google Rating</div>
        </div>
        <div className="divider-glass w-px"></div>
        <div>
          <div className="text-3xl font-bold text-gradient-gold">24/7</div>
          <div className="text-sm">Support</div>
        </div>
      </div>
    </div>
  </div>

  {/* Scroll Indicator */}
  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
    <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
  </div>
</div>
```

---

## ✅ IMPLEMENTATION CHECKLIST

- [ ] Import glassmorphism.css in index.html
- [ ] Update hero image URLs
- [ ] Add glass-card classes to components
- [ ] Apply premium-badge to features
- [ ] Add stagger-children animations
- [ ] Update button styles to glass-button
- [ ] Add glow effects to CTAs
- [ ] Test on mobile devices
- [ ] Optimize image loading
- [ ] Add loading states with shimmer effect

---

**Result:** A stunning, modern, Apple-style cleaning service website with professional images and elegant glassmorphism effects! 🎨✨
