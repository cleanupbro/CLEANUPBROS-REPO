import React from 'react';
import { ViewType } from '../types';

export const Footer: React.FC<{ navigateTo: (view: ViewType) => void }> = ({ navigateTo }) => {
  return (
    <footer className="bg-[#F5F5F7] border-t border-gray-200 py-10">
      <div className="max-w-[980px] mx-auto px-4 text-center md:text-left">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 border-b border-gray-200 pb-6">
             <div className="flex items-center gap-3 mb-4 md:mb-0">
                <img
                  src="/logo.png"
                  alt="Clean Up Bros"
                  className="h-12 w-auto object-contain"
                />
                <div className="text-xs text-[#86868b]">
                  More ways to shop: <a href="tel:+61406764585" className="text-[#0071e3] underline">Call us</a> or <span className="text-[#0071e3] underline cursor-pointer" onClick={() => navigateTo('Landing')}>find a service online</span>.
                </div>
             </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center text-[11px] text-[#86868b]">
            <div className="mb-2 md:mb-0">
                Copyright © {new Date().getFullYear()} Clean Up Bros. All rights reserved.
            </div>
            <div className="flex space-x-4">
                <button onClick={() => navigateTo('ClientFeedback')} className="hover:text-[#1D1D1F] transition-colors">Feedback</button>
                <span className="text-gray-300">|</span>
                <button onClick={() => navigateTo('AdminLogin')} className="hover:text-[#1D1D1F] transition-colors">Admin</button>
            </div>
        </div>
        
        <div className="mt-4 text-[11px] text-[#86868b] text-center md:text-left">
            Proudly built with Google AI Studio
        </div>
      </div>
    </footer>
  );
};