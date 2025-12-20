
import React from 'react';
import { Card } from '../components/Card';
import { NavigationProps } from '../types';

interface SubmissionSuccessProps extends NavigationProps {
  message: string;
  referenceId?: string;
}

const SubmissionSuccessView: React.FC<SubmissionSuccessProps> = ({ navigateTo, message, referenceId }) => {
  // Use passed reference ID or fallback to a generated one if missing (shouldn't happen with new logic)
  const displayId = referenceId || `REF-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;

  const referralLink = `https://cleanupbros.com.au?ref=${displayId}`;
  const [copied, setCopied] = React.useState(false);

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-xl mx-auto text-center mt-10">
      <Card className="bg-white border-t-4 border-green-500 shadow-apple hover:shadow-apple-hover">
        <div className="animate-fade-in-up">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-brand-navy mb-2 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          Booking Confirmed
        </h2>
        
        <p className="text-gray-500 text-sm uppercase tracking-wide font-semibold mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          REQUEST RECEIVED SUCCESSFULLY
        </p>

        <div className="bg-gray-50 rounded-xl p-6 mb-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
           <p className="text-gray-700 font-medium text-lg mb-2">
             {message}
           </p>
           <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-500">
             <p className="mb-2">A confirmation email has been sent to your inbox.</p>
             <p className="bg-white inline-block px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                Reference ID: <span className="font-mono font-bold text-brand-navy text-base">{displayId}</span>
             </p>
           </div>
        </div>

        {/* Referral Program */}
        <div className="bg-gradient-to-r from-brand-gold/10 to-brand-navy/10 rounded-xl p-6 mb-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="text-center mb-4">
            <div className="text-4xl mb-2">🎁</div>
            <h3 className="text-xl font-bold text-brand-navy mb-2">Get $50 Credit!</h3>
            <p className="text-gray-700 text-sm">
              Refer a friend and you BOTH get $50 off your next clean!
            </p>
          </div>

          <div className="bg-white rounded-lg p-3 mb-3 flex items-center gap-2">
            <input
              type="text"
              value={referralLink}
              readOnly
              className="flex-1 text-sm text-gray-700 bg-transparent outline-none select-all"
              onClick={(e) => e.currentTarget.select()}
            />
            <button
              onClick={copyReferralLink}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                copied
                  ? 'bg-green-500 text-white'
                  : 'bg-brand-gold text-white hover:bg-brand-gold/90'
              }`}
            >
              {copied ? '✓ Copied!' : 'Copy Link'}
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            Share this link with friends. When they book, you both save $50!
          </p>
        </div>

        <button
          onClick={() => navigateTo('Landing')}
          className="w-full btn-primary animate-fade-in-up"
          style={{ animationDelay: '0.5s' }}
        >
          Return to Home
        </button>
      </Card>
    </div>
  );
};

export default SubmissionSuccessView;
