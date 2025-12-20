# Clean Up Bros - Workspace Structure

## Project Overview
**Clean Up Bros Quote & Application Portal**
A comprehensive web application for Clean Up Bros, a Sydney-based cleaning company. This portal allows customers to get quotes for residential, commercial, and Airbnb cleaning services, and for prospective employees to apply for jobs.

## Technology Stack
- **Frontend Framework**: React 19.2.0 + TypeScript
- **Build Tool**: Vite 6.2.0
- **AI Integration**: Google Gemini AI (@google/genai)
- **Styling**: Tailwind CSS (inline)
- **State Management**: React Context API

## Project Structure

```
clean-up-bros-quote-&-application-portal/
│
├── 📁 auth/
│   └── credentials.ts              # Admin authentication credentials
│
├── 📁 components/                   # Reusable UI Components
│   ├── AdminChatBot.tsx            # AI-powered admin chatbot
│   ├── Card.tsx                    # Generic card component
│   ├── Checkbox.tsx                # Custom checkbox input
│   ├── DateInput.tsx               # Date picker component
│   ├── FileUpload.tsx              # File upload handler
│   ├── Footer.tsx                  # Site footer with navigation
│   ├── Header.tsx                  # Site header/navbar
│   ├── ImageUpload.tsx             # Image upload handler
│   ├── MultiStepForm.tsx           # Multi-step form wizard
│   ├── RetryBanner.tsx             # Failed submission retry banner
│   ├── StarRating.tsx              # Star rating component
│   └── SubmissionCard.tsx          # Admin dashboard submission card
│
├── 📁 contexts/
│   └── ToastContext.tsx            # Toast notification context provider
│
├── 📁 hooks/
│   └── useMultiStepForm.ts         # Custom hook for multi-step forms
│
├── 📁 lib/                          # Utility Libraries
│   ├── knowledgeBase.ts            # AI knowledge base for chatbot
│   └── priceCalculator.ts          # Quote price calculation logic
│
├── 📁 services/                     # API & External Services
│   ├── failedSubmissionsService.ts # Handles failed submission retries
│   ├── geminiService.ts            # Gemini AI service integration
│   ├── submissionService.ts        # Form submission handling
│   └── webhookService.ts           # Webhook communication
│
├── 📁 views/                        # Main Application Views
│   ├── AdminDashboardView.tsx      # Admin CRM dashboard
│   ├── AdminLoginView.tsx          # Admin authentication view
│   ├── AirbnbQuoteView.tsx         # Airbnb cleaning quote form
│   ├── ClientFeedbackView.tsx      # Customer feedback form
│   ├── CommercialQuoteView.tsx     # Commercial cleaning quote form
│   ├── JobApplicationView.tsx      # Job application form
│   ├── LandingView.tsx             # Homepage/landing page
│   ├── ResidentialQuoteView.tsx    # Residential cleaning quote form
│   └── SubmissionSuccessView.tsx   # Success confirmation page
│
├── 📄 App.tsx                       # Main application component & routing
├── 📄 constants.ts                  # Webhook URLs & success messages
├── 📄 index.html                    # HTML entry point
├── 📄 index.tsx                     # React entry point
├── 📄 metadata.json                 # App metadata
├── 📄 types.ts                      # TypeScript type definitions
├── 📄 vite.config.ts               # Vite configuration
├── 📄 tsconfig.json                # TypeScript configuration
├── 📄 package.json                 # Dependencies & scripts
├── 📄 .env.local                   # Environment variables (GEMINI_API_KEY)
└── 📄 README.md                    # Project documentation
```

## Core Features

### 1. Service Quote Forms
- **Residential Cleaning**: Multi-step form with property details, service type, scheduling
- **Commercial Cleaning**: Business facility cleaning quotes with compliance tracking
- **Airbnb Turnover**: Specialized cleaning for short-term rentals

### 2. Job Application Portal
- Application form for cleaning professionals
- File upload for resumes/certifications
- Reference checks and availability tracking

### 3. Admin Dashboard (CRM)
- View and manage all submissions
- AI-powered chatbot for business insights
- Lead scoring and submission tracking
- Status management (Pending/Confirmed/Canceled)

### 4. Client Feedback System
- Star rating component
- Feedback collection and tracking

### 5. AI Integration
- **Gemini AI** for:
  - Admin chatbot with business knowledge
  - Lead scoring and analysis
  - Submission summarization
  - Price estimation assistance

## Data Flow

### Submission Pipeline
```
User Form → Validation → Webhook Service → External CRM
                    ↓
              Failed Submissions Service (Retry Logic)
                    ↓
              Admin Dashboard Display
```

### Webhook Endpoints
All form submissions are routed to specific webhooks:
- Residential: `98d35453-4f18-40ca-bdfa-ba3aaa02646c`
- Commercial: `bb12f45e-21f4-4e43-af36-5dbed46fe072`
- Airbnb: `a12b53e8-2391-4c82-b611-47fa4032c235`
- Jobs: `8da4395f-48f7-4d56-b500-3c43e2077ac6`
- Client Feedback: `22624a36-cd07-4b6b-9334-3909dd3cff9f`
- Landing Leads: `c5dc6960-15ee-4ccb-9cac-3bf8ffcb7bda`

## Key TypeScript Interfaces

### Service Types
- `ServiceType`: Residential | Commercial | Airbnb | Jobs | ClientFeedback
- `ViewType`: Service types + Landing | Success | AdminLogin | AdminDashboard
- `SubmissionStatus`: Pending | Confirmed | Canceled

### Form Data Interfaces
- `ResidentialQuoteData`: 4-step residential cleaning quote
- `CommercialQuoteData`: Commercial facility cleaning details
- `AirbnbQuoteData`: Airbnb property turnover information
- `JobApplicationData`: Employment application with attachments
- `ClientFeedbackData`: Customer feedback ratings

## Development Commands

```bash
# Install dependencies
npm install

# Run development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Setup

Required environment variable in `.env.local`:
```
GEMINI_API_KEY=your_gemini_api_key_here
```

## Navigation Flow

```
Landing Page
    ├── Get a Quote
    │   ├── Residential Cleaning
    │   ├── Commercial Cleaning
    │   └── Airbnb Cleaning
    ├── Apply for a Job
    ├── Leave Feedback
    └── Admin Login
        └── Admin Dashboard (CRM)
```

## State Management

- **Local Component State**: Form data, UI state
- **Context API**: Toast notifications, global alerts
- **LocalStorage**: Admin session, failed submissions queue

## Special Features

### Multi-Step Forms
Uses custom `useMultiStepForm` hook for:
- Step navigation (next, back, goTo)
- Form state persistence
- Progress tracking

### Retry Mechanism
- Failed submissions stored locally
- Automatic retry on page load
- User-triggered manual retry via banner

### Price Calculator
Dynamic pricing based on:
- Property size (bedrooms/bathrooms)
- Service type (General/Deep/End-of-Lease/Post-Construction)
- Property condition
- Frequency discounts
- Add-on services

### Lead Scoring
AI-powered analysis of submissions:
- Automatic lead quality scoring (0-100)
- Reasoning for score
- Business insights

## Admin Features

### Dashboard Capabilities
- View all submissions across all services
- Filter by service type
- Update submission status
- View AI-generated summaries
- Access lead scoring data
- Interactive chatbot for business questions

### Authentication
- Email-based admin login
- Session persistence via localStorage
- Protected admin routes

## Best Practices Implemented

1. **Type Safety**: Comprehensive TypeScript interfaces
2. **Error Handling**: Try-catch blocks with user feedback
3. **Responsive Design**: Mobile-first approach
4. **Accessibility**: Semantic HTML, ARIA labels
5. **Performance**: Lazy loading, optimized builds
6. **Security**: Environment variables for sensitive data
7. **UX**: Multi-step forms, loading states, success confirmations

## Next Steps for Development

1. Set `GEMINI_API_KEY` in `.env.local`
2. Run `npm run dev` to start development server
3. Access application at `http://localhost:5173`
4. Test all form flows and admin dashboard
5. Deploy to production when ready

---

**AI Studio Link**: https://ai.studio/apps/drive/1p_681MUUlH_4tjOHTmK7qhAY25GkS9QZ
