
import React, { useState, useEffect, useMemo } from 'react';
import { NavigationProps, ServiceType, ResidentialQuoteData } from '../types';
import { PricingCalculator } from '../lib/priceCalculator';
import { sendToWebhook } from '../services/webhookService';
import { saveSubmission } from '../services/submissionService';
import { saveFailedSubmission } from '../services/failedSubmissionsService';
import { WEBHOOK_URLS } from '../constants';
import { useToast } from '../contexts/ToastContext';

// Hero Unit Component for the full-width sections
const HeroUnit = ({ 
  title, 
  headline, 
  description, 
  links, 
  imageUrl, 
  dark = false, 
  animated = false,
  onClick
}: { 
  title?: string, 
  headline: string, 
  description: string, 
  links: { text: string, action: () => void }[], 
  imageUrl: string, 
  dark?: boolean,
  animated?: boolean,
  onClick?: () => void
}) => (
  <div onClick={onClick} className={`hero-unit min-h-[600px] md:min-h-[750px] ${dark ? 'bg-black text-white' : 'bg-[#F5F5F7] text-[#1D1D1F]'} mb-3 relative group overflow-hidden`}>
     <div className="hero-unit-text flex flex-col items-center max-w-[90%] md:max-w-[85%] mx-auto z-20 !pt-10 md:!pt-14">
        {title && <h3 className={`text-xl md:text-2xl font-semibold mb-1 ${dark ? 'text-[#F2B705]' : 'text-[#F2B705]'}`}>{title}</h3>}
        {/* SEO UPGRADE: H1 for main hero headline */}
        <h1 className={`text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight mb-2 leading-tight text-center drop-shadow-2xl ${dark ? 'text-white' : 'text-white'}`}>{headline}</h1>
        <p className={`text-xl md:text-2xl font-medium mb-6 text-center max-w-2xl drop-shadow-lg ${dark ? 'text-gray-100' : 'text-white'}`}>{description}</p>
        
        <div className="flex flex-col md:flex-row gap-4 mt-4 items-center justify-center w-full z-30 pointer-events-auto">
            {links.map((link, i) => (
               <button 
                 key={i} 
                 onClick={(e) => { e.stopPropagation(); link.action(); }} 
                 className={`
                   px-8 py-4 rounded-full transition-all duration-300 font-semibold text-[17px] flex items-center shadow-lg hover:shadow-2xl transform hover:scale-105 active:scale-95
                   ${dark 
                     ? 'bg-white text-[#1D1D1F] hover:bg-gray-100' 
                     : 'bg-[#0071e3] text-white hover:bg-[#0077ED]'
                   }
                 `}
               >
                  {link.text}
               </button>
            ))}
        </div>
     </div>
     
     {/* Background Image - Full Cover with Zoom Effect */}
     <div 
       className={`absolute inset-0 bg-no-repeat bg-cover bg-center z-0 ${animated ? 'animate-slow-zoom' : 'transition-transform duration-[2s] ease-out group-hover:scale-[1.03]'}`}
       style={{ backgroundImage: `url(${imageUrl})` }}
     />
     
     {/* Gradient Overlay: Darker for better text contrast */}
     <div className={`absolute inset-0 z-0 pointer-events-none ${dark ? 'bg-black/40' : 'bg-gradient-to-b from-black/60 via-black/20 to-black/40'}`} />
  </div>
);

// Smaller Grid Unit Component
const GridUnit = ({ 
  title, 
  headline, 
  description, 
  links, 
  imageUrl, 
  dark = false,
  onClick
}: { 
  title: string, 
  headline: string, 
  description?: string, 
  links?: { text: string, action: () => void }[], 
  imageUrl: string, 
  dark?: boolean,
  onClick: () => void
}) => (
    <div onClick={onClick} className={`relative overflow-hidden cursor-pointer group min-h-[500px] flex flex-col items-center text-center pt-12 ${dark ? 'bg-black text-white' : 'bg-[#F5F5F7] text-[#1D1D1F]'}`}>
        <div className="relative z-20 px-6 animate-fade-in-up flex flex-col items-center h-full">
            <h2 className={`text-4xl md:text-5xl font-semibold tracking-tight mb-2 drop-shadow-xl ${dark ? 'text-white' : 'text-white'}`}>{title}</h2>
            <p className={`text-lg md:text-xl font-normal mb-4 drop-shadow-md ${dark ? 'text-gray-100' : 'text-white'}`}>{headline}</p>
            {description && <p className={`text-sm mb-4 drop-shadow-md ${dark ? 'text-gray-200' : 'text-gray-100'}`}>{description}</p>}
            
            {links && (
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mt-2">
                    {links.map((link, i) => (
                    <button 
                        key={i} 
                        onClick={(e) => { e.stopPropagation(); link.action(); }} 
                        className={`
                           px-6 py-3 rounded-full transition-all duration-300 font-semibold text-[15px] flex items-center shadow-md hover:shadow-xl transform hover:scale-105 active:scale-95
                           ${dark 
                             ? 'bg-white text-[#1D1D1F] hover:bg-gray-100' 
                             : 'bg-[#0071e3] text-white hover:bg-[#0077ED]'
                           }
                        `}
                    >
                        {link.text}
                    </button>
                    ))}
                </div>
            )}
        </div>
        {/* Gradient Overlay for legibility */}
        <div className={`absolute inset-0 z-10 ${dark ? 'bg-black/50' : 'bg-black/40'}`} />
        
         <div 
            className="absolute inset-0 bg-no-repeat bg-cover bg-center z-0 animate-slow-zoom"
            style={{ backgroundImage: `url(${imageUrl})` }}
        />
    </div>
);

const LandingView: React.FC<NavigationProps> = ({ navigateTo, onSubmissionFail }) => {
  const [isQuickQuoteOpen, setIsQuickQuoteOpen] = useState(false);
  const [quickQuoteData, setQuickQuoteData] = useState({
    suburb: '',
    bedrooms: 1,
    bathrooms: 1,
    serviceType: '' as ResidentialQuoteData['serviceType'],
  });
  const [quickQuoteEstimate, setQuickQuoteEstimate] = useState<{ price: number } | null>(null);
  const [isEstimateLoading, setIsEstimateLoading] = useState(false);
  const [estimateError, setEstimateError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();
  
  const priceCalculator = useMemo(() => new PricingCalculator(), []);

  const updateQuickQuoteData = (fields: Partial<typeof quickQuoteData>) => {
    setEstimateError(null);
    setQuickQuoteData(prev => ({ ...prev, ...fields }));
  };
  
  const handleGetFullQuote = async () => {
    if (!quickQuoteEstimate) return;
    setIsSubmitting(true);
    
    const referenceId = `CUB-LEAD-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const submissionData = { 
        ...quickQuoteData, 
        priceEstimate: quickQuoteEstimate.price,
        referenceId: referenceId,
        leadSource: 'Landing Page Quick Quote',
        submittedAt: new Date().toISOString()
    };

    const result = await sendToWebhook(WEBHOOK_URLS.LANDING_LEAD, submissionData);
    setIsSubmitting(false);

    if (result.success) {
      await saveSubmission({ type: 'Landing Lead', data: submissionData });
      // Pass the same reference ID and data to Residential view to maintain continuity
      navigateTo(ServiceType.Residential, undefined, { ...quickQuoteData, referenceId });
    } else {
      saveFailedSubmission({ type: 'Landing Lead', data: submissionData });
      onSubmissionFail?.();
      showToast(result.error || "An unexpected error occurred. Your data has been saved.", "error");
    }
  };
  
  useEffect(() => {
    const { suburb, bedrooms, bathrooms, serviceType } = quickQuoteData;
    const canCalculate = suburb && bedrooms > 0 && bathrooms > 0 && serviceType;

    if (!canCalculate) {
      setQuickQuoteEstimate(null);
      return;
    }

    setIsEstimateLoading(true);
    setEstimateError(null);
    const handler = setTimeout(() => {
      const fullQuoteData: ResidentialQuoteData = {
        suburb: suburb,
        bedrooms: bedrooms,
        bathrooms: bathrooms,
        serviceType: serviceType,
        propertyType: 'House',
        condition: 'Standard',
        frequency: 'One-time',
        subscribedToOneYearPlan: false,
        addOns: [],
        preferredDate: '',
        preferredTime: '',
        notes: '',
        fullName: '',
        email: '',
        phone: '',
        agreedToTerms: false,
      };

      const result = priceCalculator.calculateResidential(fullQuoteData);

      if (result) {
        setQuickQuoteEstimate({ price: result.total });
        setEstimateError(null);
      } else {
        setQuickQuoteEstimate(null);
        setEstimateError("Unable to calculate estimate with the provided details.");
      }
      setIsEstimateLoading(false);
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [quickQuoteData, priceCalculator]);

  return (
    <div className="w-full bg-white">
      
      {/* Quick Quote Modal */}
      {isQuickQuoteOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in-up">
           <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 relative overflow-hidden">
              <button onClick={() => setIsQuickQuoteOpen(false)} className="absolute top-4 right-4 bg-gray-100 rounded-full p-2 hover:bg-gray-200 transition-colors">
                 <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <h3 className="text-3xl font-semibold tracking-tight mb-2 text-[#1D1D1F]">Quick Estimate</h3>
              <p className="text-[#86868b] mb-6">Get a price in seconds.</p>
              
              <div className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-[#86868b] mb-1">Suburb</label>
                    <input type="text" value={quickQuoteData.suburb} onChange={e => updateQuickQuoteData({ suburb: e.target.value })} className="input" placeholder="e.g. Bondi" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-[#86868b] mb-1">Bedrooms</label>
                        <input type="number" value={quickQuoteData.bedrooms} onChange={e => updateQuickQuoteData({ bedrooms: parseInt(e.target.value) || 0 })} className="input" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#86868b] mb-1">Bathrooms</label>
                        <input type="number" value={quickQuoteData.bathrooms} onChange={e => updateQuickQuoteData({ bathrooms: parseInt(e.target.value) || 0 })} className="input" />
                    </div>
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-[#86868b] mb-1">Service Type</label>
                    <select value={quickQuoteData.serviceType} onChange={e => updateQuickQuoteData({ serviceType: e.target.value as any })} className="select">
                        <option value="" disabled>Select...</option>
                        <option>General</option>
                        <option>Deep</option>
                        <option>End-of-Lease</option>
                        <option>Post-Construction</option>
                    </select>
                 </div>

                 <div className="pt-4 min-h-[80px] flex items-center justify-center">
                    {isEstimateLoading ? (
                        <div className="animate-pulse text-[#86868b]">Calculating...</div>
                    ) : quickQuoteEstimate ? (
                        <div className="text-center">
                            <p className="text-sm text-[#86868b] font-medium uppercase">Estimate</p>
                            <p className="text-4xl font-semibold text-[#1D1D1F]">${quickQuoteEstimate.price.toFixed(2)}</p>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400">Enter details above</p>
                    )}
                 </div>
                 
                 <button onClick={handleGetFullQuote} disabled={!quickQuoteEstimate || isSubmitting} className="w-full btn-primary mt-4">
                    {isSubmitting ? 'Processing...' : 'Get Full Quote'}
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Unit 1 - Main Hero with Dynamic Animation */}
      <HeroUnit
        headline="Give your home a refresh."
        description="Find the perfect clean for your space."
        imageUrl="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=2070&auto=format&fit=crop"
        animated={true}
        links={[
            { text: 'Book residential', action: () => navigateTo(ServiceType.Residential) },
            { text: 'Get an estimate', action: () => setIsQuickQuoteOpen(true) }
        ]}
      />

      {/* NDIS Badge/Sticker */}
      <div className="py-4 bg-white flex justify-center">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18c-3.87-.94-7-5.18-7-9V8.3l7-3.11 7 3.11V11c0 3.82-3.13 8.06-7 9z"/>
          </svg>
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg">NDIS</span>
            <span className="text-sm opacity-90">Registered Provider</span>
          </div>
          <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
      </div>

      {/* Unit 3 - Light Mode (Mimics iPhone Air) */}
      <HeroUnit
        headline="Airbnb Turnovers."
        description="The fastest turnover ever. 5-star ready."
        imageUrl="https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=2168&auto=format&fit=crop"
        animated={true}
        links={[
            { text: 'Learn more', action: () => navigateTo('Services') },
            { text: 'Get a quote', action: () => navigateTo(ServiceType.Airbnb) }
        ]}
        onClick={() => navigateTo(ServiceType.Airbnb)}
        dark={true} // Setting to dark mode style for better text visibility on this image
      />

      {/* Bento Grid - (Mimics Accessories/Watch/iPad) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 max-w-[1600px] mx-auto">
          {/* Commercial - FIXED VISIBILITY */}
          <GridUnit 
            title="Commercial"
            headline="Business class."
            imageUrl="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2338&auto=format&fit=crop"
            links={[
                { text: 'Learn more', action: () => navigateTo('Services') },
                { text: 'Contact us', action: () => navigateTo('Contact') }
            ]}
            onClick={() => navigateTo(ServiceType.Commercial)}
            dark={false} 
          />

          {/* Careers */}
          <GridUnit 
            title="Careers"
            headline="Join the team."
            description="Grow your career with flexible hours."
            imageUrl="https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2069&auto=format&fit=crop"
            links={[
                { text: 'Apply now', action: () => navigateTo(ServiceType.Jobs) }
            ]}
            onClick={() => navigateTo(ServiceType.Jobs)}
            dark={true} 
          />

          {/* Reviews */}
          <GridUnit 
            title="Reviews"
            headline="What people say."
            imageUrl="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop"
             links={[
                { text: 'Read reviews', action: () => navigateTo('Reviews') },
                { text: 'Leave feedback', action: () => navigateTo('ClientFeedback') }
            ]}
            onClick={() => navigateTo('ClientFeedback')}
            dark={true}
          />

           {/* Clean Up Card */}
           <GridUnit 
            title="Clean Up Card"
            headline="Get up to 15% off."
            description="Subscribe to our yearly plan."
            imageUrl="https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=2070&auto=format&fit=crop"
            links={[
                { text: 'Learn more', action: () => navigateTo('About') }
            ]}
            onClick={() => navigateTo(ServiceType.Residential)}
            dark={true}
          />
      </div>
      
      <div className="py-12 bg-white text-center">
         <p className="text-sm text-gray-500 max-w-3xl mx-auto px-4">
            1. Subscription required for 15% discount. Terms and conditions apply. <br/>
            2. Bond back guarantee applies to End of Lease cleans only.
         </p>
      </div>
    </div>
  );
};

export default LandingView;
