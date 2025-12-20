
import React, { useState, useMemo } from 'react';
import { MultiStepForm } from '../components/MultiStepForm';
import { AirbnbQuoteData, NavigationProps, ServiceType } from '../types';
import { sendToWebhook } from '../services/webhookService';
import { saveSubmission } from '../services/submissionService';
import { saveFailedSubmission } from '../services/failedSubmissionsService';
import { WEBHOOK_URLS, SUCCESS_MESSAGES } from '../constants';
import { PricingCalculator } from '../lib/priceCalculator';
import { Checkbox } from '../components/Checkbox';
import { DateInput } from '../components/DateInput';
import { useToast } from '../contexts/ToastContext';

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

const INITIAL_DATA: AirbnbQuoteData = {
  listingUrl: '',
  propertyType: '',
  bedrooms: '1',
  bathrooms: '1',
  turnoverRequirements: [],
  accessMethod: '',
  preferredTurnoverTime: '',
  preferredStartDate: '',
  cleaningFrequency: '',
  contactName: '',
  email: '',
  phone: '',
};

const PriceEstimateDisplay: React.FC<{ estimate: { price: number } | null, isLoading: boolean, error: string | null }> = ({ estimate, isLoading, error }) => {
    return (
        <div className="p-4 bg-blue-50 border-2 border-brand-gold rounded-lg text-center shadow-md mt-6">
            <div className="flex items-center justify-center gap-1 mb-2">
                <p className="text-sm font-semibold text-brand-navy">INSTANT ESTIMATE</p>
                <div className="relative group inline-block">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 cursor-help" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity w-56 pointer-events-none z-10 shadow-lg">
                        This is an AI-generated estimate based on typical turnover rates. Final pricing will be confirmed upon booking.
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                    </div>
                </div>
            </div>
            {isLoading ? (
                <div className="flex justify-center items-center my-4">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-brand-navy" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-gray-600">Calculating...</p>
                </div>
            ) : error ? (
                 <div className="my-2 p-2 bg-red-50 border-red-300 text-red-800 rounded-lg">
                    <p className="font-bold text-sm">Estimation Failed</p>
                    <p className="text-xs mt-1">{error}</p>
                </div>
            ) : estimate ? (
                <p className="text-4xl font-bold text-brand-navy my-2">${estimate.price.toFixed(2)} <span className="text-xl font-semibold">per turnover</span></p>
            ) : (
                 <p className="text-gray-600 my-4">Complete the form to see an estimate.</p>
            )}
             <p className="text-xs text-gray-500 mt-2">Final price will be confirmed upon booking. This is an AI-generated estimate.</p>
        </div>
    );
};


const AirbnbQuoteView: React.FC<NavigationProps> = ({ navigateTo, onSubmissionFail }) => {
  const [data, setData] = useState(INITIAL_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const { showToast } = useToast();
  const priceCalculator = useMemo(() => new PricingCalculator(), []);

  const updateData = (fields: Partial<AirbnbQuoteData>) => {
    setData(prev => ({ ...prev, ...fields }));
  };

  const estimate = useMemo(() => {
      const canCalculate = data.propertyType && data.bedrooms && data.bathrooms;
      if (!canCalculate) return null;

      const result = priceCalculator.calculateAirbnb(data);
      if (result) {
          return { price: result.total };
      }
      return null;
  }, [data, priceCalculator]);
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setData(prev => {
      const currentValues = prev.turnoverRequirements;
      if (checked) {
        return { ...prev, turnoverRequirements: [...currentValues, value] };
      } else {
        return { ...prev, turnoverRequirements: currentValues.filter(item => item !== value) };
      }
    });
  };

  const onSubmit = async () => {
    setSubmissionError(null);
    setIsSubmitting(true);
    
    const referenceId = `CUB-AIR-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const successMsg = SUCCESS_MESSAGES[ServiceType.Airbnb];

    const submissionData = { 
        ...data, 
        priceEstimate: estimate?.price,
        referenceId: referenceId,
        confirmationMessage: "Airbnb Turnover Quote Received",
        displayMessage: successMsg,
        submittedAt: new Date().toISOString()
    };

    const result = await sendToWebhook(WEBHOOK_URLS[ServiceType.Airbnb], submissionData);
    setIsSubmitting(false);
    if(result.success) {
      await saveSubmission({ type: ServiceType.Airbnb, data: submissionData });
      navigateTo('Success', successMsg, { referenceId });
    } else {
      saveFailedSubmission({ type: ServiceType.Airbnb, data: submissionData });
      onSubmissionFail?.();
      const errorMsg = result.error || "An unexpected error occurred. Please contact us directly.";
      setSubmissionError(errorMsg);
      showToast(errorMsg, "error");
    }
  };

  return (
    <>
      <MultiStepForm
        title="Airbnb Turnover Quote"
        isSubmitting={isSubmitting}
        onSubmit={onSubmit}
        submitButtonText="Submit Request"
        submissionError={submissionError}
        steps={[
          // Step 1: Listing Details
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Listing Details</h3>
            <div>
              <label className="block text-sm font-medium text-[#1D1D1F]">Airbnb Listing URL</label>
              <input type="text" placeholder="e.g., https://airbnb.com/h/your-listing" value={data.listingUrl} onChange={e => updateData({ listingUrl: e.target.value })} className="input" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1D1D1F]">Property Type</label>
              <input type="text" value={data.propertyType} onChange={e => updateData({ propertyType: e.target.value })} placeholder="e.g., 2-Bed Apartment" className="input" required />
            </div>
            <div className="flex gap-4">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-[#1D1D1F]">Bedrooms</label>
                    <input type="text" inputMode="numeric" pattern="[0-9]*" value={data.bedrooms} onChange={e => updateData({ bedrooms: e.target.value.replace(/\D/g, '') })} onBlur={() => { if (!data.bedrooms || parseInt(data.bedrooms, 10) < 1) { updateData({ bedrooms: '1' }) } }} className="input" required />
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-medium text-[#1D1D1F]">Bathrooms</label>
                    <input type="text" inputMode="numeric" pattern="[0-9]*" value={data.bathrooms} onChange={e => updateData({ bathrooms: e.target.value.replace(/\D/g, '') })} onBlur={() => { if (!data.bathrooms || parseInt(data.bathrooms, 10) < 1) { updateData({ bathrooms: '1' }) } }} className="input" required />
                </div>
            </div>
          </div>,
          // Step 2: Turnover Requirements
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Turnover Requirements</h3>
            <div>
                <label className="block text-sm font-medium text-[#1D1D1F]">Services Needed</label>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {['Linen Change', 'Restock Amenities', 'Guest Communication', 'Damage Report'].map(item => (
                      <Checkbox
                          key={item}
                          id={`service-${item}`}
                          value={item}
                          checked={data.turnoverRequirements.includes(item)}
                          onChange={handleCheckboxChange}
                          label={item}
                      />
                    ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1D1D1F]">Property Access Method</label>
                <input type="text" value={data.accessMethod} onChange={e => updateData({ accessMethod: e.target.value })} placeholder="e.g., Lockbox code, Key handover" className="input" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1D1D1F]">Preferred Turnover Window (e.g., 11am - 3pm)</label>
                <input type="text" value={data.preferredTurnoverTime} onChange={e => updateData({ preferredTurnoverTime: e.target.value })} className="input" required />
              </div>
              <DateInput
                  label="Preferred First Service Date"
                  value={data.preferredStartDate}
                  onChange={(val) => updateData({ preferredStartDate: val })}
                  required
              />
          </div>,
          // Step 3: Contact Info
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Your Information</h3>
            <div>
              <label className="block text-sm font-medium text-[#1D1D1F]">Cleaning Frequency</label>
              <select value={data.cleaningFrequency} onChange={e => updateData({ cleaningFrequency: e.target.value as AirbnbQuoteData['cleaningFrequency'] })} className="select" required>
                  <option value="" disabled>Select...</option>
                  <option value="On Checkout">On Checkout (Standard)</option>
                  <option value="Weekly">Weekly Service</option>
                  <option value="Bi-weekly">Bi-weekly Service</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1D1D1F]">Contact Name</label>
              <input type="text" value={data.contactName} onChange={e => updateData({ contactName: e.target.value })} className="input" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1D1D1F]">Email</label>
              <input type="email" value={data.email} onChange={e => updateData({ email: e.target.value })} className="input" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1D1D1F]">Phone</label>
              <input type="tel" value={data.phone} onChange={e => updateData({ phone: formatPhoneNumber(e.target.value) })} className="input" required maxLength={12} placeholder="e.g. 0400-123-456" />
            </div>
            <PriceEstimateDisplay estimate={estimate} isLoading={false} error={null} />
          </div>
        ]}
      />
    </>
  );
};

export default AirbnbQuoteView;
