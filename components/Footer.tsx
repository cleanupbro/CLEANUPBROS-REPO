import React from 'react';
import { ViewType } from '../types';

export const Footer: React.FC<{ navigateTo: (view: ViewType) => void }> = ({ navigateTo }) => {
  return (
    <footer className="bg-[#F5F5F7] border-t border-gray-200 py-10">
      <div className="max-w-[980px] mx-auto px-4">

        {/* Navigation Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 text-sm">
          <div>
            <h4 className="font-semibold text-[#1D1D1F] mb-3">Services</h4>
            <ul className="space-y-2 text-[#86868b]">
              <li><button onClick={() => navigateTo('Residential')} className="hover:text-[#0071e3] transition-colors">Residential</button></li>
              <li><button onClick={() => navigateTo('Commercial')} className="hover:text-[#0071e3] transition-colors">Commercial</button></li>
              <li><button onClick={() => navigateTo('Airbnb')} className="hover:text-[#0071e3] transition-colors">Airbnb</button></li>
              <li><button onClick={() => navigateTo('Services')} className="hover:text-[#0071e3] transition-colors">All Services</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-[#1D1D1F] mb-3">Company</h4>
            <ul className="space-y-2 text-[#86868b]">
              <li><button onClick={() => navigateTo('About')} className="hover:text-[#0071e3] transition-colors">About Us</button></li>
              <li><button onClick={() => navigateTo('Reviews')} className="hover:text-[#0071e3] transition-colors">Reviews</button></li>
              <li><button onClick={() => navigateTo('Jobs')} className="hover:text-[#0071e3] transition-colors">Careers</button></li>
              <li><button onClick={() => navigateTo('Contact')} className="hover:text-[#0071e3] transition-colors">Contact</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-[#1D1D1F] mb-3">More</h4>
            <ul className="space-y-2 text-[#86868b]">
              <li><button onClick={() => navigateTo('GiftCardPurchase')} className="hover:text-[#0071e3] transition-colors">Gift Cards</button></li>
              <li><button onClick={() => navigateTo('ClientFeedback')} className="hover:text-[#0071e3] transition-colors">Feedback</button></li>
              <li><a href="tel:+61406764585" className="hover:text-[#0071e3] transition-colors">Call Us</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-[#1D1D1F] mb-3">Contact</h4>
            <ul className="space-y-2 text-[#86868b] text-xs">
              <li>Liverpool, NSW</li>
              <li><a href="tel:+61406764585" className="hover:text-[#0071e3]">+61 406 764 585</a></li>
              <li><a href="mailto:cleanupbros.au@gmail.com" className="hover:text-[#0071e3]">cleanupbros.au@gmail.com</a></li>
              <li className="text-[10px]">ABN: 26 443 426 374</li>
            </ul>
          </div>
        </div>

        {/* Trust Badges Row */}
        <div className="flex flex-wrap justify-center items-center gap-4 py-6 border-t border-b border-gray-200 mb-6">
          <img
            src="/ndis-logo.jpg"
            alt="We Love NDIS"
            className="h-10 w-auto object-contain"
          />
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Fully Insured</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <div className="flex">
              {[1,2,3,4,5].map(i => (
                <svg key={i} className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span>4.9 Rating</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>100% Satisfaction</span>
          </div>
        </div>

        {/* Logo and Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <img
              src="/logo.png"
              alt="Clean Up Bros"
              className="h-10 w-auto object-contain"
            />
            <span className="text-sm font-semibold text-[#1D1D1F]">Clean Up Bros</span>
          </div>

          <div className="text-[11px] text-[#86868b]">
            Copyright © {new Date().getFullYear()} Clean Up Bros. All rights reserved.
          </div>

          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <button onClick={() => navigateTo('AdminLogin')} className="text-[11px] text-[#86868b] hover:text-[#1D1D1F] transition-colors">Admin</button>
          </div>
        </div>
      </div>
    </footer>
  );
};