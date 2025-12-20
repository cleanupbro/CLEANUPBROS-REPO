import React from 'react';
import { ViewType, ServiceType } from '../types';

export const Header: React.FC<{ navigateTo: (view: ViewType) => void }> = ({ navigateTo }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[rgba(29,29,31,0.72)] backdrop-blur-md transition-all duration-300">
      <div className="max-w-[980px] mx-auto px-4 h-[44px] flex justify-between items-center">
        <button onClick={() => navigateTo('Landing')} className="text-left focus:outline-none transition-opacity hover:opacity-80">
            <span className="text-[17px] font-semibold text-white tracking-tight">
              Clean Up Bros
            </span>
        </button>
        <div className="flex items-center space-x-8">
            <button onClick={() => navigateTo('Landing')} className="hidden md:block text-xs text-[#E8E8ED] hover:text-white transition-colors">Home</button>
            <button onClick={() => navigateTo('Services')} className="hidden md:block text-xs text-[#E8E8ED] hover:text-white transition-colors">Services</button>
            <button onClick={() => navigateTo('CleanUpCard')} className="hidden md:block text-xs text-[#F2B705] hover:text-white transition-colors font-semibold">💳 Card</button>
            <button onClick={() => navigateTo('About')} className="hidden md:block text-xs text-[#E8E8ED] hover:text-white transition-colors">About</button>
            <button onClick={() => navigateTo('Reviews')} className="hidden md:block text-xs text-[#E8E8ED] hover:text-white transition-colors">Reviews</button>
            <button onClick={() => navigateTo('Contact')} className="hidden lg:block text-xs text-[#E8E8ED] hover:text-white transition-colors">Contact</button>

            <a
            href="tel:+61406764585"
            className="bg-[#0071e3] text-white rounded-full text-xs font-medium px-3 py-1 hover:bg-[#0077ED] transition-colors"
            >
            Call Now
            </a>
        </div>
      </div>
    </header>
  );
};