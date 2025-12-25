import React, { useState } from 'react';
import { ViewType, ServiceType } from '../types';

interface HeaderProps {
  navigateTo: (view: ViewType) => void;
  isAdminLoggedIn?: boolean;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ navigateTo, isAdminLoggedIn = false, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavigate = (view: ViewType) => {
    setMobileMenuOpen(false);
    navigateTo(view);
  };

  return (
    <>
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
              {/* Desktop Navigation */}
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
              className="hidden sm:block bg-gradient-to-r from-cta-orange to-orange-600 text-white rounded-full text-[13px] font-semibold px-5 py-2.5 hover:shadow-lg transition-all hover:scale-105 shadow-md"
              >
              Get Quote →
              </a>

              {/* Hamburger Menu Button - Mobile Only */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-all"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <svg className="w-6 h-6 text-[#1D1D1F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-[#1D1D1F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Drawer */}
      <div className={`fixed top-[48px] right-0 w-[280px] h-[calc(100vh-48px)] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <nav className="flex flex-col p-4 space-y-1">
          {/* Public Menu Items */}
          {!isAdminLoggedIn && (
            <>
              <button
                onClick={() => handleNavigate('Landing')}
                className="flex items-center gap-3 px-4 py-3 text-[15px] font-medium text-[#1D1D1F] hover:bg-[#0071e3]/10 rounded-xl transition-all"
              >
                <span className="text-lg">🏠</span> Home
              </button>
              <button
                onClick={() => handleNavigate('Services')}
                className="flex items-center gap-3 px-4 py-3 text-[15px] font-medium text-[#1D1D1F] hover:bg-[#0071e3]/10 rounded-xl transition-all"
              >
                <span className="text-lg">🧹</span> Services
              </button>
              <button
                onClick={() => handleNavigate('GiftCardPurchase')}
                className="flex items-center gap-3 px-4 py-3 text-[15px] font-bold text-[#10B981] hover:bg-[#10B981]/10 rounded-xl transition-all"
              >
                <span className="text-lg">🎁</span> Gift Cards
              </button>
              <button
                onClick={() => handleNavigate('About')}
                className="flex items-center gap-3 px-4 py-3 text-[15px] font-medium text-[#1D1D1F] hover:bg-[#0071e3]/10 rounded-xl transition-all"
              >
                <span className="text-lg">ℹ️</span> About Us
              </button>
              <button
                onClick={() => handleNavigate('Reviews')}
                className="flex items-center gap-3 px-4 py-3 text-[15px] font-medium text-[#1D1D1F] hover:bg-[#0071e3]/10 rounded-xl transition-all"
              >
                <span className="text-lg">⭐</span> Reviews
              </button>
              <button
                onClick={() => handleNavigate('Contact')}
                className="flex items-center gap-3 px-4 py-3 text-[15px] font-medium text-[#1D1D1F] hover:bg-[#0071e3]/10 rounded-xl transition-all"
              >
                <span className="text-lg">📧</span> Contact
              </button>

              <div className="border-t border-gray-200 my-2" />

              <button
                onClick={() => handleNavigate('AdminLogin')}
                className="flex items-center gap-3 px-4 py-3 text-[15px] font-medium text-gray-500 hover:bg-gray-100 rounded-xl transition-all"
              >
                <span className="text-lg">🔐</span> Admin Login
              </button>
            </>
          )}

          {/* Admin Menu Items */}
          {isAdminLoggedIn && (
            <>
              <button
                onClick={() => handleNavigate('AdminDashboard')}
                className="flex items-center gap-3 px-4 py-3 text-[15px] font-bold text-[#0071e3] hover:bg-[#0071e3]/10 rounded-xl transition-all"
              >
                <span className="text-lg">📊</span> Dashboard
              </button>
              <button
                onClick={() => handleNavigate('AdminGiftCards')}
                className="flex items-center gap-3 px-4 py-3 text-[15px] font-bold text-[#10B981] hover:bg-[#10B981]/10 rounded-xl transition-all"
              >
                <span className="text-lg">🎁</span> Gift Cards
              </button>
              <button
                onClick={() => handleNavigate('AdminContracts')}
                className="flex items-center gap-3 px-4 py-3 text-[15px] font-medium text-[#1D1D1F] hover:bg-[#0071e3]/10 rounded-xl transition-all"
              >
                <span className="text-lg">📄</span> Contracts
              </button>
              <button
                onClick={() => handleNavigate('Services')}
                className="flex items-center gap-3 px-4 py-3 text-[15px] font-medium text-[#1D1D1F] hover:bg-[#0071e3]/10 rounded-xl transition-all"
              >
                <span className="text-lg">🧹</span> Services
              </button>

              <div className="border-t border-gray-200 my-2" />

              {onLogout && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="flex items-center gap-3 px-4 py-3 text-[15px] font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all"
                >
                  <span className="text-lg">🚪</span> Logout
                </button>
              )}
            </>
          )}

          {/* Call Now Button in Mobile Menu */}
          <div className="pt-4">
            <a
              href="tel:+61406764585"
              className="flex items-center justify-center gap-2 w-full bg-[#0071e3] text-white rounded-xl text-[15px] font-semibold px-4 py-3 hover:bg-[#0077ED] transition-all shadow-md"
            >
              📞 Call Now
            </a>
          </div>
        </nav>
      </div>
    </>
  );
};