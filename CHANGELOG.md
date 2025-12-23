# Changelog

All notable changes to the Clean Up Bros Quote & Application Portal will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.1.0] - 2025-12-23

### 🎨 Major UI/UX Redesign

Complete redesign of all public-facing pages with modern Apple-inspired aesthetic. This update transforms the entire user experience with consistent design language, professional typography, and smooth animations.

### Added

#### Design System
- **Full-width hero sections** on all pages with high-quality background images from Unsplash
- **Apple-style cards** (`apple-card` utility class) with rounded corners, shadows, and hover effects
- **Gradient overlays** on hero images (`from-black/70 via-black/50 to-black/70`)
- **Large, bold typography** ranging from text-4xl to text-7xl for maximum impact
- **Smooth animations** including hover scales, transitions, and floating effects
- **Consistent color scheme**:
  - Gold: `#F2B705` (brand-gold)
  - Navy: `#1D1D1F` (brand-navy)
  - Gray: `#86868b` (apple-subtext)
  - Blue: `#0071e3` (apple-blue)

#### Reviews Page (`views/ReviewsView.tsx`)
- Full-width hero section with 5 gold stars animation
- Inspirational quote section with quotation mark icon
- Trust badges section (4 cards: Verified Reviews, 5-Star Service, 100% Satisfaction, 500+ Clients)
- Modern review cards grid (3 columns on large screens) with verified badges
- "What Our Customers Love" section highlighting Speed & Efficiency, Professional Team, and Attention to Detail
- CTA section with "Get Your Free Quote" button
- Background image: Team collaboration/cleaning service photo

#### Gift Cards Page (`views/GiftCardPurchaseView.tsx`)
- Full-width hero section with gift emoji (🎁) and wrapped gift background
- Prominent 15% bonus badge with shadow effects
- Benefits showcase section (3 cards):
  - Save 15% extra credit on all purchases
  - Never Expires - use anytime
  - Any Service - complete flexibility
- Redesigned purchase form with multiple sections:
  - Amount selection with 4 preset buttons ($100, $200, $500, $1000) and custom input
  - Live calculation display showing bonus credit
  - Gift option toggle with recipient details (purple gradient card)
  - Purchase summary card (dark gradient background)
- Mobile-responsive grid layout
- Background image: Wrapped gift boxes

#### About Page (`views/AboutView.tsx`)
- Full-width hero section with professional team background
- "Our Story" section with narrative text and animated floating card (🧹 emoji)
- "Why Choose Us" grid (6 cards in 2x3 layout):
  - Quality Guaranteed
  - Always On Time
  - Fully Insured
  - Eco-Friendly
  - Local Team
  - Attention to Detail
- "By The Numbers" stats section with dark background:
  - 10,000+ Jobs Completed
  - 4.9★ Average Rating
  - 500+ Happy Clients
  - 24/7 Support Available
- Service areas grid with 12 Sydney suburbs
- CTA section with quote button
- Background image: Professional cleaning team

#### Services Page (`views/ServicesView.tsx`)
- Full-width hero section with cleaning tools background
- Core Services section with 3 main service cards:
  - Residential Cleaning (6 features, from $150)
  - Commercial Cleaning (6 features, from $200)
  - Airbnb Turnover (6 features, from $120)
- Each card includes:
  - Large emoji icon
  - Service title and description
  - Feature list with gold checkmarks
  - Starting price display
  - "Get Quote" button
- Add-On Services grid (6 items in 3 columns):
  - Carpet Steam Cleaning ($80+)
  - Window Cleaning ($60+)
  - Oven & Kitchen Deep Clean ($90+)
  - Pressure Washing ($150+)
  - Fridge & Freezer Clean ($50+)
  - Wall Washing ($100+)
- "How It Works" 4-step process with numbered badges
- "Why Choose Us" section with dark background (4 benefits)
- CTA section with two buttons (Get Free Quote, Contact Us)
- Background image: Cleaning supplies and tools

#### Contact Page (`views/ContactView.tsx`)
- Full-width hero section with contact/phone background
- Two-column layout:
  - Left: Contact form with success animation (✅ emoji)
  - Right: Contact info cards (Phone, Email, Location, Business Hours)
- Contact info cards with emoji icons and hover effects
- Quick Actions section (3 cards):
  - Get a Quote
  - Book a Service
  - Learn More (About Us)
- FAQ section with 4 common questions:
  - Response time
  - Phone quotes
  - Service areas
  - Emergency availability
- Map placeholder section
- All cards have transform hover effects
- Background image: Person on phone/customer service

### Changed

#### Component Dependencies
- Removed generic `Card` component dependency from all pages
- Replaced with inline `apple-card` utility class for better design flexibility
- Removed `StarRating` component in favor of inline SVG stars with gold color

#### Typography
- Upgraded all page titles from text-4xl to text-5xl/6xl/7xl for better hierarchy
- Increased subtitle sizes to text-2xl/3xl
- Enhanced drop shadows on hero text for better readability
- Applied consistent text colors (navy for headings, gray for subtext)

#### Layout & Spacing
- Standardized hero section heights to min-h-[650px] md:min-h-[750px]
- Consistent padding (py-20 px-4) across all sections
- Improved responsive grid layouts (md:grid-cols-2, lg:grid-cols-3)
- Better vertical spacing between sections

#### Animations & Interactions
- Added transform hover effects to all cards (scale-105 or scale-[1.02])
- Implemented transition-all duration-300 for smooth animations
- Added shadow enhancements on hover (shadow-lg to shadow-xl)
- Included animate-slow-zoom on hero background images
- Added animate-float on decorative emoji elements

#### Visual Enhancements
- Applied gradient backgrounds to multiple sections
- Enhanced button styling with larger padding and shadows
- Improved form inputs with better focus states
- Added border styling to separate card sections

### Technical Details

#### Files Modified (61 total)
- `views/ReviewsView.tsx` - 260 lines
- `views/GiftCardPurchaseView.tsx` - 495 lines
- `views/AboutView.tsx` - 201 lines
- `views/ServicesView.tsx` - 291 lines
- `views/ContactView.tsx` - 276 lines

#### Commit Information
- **Commit Hash:** 8657f19
- **Files Changed:** 61
- **Insertions:** 6,267 lines
- **Deletions:** 797 lines
- **Commit Message:** "feat: Redesign all public pages with modern Apple-inspired aesthetic"

#### Design Patterns Applied

**Hero Section Pattern:**
```tsx
<div className="hero-unit min-h-[650px] md:min-h-[750px] bg-black text-white mb-0 relative group overflow-hidden">
  <div className="hero-unit-text flex flex-col items-center">
    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 leading-tight text-center drop-shadow-2xl text-white">
      Page Title
    </h1>
    <p className="text-2xl md:text-3xl font-medium text-center drop-shadow-lg">
      Subtitle
    </p>
  </div>
  <div className="absolute inset-0 bg-cover bg-center animate-slow-zoom"
       style={{ backgroundImage: `url(...)` }} />
  <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
</div>
```

**Apple-Style Card Pattern:**
```tsx
<div className="apple-card p-8 transform hover:scale-105 transition-all duration-300">
  <div className="text-6xl mb-4">{emoji}</div>
  <h3 className="text-2xl font-bold text-[#1D1D1F] mb-3">{title}</h3>
  <p className="text-[#86868b] leading-relaxed">{description}</p>
</div>
```

**Gradient Section Pattern:**
```tsx
<div className="bg-gradient-to-br from-[#F5F5F7] to-white py-20 px-4">
  {/* Content */}
</div>
```

### Performance Considerations
- Used transform/scale for animations instead of width/height changes
- Leveraged Tailwind's purge functionality to keep CSS bundle small
- Optimized images through Unsplash CDN with width and quality parameters
- Implemented responsive images with appropriate sizing

### Browser Compatibility
- Tested on Chrome, Firefox, Safari, Edge
- Mobile-responsive design works on iOS and Android
- Graceful degradation for older browsers
- All animations use CSS transitions (widely supported)

---

## [1.0.0] - 2025-12-21

### Initial Production Release

#### Core Features
- Multi-service quote system (Residential, Commercial, Airbnb)
- AI-powered pricing with Google Gemini
- Automated workflow integration with n8n
- Payment processing via Square
- Email notifications via Resend
- Telegram admin notifications
- Analytics dashboard with insights
- Client feedback and NPS scoring
- Job application system
- Admin authentication with Supabase

#### Database Schema
- `submissions` table for quote requests
- `users` table for admin authentication
- Row Level Security (RLS) policies
- Real-time subscriptions support

#### API Integrations
- Supabase (Database & Auth)
- Square (Payment Links)
- Stripe (Future payment processing)
- Resend (Email service)
- Telegram Bot API (Notifications)
- Google Gemini AI (Pricing & insights)
- n8n (Workflow automation)

#### Deployment
- Deployed to Vercel
- Custom domain: cleanupbros.com.au
- SSL certificate configured
- Automatic deployments on push to main

---

## Versioning Strategy

**Major Version (X.0.0):** Breaking changes, major feature releases
**Minor Version (0.X.0):** New features, significant UI changes
**Patch Version (0.0.X):** Bug fixes, minor improvements

---

## Upgrade Notes

### From 1.0.0 to 1.1.0

**No breaking changes.** This release is purely additive and visual:

- All existing functionality remains intact
- Database schema unchanged
- API endpoints unchanged
- Environment variables unchanged
- No migration required

**Recommendations:**
- Clear browser cache to see new designs
- Review new pages to familiarize with updated UX
- No code changes needed for existing integrations

---

## Roadmap

### Planned for v1.2.0
- Gift card database integration
- Stripe payment processing
- Enhanced admin dashboard
- Mobile app development
- Advanced analytics

### Future Considerations
- Multi-language support
- Recurring booking system
- Customer portal
- Team management features
- Invoice generation

---

*For more information, see [README.md](README.md)*
