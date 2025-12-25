
import React, { useState, useCallback, useEffect, lazy, Suspense } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ServiceType, ViewType } from './types';
import { RetryBanner } from './components/RetryBanner';
import { ToastProvider } from './contexts/ToastContext';

// Lazy load views for better performance
const LandingView = lazy(() => import('./views/LandingView'));
const ResidentialQuoteView = lazy(() => import('./views/ResidentialQuoteView'));
const CommercialQuoteView = lazy(() => import('./views/CommercialQuoteView'));
const AirbnbQuoteView = lazy(() => import('./views/AirbnbQuoteView'));
const JobApplicationView = lazy(() => import('./views/JobApplicationView'));
const ClientFeedbackView = lazy(() => import('./views/ClientFeedbackView'));
const SubmissionSuccessView = lazy(() => import('./views/SubmissionSuccessView'));
const AdminLoginView = lazy(() => import('./views/AdminLoginView'));
const AdminDashboardView = lazy(() => import('./views/AdminDashboardView'));
const AboutView = lazy(() => import('./views/AboutView'));
const ReviewsView = lazy(() => import('./views/ReviewsView'));
const ContactView = lazy(() => import('./views/ContactView'));
const ServicesView = lazy(() => import('./views/ServicesView'));
const CleanUpCardView = lazy(() => import('./views/CleanUpCardView'));
const GiftCardPurchaseView = lazy(() => import('./views/GiftCardPurchaseView'));
const AdminGiftCardsView = lazy(() => import('./views/AdminGiftCardsView'));
const AirbnbContractView = lazy(() => import('./views/AirbnbContractView'));
const BasicContractView = lazy(() => import('./views/BasicContractView'));
const CommercialInvoiceView = lazy(() => import('./views/CommercialInvoiceView'));
const AdminContractsView = lazy(() => import('./views/AdminContractsView'));
const CheckBalanceView = lazy(() => import('./views/CheckBalanceView'));

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center">
      <svg className="animate-spin h-12 w-12 text-brand-gold mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p className="text-gray-600 font-medium">Loading...</p>
    </div>
  </div>
);

const ADMIN_SESSION_KEY = 'cleanUpBrosAdminSession';
const ADMIN_EMAIL_KEY = 'cleanUpBrosAdminEmail';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('Landing');
  const [successMessage, setSuccessMessage] = useState('');
  const [initialFormData, setInitialFormData] = useState<any | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  const handleSubmissionFail = () => {
    setRetryKey(k => k + 1);
  };

  useEffect(() => {
    if (localStorage.getItem(ADMIN_SESSION_KEY) === 'true') {
      setIsAdminLoggedIn(true);
      setAdminEmail(localStorage.getItem(ADMIN_EMAIL_KEY));
    }
  }, []);

  const handleLoginSuccess = (email: string) => {
    localStorage.setItem(ADMIN_SESSION_KEY, 'true');
    localStorage.setItem(ADMIN_EMAIL_KEY, email);
    setIsAdminLoggedIn(true);
    setAdminEmail(email);
    navigateTo('AdminDashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    localStorage.removeItem(ADMIN_EMAIL_KEY);
    setIsAdminLoggedIn(false);
    setAdminEmail(null);
    navigateTo('Landing');
  };

  const navigateTo = useCallback((view: ViewType, message?: string, initialState?: any) => {
    setCurrentView(view);
    if (message) {
      setSuccessMessage(message);
    }
    if (initialState) {
        setInitialFormData(initialState);
    } else {
        setInitialFormData(null);
    }
    window.scrollTo(0, 0);
  }, []);

  const renderView = () => {
    if (currentView === 'AdminLogin') {
        return <AdminLoginView onLoginSuccess={handleLoginSuccess} />;
    }
    if (currentView === 'AdminDashboard') {
        if (isAdminLoggedIn && adminEmail) {
            return <AdminDashboardView onLogout={handleLogout} adminEmail={adminEmail} navigateTo={navigateTo} />;
        }
        return <AdminLoginView onLoginSuccess={handleLoginSuccess} />;
    }
    
    switch (currentView) {
      case ServiceType.Residential:
        return <ResidentialQuoteView navigateTo={navigateTo} initialData={initialFormData} onSubmissionFail={handleSubmissionFail} />;
      case ServiceType.Commercial:
        return <CommercialQuoteView navigateTo={navigateTo} onSubmissionFail={handleSubmissionFail} />;
      case ServiceType.Airbnb:
        return <AirbnbQuoteView navigateTo={navigateTo} onSubmissionFail={handleSubmissionFail} />;
      case ServiceType.Jobs:
        return <JobApplicationView navigateTo={navigateTo} onSubmissionFail={handleSubmissionFail} />;
      case 'ClientFeedback':
        return <ClientFeedbackView navigateTo={navigateTo} onSubmissionFail={handleSubmissionFail} />;
      case 'Success':
        // Pass the reference ID if it exists in initialFormData (used as state carrier here)
        return <SubmissionSuccessView message={successMessage} navigateTo={navigateTo} referenceId={initialFormData?.referenceId} />;
      case 'About':
        return <AboutView navigateTo={navigateTo} />;
      case 'Reviews':
        return <ReviewsView navigateTo={navigateTo} />;
      case 'Contact':
        return <ContactView navigateTo={navigateTo} />;
      case 'Services':
        return <ServicesView navigateTo={navigateTo} />;
      case 'CleanUpCard':
        return <CleanUpCardView navigateTo={navigateTo} />;
      case 'GiftCardPurchase':
        return <GiftCardPurchaseView navigateTo={navigateTo} />;
      case 'CheckBalance':
        return <CheckBalanceView navigateTo={navigateTo} />;
      case 'AdminGiftCards':
        if (isAdminLoggedIn && adminEmail) {
          return <AdminGiftCardsView />;
        }
        return <AdminLoginView onLoginSuccess={handleLoginSuccess} />;
      case 'AirbnbContract':
        if (isAdminLoggedIn && adminEmail) {
          return <AirbnbContractView navigateTo={navigateTo} />;
        }
        return <AdminLoginView onLoginSuccess={handleLoginSuccess} />;
      case 'BasicContract':
        if (isAdminLoggedIn && adminEmail) {
          return <BasicContractView navigateTo={navigateTo} />;
        }
        return <AdminLoginView onLoginSuccess={handleLoginSuccess} />;
      case 'CommercialInvoice':
        if (isAdminLoggedIn && adminEmail) {
          return <CommercialInvoiceView navigateTo={navigateTo} />;
        }
        return <AdminLoginView onLoginSuccess={handleLoginSuccess} />;
      case 'AdminContracts':
        if (isAdminLoggedIn && adminEmail) {
          return <AdminContractsView navigateTo={navigateTo} />;
        }
        return <AdminLoginView onLoginSuccess={handleLoginSuccess} />;
      case 'Landing':
      default:
        return <LandingView navigateTo={navigateTo} onSubmissionFail={handleSubmissionFail} />;
    }
  };

  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col font-sans antialiased">
        <Header navigateTo={navigateTo} isAdminLoggedIn={isAdminLoggedIn} onLogout={handleLogout} />
        <main className="flex-grow w-full pt-[48px]">
          <div className="container mx-auto px-4 py-8">
              <RetryBanner key={retryKey} />
              <Suspense fallback={<LoadingSpinner />}>
                {renderView()}
              </Suspense>
          </div>
        </main>
        <Footer navigateTo={navigateTo} />
      </div>
    </ToastProvider>
  );
};

export default App;
