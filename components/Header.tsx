import React from 'react';
import { ViewType, ServiceType } from '../types';

export const Header: React.FC<{ navigateTo: (view: ViewType) => void }> = ({ navigateTo }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-nav shadow-premium">
      <div className="max-w-[980px] mx-auto px-4 h-[48px] flex justify-between items-center">
        <button onClick={() => navigateTo('Landing')} className="text-left focus:outline-none transition-all hover:scale-105">
            <span className="text-[17px] font-bold text-gradient-gold tracking-tight">
              ✨ Clean Up Bros
            </span>
        </button>
        <div className="flex items-center space-x-6">
            <button onClick={() => navigateTo('Landing')} className="hidden md:block text-[13px] font-medium text-[#1D1D1F] hover:text-[#0071e3] transition-all">Home</button>
            <button onClick={() => navigateTo('Services')} className="hidden md:block text-[13px] font-medium text-[#1D1D1F] hover:text-[#0071e3] transition-all">Services</button>
            <button onClick={() => navigateTo('CleanUpCard')} className="hidden md:block text-[13px] text-[#F2B705] hover:text-[#FFD700] transition-all font-bold">💳 Card</button>
            <button onClick={() => navigateTo('GiftCardPurchase')} className="hidden md:block text-[13px] text-[#10B981] hover:text-[#059669] transition-all font-bold">🎁 Gift Cards</button>
            <button onClick={() => navigateTo('About')} className="hidden md:block text-[13px] font-medium text-[#1D1D1F] hover:text-[#0071e3] transition-all">About</button>
            <button onClick={() => navigateTo('Reviews')} className="hidden md:block text-[13px] font-medium text-[#1D1D1F] hover:text-[#0071e3] transition-all">Reviews</button>
            <button onClick={() => navigateTo('Contact')} className="hidden lg:block text-[13px] font-medium text-[#1D1D1F] hover:text-[#0071e3] transition-all">Contact</button>
            <button onClick={() => navigateTo('AdminLogin')} className="hidden lg:block text-[13px] font-medium text-[#1D1D1F] hover:text-[#0071e3] transition-all">Admin</button>

            <a
            href="tel:+61406764585"
            className="bg-[#0071e3] text-white rounded-full text-[13px] font-semibold px-4 py-2 hover:bg-[#0077ED] transition-all hover:scale-105 shadow-md"
            >
            📞 Call Now
            </a>
        </div>
      </div>
    </header>
  );
};