
import React, { useState } from 'react';
import { Submission, SubmissionStatus } from '../types';
import { Card } from './Card';
import { generateSubmissionSummary, generateLeadScore, generateEmailDraft } from '../services/geminiService';
import { updateSubmissionSummary, updateSubmissionScore } from '../services/submissionService';
import { BookingConfirmationModal } from './BookingConfirmationModal';


interface SubmissionCardProps {
  submission: Submission;
  onStatusChange: (id: string, status: SubmissionStatus) => void;
  onSubmissionsUpdate: (submissions: Submission[]) => void;
}

const StatusBadge: React.FC<{ status: SubmissionStatus }> = ({ status }) => {
  const baseClasses = "px-2 py-1 text-xs font-bold rounded-full";
  const statusClasses = {
    [SubmissionStatus.Pending]: "bg-yellow-200 text-yellow-800",
    [SubmissionStatus.Confirmed]: "bg-green-200 text-green-800",
    [SubmissionStatus.Canceled]: "bg-red-200 text-red-800",
  };
  return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

const ScoreBadge: React.FC<{ score?: number }> = ({ score }) => {
    if (score === undefined) return null;
    
    let colorClass = "bg-gray-200 text-gray-800";
    if (score >= 8) colorClass = "bg-green-100 text-green-800 border border-green-300";
    else if (score >= 5) colorClass = "bg-blue-100 text-blue-800 border border-blue-300";
    else colorClass = "bg-orange-100 text-orange-800 border border-orange-300";

    return (
        <div className={`flex items-center px-3 py-1 rounded-full font-bold text-xs ${colorClass}`}>
            <span className="mr-1">Lead Score:</span>
            <span className="text-lg">{score}/10</span>
        </div>
    );
};

const DataRow: React.FC<{ label: string; value: any }> = ({ label, value }) => {
  if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) return null;

  const displayValue = Array.isArray(value) ? value.join(', ') : 
                       typeof value === 'boolean' ? (value ? 'Yes' : 'No') : 
                       value;

  return (
    <div className="py-2 px-3 grid grid-cols-3 gap-4 text-sm even:bg-gray-50">
      <dt className="font-medium text-gray-600">{label}</dt>
      <dd className="text-gray-800 col-span-2 text-wrap break-words">{displayValue}</dd>
    </div>
  );
};

export const SubmissionCard: React.FC<SubmissionCardProps> = ({ submission, onStatusChange, onSubmissionsUpdate }) => {
  const { id, timestamp, type, status, data } = submission;
  const submissionDate = new Date(timestamp).toLocaleString('en-AU');
  
  // Summary State
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(submission.summary || null);

  // Lead Score State
  const [isScoringLoading, setIsScoringLoading] = useState(false);
  const [score, setScore] = useState<number | undefined>(submission.leadScore);
  const [reasoning, setReasoning] = useState<string | undefined>(submission.leadReasoning);

  // Email Draft State
  const [isDrafting, setIsDrafting] = useState(false);
  const [emailDraft, setEmailDraft] = useState<string | null>(null);
  const [showDraft, setShowDraft] = useState(false);

  // Booking Confirmation Modal State
  const [showBookingModal, setShowBookingModal] = useState(false);


  const handleGenerateSummary = async () => {
      setIsSummaryLoading(true);
      setSummaryError(null);
      const result = await generateSubmissionSummary(submission);
      if (result.summary) {
          setSummary(result.summary);
          const updatedSubmissions = updateSubmissionSummary(submission.id, result.summary);
          onSubmissionsUpdate(updatedSubmissions);
      } else {
          setSummaryError(result.error);
      }
      setIsSummaryLoading(false);
  };

  const handleGenerateScore = async () => {
      setIsScoringLoading(true);
      const result = await generateLeadScore(submission);
      if (result.score !== null && result.reasoning) {
          setScore(result.score);
          setReasoning(result.reasoning);
          const updatedSubmissions = updateSubmissionScore(submission.id, result.score, result.reasoning);
          onSubmissionsUpdate(updatedSubmissions);
      }
      setIsScoringLoading(false);
  };

  const handleGenerateDraft = async () => {
      setIsDrafting(true);
      setShowDraft(true);
      const result = await generateEmailDraft(submission);
      if (result.draft) {
          setEmailDraft(result.draft);
      }
      setIsDrafting(false);
  };

  const dataEntries = Object.entries(data).map(([key, value]) => {
      const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      return { label, value };
  });

  return (
    <Card className="mb-6 animate-fade-in-up border-l-4 border-l-brand-gold">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-4 border-b pb-4 flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-brand-navy">{type}</h3>
             {score !== undefined && <ScoreBadge score={score} />}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Received: {submissionDate} | ID: {id}
          </p>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <StatusBadge status={status} />
          <select 
            value={status} 
            onChange={(e) => onStatusChange(id, e.target.value as SubmissionStatus)}
            className="select text-xs py-1 h-8 min-w-[120px]"
          >
            <option value={SubmissionStatus.Pending}>Pending</option>
            <option value={SubmissionStatus.Confirmed}>Confirmed</option>
            <option value={SubmissionStatus.Canceled}>Canceled</option>
          </select>
        </div>
      </div>
      
      {/* AI Intelligence Suite */}
      <div className="mt-4 bg-brand-off-white rounded-xl p-4 border border-gray-200">
         <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-brand-navy uppercase tracking-wider flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-brand-gold" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                Gemini 3 Pro Intelligence
            </h4>
         </div>

         {/* Action Buttons */}
         <div className="flex gap-2 mb-4 flex-wrap">
             {!summary && (
                <button onClick={handleGenerateSummary} disabled={isSummaryLoading} className="btn-secondary py-1 px-3 text-xs border border-gray-300 bg-white">
                    {isSummaryLoading ? 'Summarizing...' : 'Generate Summary'}
                </button>
             )}
             {score === undefined && (
                 <button onClick={handleGenerateScore} disabled={isScoringLoading} className="btn-secondary py-1 px-3 text-xs border border-gray-300 bg-white">
                     {isScoringLoading ? 'Scoring...' : 'Analyze Lead Value'}
                 </button>
             )}
             <button onClick={handleGenerateDraft} disabled={isDrafting} className="btn-secondary py-1 px-3 text-xs border border-gray-300 bg-white">
                  {isDrafting ? 'Drafting...' : 'Draft Email Response'}
             </button>
             {status === SubmissionStatus.Pending && (
                 <button
                     onClick={() => setShowBookingModal(true)}
                     className="btn-primary py-1 px-3 text-xs bg-gradient-to-r from-green-500 to-green-600 text-white font-bold border-0 hover:from-green-600 hover:to-green-700 shadow-md"
                 >
                     💳 Confirm Booking & Send Payment Link
                 </button>
             )}
         </div>

         <div className="space-y-3">
            {/* Summary Output */}
            {summaryError && <p className="text-xs text-red-600">{summaryError}</p>}
            {summary && (
                <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm">
                    <span className="text-xs font-bold text-gray-500 block mb-1">SUMMARY</span>
                    <p className="text-sm text-gray-700">{summary}</p>
                </div>
            )}

            {/* Score Output */}
            {reasoning && (
                <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm">
                     <span className="text-xs font-bold text-gray-500 block mb-1">LEAD ANALYSIS</span>
                     <p className="text-sm text-gray-700">{reasoning}</p>
                </div>
            )}

            {/* Email Draft Output */}
            {showDraft && (
                <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm animate-fade-in-up">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-gray-500">EMAIL DRAFT</span>
                        <button onClick={() => setShowDraft(false)} className="text-xs text-red-400 hover:text-red-600">Close</button>
                    </div>
                    {isDrafting ? (
                        <div className="animate-pulse h-24 bg-gray-100 rounded"></div>
                    ) : (
                        <textarea 
                            className="w-full text-sm p-2 border rounded-md bg-gray-50 h-40 focus:ring-2 focus:ring-brand-gold focus:outline-none" 
                            value={emailDraft || ''} 
                            onChange={(e) => setEmailDraft(e.target.value)}
                        />
                    )}
                    {!isDrafting && (
                        <button 
                            onClick={() => navigator.clipboard.writeText(emailDraft || '')}
                            className="mt-2 text-xs text-brand-navy font-bold hover:underline"
                        >
                            Copy to Clipboard
                        </button>
                    )}
                </div>
            )}
         </div>
      </div>

      {/* Data Section */}
      <div className="mt-6">
         <h4 className="text-md font-semibold text-gray-800 mb-3 px-2">Full Submission Details</h4>
         <dl className="rounded-lg border border-gray-200 overflow-hidden">
          {dataEntries.map(({ label, value }) => <DataRow key={label} label={label} value={value} />)}
         </dl>
      </div>

      {/* Booking Confirmation Modal */}
      <BookingConfirmationModal
        submission={submission}
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        onConfirm={() => {
          // Refresh submissions after confirmation
          onStatusChange(submission.id, SubmissionStatus.Confirmed);
        }}
      />
    </Card>
  );
};
