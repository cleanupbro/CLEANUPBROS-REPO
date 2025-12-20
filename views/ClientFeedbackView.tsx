
import React, { useState } from 'react';
import { Card, SubmissionError } from '../components/Card';
import { StarRating } from '../components/StarRating';
import { NavigationProps, ClientFeedbackData, ServiceType } from '../types';
import { sendToWebhook } from '../services/webhookService';
import { saveSubmission } from '../services/submissionService';
import { saveFailedSubmission } from '../services/failedSubmissionsService';
import { WEBHOOK_URLS, SUCCESS_MESSAGES } from '../constants';

const INITIAL_DATA: ClientFeedbackData = {
  rating: 0,
  comments: '',
  fullName: '',
  email: '',
};

// NPS scores (0-10 scale)
const NPS_LABELS = [
  'Not at all likely',
  '1', '2', '3', '4', '5', '6', '7', '8', '9',
  'Extremely likely'
];

const ClientFeedbackView: React.FC<NavigationProps> = ({ navigateTo, onSubmissionFail }) => {
  const [data, setData] = useState(INITIAL_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [npsScore, setNpsScore] = useState<number | null>(null);

  const updateData = (fields: Partial<ClientFeedbackData>) => {
    setData(prev => ({ ...prev, ...fields }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (data.rating === 0) {
        setSubmissionError("Please select a star rating before submitting.");
        return;
    }
    setSubmissionError(null);
    setIsSubmitting(true);
    
    const referenceId = `CUB-FB-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const successMsg = SUCCESS_MESSAGES[ServiceType.ClientFeedback];

    const submissionData = {
        ...data,
        npsScore,
        referenceId: referenceId,
        confirmationMessage: "Feedback Received",
        displayMessage: successMsg,
        submittedAt: new Date().toISOString()
    };

    const result = await sendToWebhook(WEBHOOK_URLS[ServiceType.ClientFeedback], submissionData);
    setIsSubmitting(false);

    if (result.success) {
      await saveSubmission({ type: ServiceType.ClientFeedback, data: submissionData });
      navigateTo('Success', successMsg, { referenceId });
    } else {
      saveFailedSubmission({ type: ServiceType.ClientFeedback, data: submissionData });
      onSubmissionFail?.();
      setSubmissionError(result.error || "An unexpected error occurred. Your feedback has been saved and can be retried later.");
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <Card>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold">Share Your Feedback</h2>
          <p className="text-gray-500 mt-2">How was your recent cleaning service? Your feedback helps us improve.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 text-center mb-2">Your Rating</label>
            <StarRating rating={data.rating} onRatingChange={(rating) => {
                updateData({ rating });
                if(submissionError) setSubmissionError(null);
            }} />
          </div>
          {/* NPS Survey */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
            <label className="block text-sm font-semibold text-brand-navy text-center mb-4">
              How likely are you to recommend Clean Up Bros to a friend or colleague?
            </label>
            <div className="flex justify-between items-center gap-1 mb-2">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(score => (
                <button
                  key={score}
                  type="button"
                  onClick={() => setNpsScore(score)}
                  className={`w-10 h-10 rounded-lg font-bold transition-all transform hover:scale-110 ${
                    npsScore === score
                      ? score <= 6
                        ? 'bg-red-500 text-white shadow-lg scale-110'
                        : score <= 8
                        ? 'bg-yellow-500 text-white shadow-lg scale-110'
                        : 'bg-green-500 text-white shadow-lg scale-110'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-300'
                  }`}
                >
                  {score}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-600 mt-2">
              <span>Not likely</span>
              <span>Extremely likely</span>
            </div>
            {npsScore !== null && (
              <div className="mt-3 text-center">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                  npsScore <= 6
                    ? 'bg-red-100 text-red-800'
                    : npsScore <= 8
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {npsScore <= 6 ? 'Detractor' : npsScore <= 8 ? 'Passive' : 'Promoter ⭐'}
                </span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Comments</label>
            <textarea
              value={data.comments}
              onChange={e => updateData({ comments: e.target.value })}
              rows={5}
              className="input"
              placeholder="Tell us about your experience..."
              required
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name (Optional)</label>
            <input
              type="text"
              value={data.fullName}
              onChange={e => updateData({ fullName: e.target.value })}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email (Optional)</label>
            <input
              type="email"
              value={data.email}
              onChange={e => updateData({ email: e.target.value })}
              className="input"
            />
          </div>
          
          <SubmissionError error={submissionError} />
          
          <div className="pt-2">
            <button type="submit" disabled={isSubmitting || data.rating === 0} className="w-full btn-primary">
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ClientFeedbackView;
