import React from 'react';
import { ViewType, ServiceType } from '../types';

interface HeaderProps {
  navigateTo: (view: ViewType) => void;
  isAdminLoggedIn?: boolean;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ navigateTo, isAdminLoggedIn = false, onLogout }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-nav shadow-premium">
      <div className="max-w-[980px] mx-auto px-4 h-[48px] flex justify-between items-center">
        <button onClick={() => navigateTo('Landing')} className="text-left focus:outline-none transition-all hover:scale-105 flex items-center gap-2">
            <img
              src="/logo.png"
              alt="Clean Up Bros"
              className="h-10 w-auto object-contain"
            />
            <span className="text-[17px] font-bold text-gradient-gold tracking-tight hidden sm:inline">
              Clean Up Bros
            </span>
        </button>
        <div className="flex items-center space-x-6">
            <button onClick={() => navigateTo('Landing')} className="hidden md:block text-[13px] font-medium text-[#1D1D1F] hover:text-[#0071e3] transition-all">Home</button>
            <button onClick={() => navigateTo('Services')} className="hidden md:block text-[13px] font-medium text-[#1D1D1F] hover:text-[#0071e3] transition-all">Services</button>

            {/* Public navigation */}
            {!isAdminLoggedIn && (
              <>
                <button onClick={() => navigateTo('GiftCardPurchase')} className="hidden md:block text-[13px] text-[#10B981] hover:text-[#059669] transition-all font-bold">🎁 Gift Cards</button>
                <button onClick={() => navigateTo('About')} className="hidden md:block text-[13px] font-medium text-[#1D1D1F] hover:text-[#0071e3] transition-all">About</button>
                <button onClick={() => navigateTo('Reviews')} className="hidden md:block text-[13px] font-medium text-[#1D1D1F] hover:text-[#0071e3] transition-all">Reviews</button>
                <button onClick={() => navigateTo('Contact')} className="hidden lg:block text-[13px] font-medium text-[#1D1D1F] hover:text-[#0071e3] transition-all">Contact</button>
                <button onClick={() => navigateTo('AdminLogin')} className="hidden lg:block text-[13px] font-medium text-[#1D1D1F] hover:text-[#0071e3] transition-all">Admin</button>
              </>
            )}

            {/* Admin navigation */}
            {isAdminLoggedIn && (
              <>
                <button onClick={() => navigateTo('AdminDashboard')} className="hidden md:block text-[13px] text-[#0071e3] hover:text-[#0077ED] transition-all font-bold">📊 Dashboard</button>
                <button onClick={() => navigateTo('AdminGiftCards')} className="hidden md:block text-[13px] text-[#10B981] hover:text-[#059669] transition-all font-bold">🎁 Gift Cards</button>
                <button onClick={() => navigateTo('AdminContracts')} className="hidden lg:block text-[13px] font-medium text-[#1D1D1F] hover:text-[#0071e3] transition-all">📄 Contracts</button>
                {onLogout && (
                  <button onClick={onLogout} className="hidden lg:block text-[13px] font-medium text-red-600 hover:text-red-700 transition-all">Logout</button>
                )}
              </>
            )}

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