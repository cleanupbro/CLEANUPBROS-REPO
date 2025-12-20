import React from 'react';
import { useMultiStepForm } from '../hooks/useMultiStepForm';
import { Card, SubmissionError } from './Card';

interface MultiStepFormProps {
  title: string;
  steps: React.ReactElement[];
  isSubmitting: boolean;
  onSubmit: () => void;
  submitButtonText?: string;
  submissionError: string | null;
}

export const MultiStepForm: React.FC<MultiStepFormProps> = ({ title, steps, isSubmitting, onSubmit, submitButtonText = 'Submit Quote', submissionError }) => {
  const { currentStepIndex, step, isFirstStep, isLastStep, back, next, steps: allSteps } = useMultiStepForm(steps);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLastStep) {
      return next();
    }
    onSubmit();
  };
  
  const progressPercentage = ((currentStepIndex + 1) / allSteps.length) * 100;

  return (
    <div className="max-w-[700px] mx-auto my-10">
      <div className="text-center mb-10">
          <h2 className="text-4xl font-semibold tracking-tight text-[#1D1D1F]">{title}</h2>
          <p className="text-[#86868b] mt-2 font-medium">Step {currentStepIndex + 1} of {allSteps.length}</p>
      </div>

      {/* Enhanced Progress Bar with Step Indicators */}
      <div className="mb-12">
        <div className="w-full bg-[#E8E8ED] rounded-full h-2 mb-4 overflow-hidden relative">
          <div className="bg-gradient-to-r from-[#0071e3] to-[#0077ED] h-full rounded-full transition-all duration-500 ease-out shadow-lg" style={{ width: `${progressPercentage}%` }}></div>
        </div>

        {/* Step Dots */}
        <div className="flex justify-between items-center px-2">
          {allSteps.map((_, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index <= currentStepIndex
                  ? 'bg-[#0071e3] scale-125 shadow-md'
                  : 'bg-[#E8E8ED]'
              }`} />
              {index === currentStepIndex && (
                <div className="text-xs text-[#0071e3] font-semibold mt-2 animate-pulse">Current</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <Card className="bg-white shadow-apple hover:shadow-apple-hover transition-shadow duration-500">
        <form onSubmit={handleFormSubmit}>
          <div className="min-h-[300px] animate-fade-in-up">
            {step}
          </div>
          
          {isLastStep && <SubmissionError error={submissionError} className="mt-8" />}
          
          <div className="mt-12 flex justify-between items-center pt-8 border-t border-gray-100">
            {!isFirstStep ? (
              <button type="button" onClick={back} className="text-[#0071e3] font-medium text-[17px] hover:underline flex items-center">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
            ) : (
              <div /> 
            )}
            
            <button type="submit" disabled={isSubmitting} className="btn-primary flex items-center px-8">
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : isLastStep ? submitButtonText : 'Continue'}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};