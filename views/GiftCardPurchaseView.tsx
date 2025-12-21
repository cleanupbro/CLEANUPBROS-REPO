import React, { useState } from 'react';
import { Card } from '../components/Card';
import { NavigationProps } from '../types';
import {
  purchaseGiftCard,
  calculateBonus,
  PurchaseGiftCardData,
} from '../services/giftCardService';
import { createPaymentLink, PaymentLinkData } from '../services/squareService';
import { WEBHOOK_URLS } from '../constants';
import { logGiftCardPurchase } from '../services/googleSheetsService';

const GIFT_CARD_AMOUNTS = [
  { value: 100, label: '$100' },
  { value: 200, label: '$200' },
  { value: 500, label: '$500' },
  { value: 1000, label: '$1000' },
];

const formatPhoneNumber = (value: string) => {
  const digitsOnly = value.replace(/\D/g, '');
  const limitedDigits = digitsOnly.slice(0, 10);
  if (limitedDigits.length > 7) {
    return `${limitedDigits.slice(0, 4)}-${limitedDigits.slice(4, 7)}-${limitedDigits.slice(7, 10)}`;
  }
  if (limitedDigits.length > 4) {
    return `${limitedDigits.slice(0, 4)}-${limitedDigits.slice(4, 7)}`;
  }
  return limitedDigits;
};

export const GiftCardPurchaseView: React.FC<NavigationProps> = ({ navigateTo }) => {
  const [selectedAmount, setSelectedAmount] = useState(100);
  const [customAmount, setCustomAmount] = useState('');
  const [useCustom, setUseCustom] = useState(false);
  const [isGift, setIsGift] = useState(false);

  // Purchaser details
  const [purchaserName, setPurchaserName] = useState('');
  const [purchaserEmail, setPurchaserEmail] = useState('');
  const [purchaserPhone, setPurchaserPhone] = useState('');

  // Recipient details (if gift)
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [giftMessage, setGiftMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const amount = useCustom ? parseFloat(customAmount) || 0 : selectedAmount;
  const bonusAmount = calculateBonus(amount);
  const totalValue = amount + bonusAmount;

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validation
      if (amount < 50) {
        setError('Minimum gift card amount is $50');
        setLoading(false);
        return;
      }

      if (amount > 5000) {
        setError('Maximum gift card amount is $5000');
        setLoading(false);
        return;
      }

      if (!purchaserName || !purchaserEmail) {
        setError('Please fill in all your details');
        setLoading(false);
        return;
      }

      if (isGift && (!recipientName || !recipientEmail)) {
        setError('Please fill in recipient details');
        setLoading(false);
        return;
      }

      // Create gift card in Supabase
      const giftCardData: PurchaseGiftCardData = {
        amount,
        isGift,
        purchaserName,
        purchaserEmail,
        purchaserPhone,
        recipientName: isGift ? recipientName : undefined,
        recipientEmail: isGift ? recipientEmail : undefined,
        giftMessage: isGift ? giftMessage : undefined,
      };

      const result = await purchaseGiftCard(giftCardData);

      if (!result.success || !result.giftCard) {
        setError(result.error || 'Failed to create gift card');
        setLoading(false);
        return;
      }

      // Send to n8n for tracking
      await fetch(WEBHOOK_URLS.GIFT_CARD_PURCHASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...result.giftCard,
          timestamp: new Date().toISOString(),
        }),
      }).catch(err => console.warn('Webhook failed:', err));

      // Log to Google Sheets for backup
      logGiftCardPurchase({
        ...result.giftCard,
        purchaserName,
        purchaserEmail,
      }, result.giftCard.id).catch(err => console.warn('Google Sheets logging failed:', err));

      // Create Square payment link
      const paymentData: PaymentLinkData = {
        customerName: purchaserName,
        customerEmail: purchaserEmail,
        serviceType: 'Gift Card',
        amount: amount,
        referenceId: result.giftCard.id,
        description: `Clean Up Bros Gift Card - $${totalValue} total value (includes 15% bonus)`,
      };

      const paymentResult = await createPaymentLink(paymentData);

      if (paymentResult.success && paymentResult.paymentLink) {
        // Redirect to Square payment
        window.location.href = paymentResult.paymentLink;
      } else {
        setError(paymentResult.error || 'Failed to create payment link');
        setLoading(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-brand-navy mb-4">
            🎁 Clean Up Bros Gift Cards
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Give the gift of a spotless home!
          </p>
          <div className="inline-block bg-brand-gold text-brand-navy px-6 py-3 rounded-full font-bold text-lg">
            Get 15% Bonus Credit on All Gift Cards! 🎉
          </div>
        </div>

        <form onSubmit={handlePurchase}>
          <Card>
            {error && (
              <div className="mb-6 bg-red-50 border-2 border-red-300 rounded-xl p-4 flex items-center gap-3">
                <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            )}

            {/* Amount Selection */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-brand-navy mb-4">
                1. Select Amount
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {GIFT_CARD_AMOUNTS.map(option => {
                  const bonus = calculateBonus(option.value);
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setSelectedAmount(option.value);
                        setUseCustom(false);
                      }}
                      className={`p-6 rounded-2xl border-2 transition-all transform hover:scale-105 ${
                        !useCustom && selectedAmount === option.value
                          ? 'border-brand-gold bg-brand-gold/10 shadow-lg'
                          : 'border-gray-200 hover:border-brand-gold/50'
                      }`}
                    >
                      <div className="text-3xl font-bold text-brand-navy">
                        {option.label}
                      </div>
                      <div className="text-sm text-gray-600 mt-2">
                        +${bonus.toFixed(2)} bonus
                      </div>
                      <div className="text-xl font-semibold text-brand-gold mt-2">
                        = ${(option.value + bonus).toFixed(2)}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="customAmount"
                  checked={useCustom}
                  onChange={(e) => setUseCustom(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300"
                />
                <label htmlFor="customAmount" className="font-medium">
                  Enter custom amount
                </label>
              </div>

              {useCustom && (
                <div className="mt-4">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl font-bold text-gray-600">
                      $
                    </span>
                    <input
                      type="number"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="input pl-10 text-2xl font-bold"
                      placeholder="Enter amount"
                      min="50"
                      max="5000"
                      step="10"
                    />
                  </div>
                  {customAmount && parseFloat(customAmount) >= 50 && (
                    <div className="mt-3 bg-green-50 border border-green-200 rounded-xl p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">You Pay:</span>
                        <span className="text-2xl font-bold">${customAmount}</span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-gray-700">Bonus (15%):</span>
                        <span className="text-xl font-semibold text-brand-gold">
                          +${calculateBonus(parseFloat(customAmount)).toFixed(2)}
                        </span>
                      </div>
                      <div className="border-t border-green-300 mt-2 pt-2"></div>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Total Value:</span>
                        <span className="text-3xl font-bold text-brand-navy">
                          ${(parseFloat(customAmount) + calculateBonus(parseFloat(customAmount))).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Gift Option */}
            <div className="mb-8 p-6 bg-blue-50 rounded-2xl">
              <label className="flex items-center gap-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isGift}
                  onChange={(e) => setIsGift(e.target.checked)}
                  className="w-6 h-6 rounded border-gray-300"
                />
                <div>
                  <span className="text-xl font-bold text-brand-navy">
                    This is a gift for someone else
                  </span>
                  <p className="text-sm text-gray-600 mt-1">
                    We'll email the gift card directly to the recipient
                  </p>
                </div>
              </label>
            </div>

            {/* Your Details */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-brand-navy mb-4">
                2. Your Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={purchaserName}
                    onChange={(e) => setPurchaserName(e.target.value)}
                    className="input"
                    placeholder="John Smith"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Email *
                  </label>
                  <input
                    type="email"
                    value={purchaserEmail}
                    onChange={(e) => setPurchaserEmail(e.target.value)}
                    className="input"
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    value={purchaserPhone}
                    onChange={(e) => setPurchaserPhone(formatPhoneNumber(e.target.value))}
                    className="input"
                    placeholder="0412-345-678"
                  />
                </div>
              </div>
            </div>

            {/* Recipient Details (if gift) */}
            {isGift && (
              <div className="mb-8 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200">
                <h2 className="text-2xl font-bold text-brand-navy mb-4">
                  3. Recipient Details
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Recipient Name *
                    </label>
                    <input
                      type="text"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      className="input"
                      placeholder="Jane Doe"
                      required={isGift}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Recipient Email *
                    </label>
                    <input
                      type="email"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      className="input"
                      placeholder="jane@example.com"
                      required={isGift}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Gift Message (Optional)
                    </label>
                    <textarea
                      value={giftMessage}
                      onChange={(e) => setGiftMessage(e.target.value)}
                      className="input resize-none"
                      rows={4}
                      placeholder="Happy Birthday! Enjoy a sparkling clean home on me! ❤️"
                      maxLength={500}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {giftMessage.length}/500 characters
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Purchase Summary */}
            <div className="mb-8 p-8 bg-gradient-to-br from-brand-navy to-blue-900 text-white rounded-3xl shadow-2xl">
              <h2 className="text-3xl font-bold mb-6">Purchase Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-lg">
                  <span>Amount Paid:</span>
                  <span className="font-bold text-2xl">${amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-lg">
                  <span>Bonus Credit (15%):</span>
                  <span className="font-bold text-2xl text-brand-gold">
                    +${bonusAmount.toFixed(2)}
                  </span>
                </div>
                <div className="border-t border-white/30 pt-4 mt-4"></div>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-semibold">Total Gift Card Value:</span>
                  <span className="text-4xl font-bold text-brand-gold">
                    ${totalValue.toFixed(2)}
                  </span>
                </div>
              </div>

              {isGift && (
                <div className="mt-6 pt-6 border-t border-white/30">
                  <p className="text-sm text-white/80">
                    📧 Gift card will be emailed to: <strong>{recipientEmail || 'recipient@example.com'}</strong>
                  </p>
                </div>
              )}
            </div>

            {/* Purchase Button */}
            <button
              type="submit"
              disabled={loading || amount < 50}
              className="btn-primary w-full py-5 text-xl font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                `🎁 Purchase Gift Card - $${amount.toFixed(2)}`
              )}
            </button>

            {/* Terms */}
            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-600 leading-relaxed">
                <strong>Terms & Conditions:</strong> Gift cards never expire. Non-refundable.
                Can be used for any Clean Up Bros service. Card will be activated after payment
                confirmation. You'll receive a confirmation email with the gift card code.
                {isGift && ' The recipient will receive a separate email with the gift card details.'}
              </p>
            </div>

            {/* Benefits */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4">
                <div className="text-4xl mb-2">💰</div>
                <div className="font-semibold text-brand-navy">Save 15%</div>
                <div className="text-sm text-gray-600">Get bonus credit</div>
              </div>
              <div className="text-center p-4">
                <div className="text-4xl mb-2">⏰</div>
                <div className="font-semibold text-brand-navy">Never Expires</div>
                <div className="text-sm text-gray-600">Use anytime</div>
              </div>
              <div className="text-center p-4">
                <div className="text-4xl mb-2">🎯</div>
                <div className="font-semibold text-brand-navy">Any Service</div>
                <div className="text-sm text-gray-600">Fully flexible</div>
              </div>
            </div>
          </Card>
        </form>

        {/* Back Button */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigateTo('Landing')}
            className="text-gray-600 hover:text-brand-navy font-medium"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};
