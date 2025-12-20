
import { ServiceType } from './types';

export const WEBHOOK_URLS = {
  [ServiceType.Residential]: 'https://nioctibinu.online/webhook/98d35453-4f18-40ca-bdfa-ba3aaa02646c',
  [ServiceType.Commercial]: 'https://nioctibinu.online/webhook/bb12f45e-21f4-4e43-af36-5dbed46fe072',
  [ServiceType.Airbnb]: 'https://nioctibinu.online/webhook/a12b53e8-2391-4c82-b611-47fa4032c235',
  [ServiceType.Jobs]: 'https://nioctibinu.online/webhook/8da4395f-48f7-4d56-b500-3c43e2077ac6',
  [ServiceType.ClientFeedback]: 'https://nioctibinu.online/webhook/22624a36-cd07-4b6b-9334-3909dd3cff9f',
  LANDING_LEAD: 'https://nioctibinu.online/webhook/c5dc6960-15ee-4ccb-9cac-3bf8ffcb7bda',

  // Admin Booking Confirmation & Payment
  BOOKING_CONFIRMATION: 'https://nioctibinu.online/webhook/booking-confirmation',
  SQUARE_PAYMENT_LINK: 'https://nioctibinu.online/webhook/create-payment-link',
};

export const SUCCESS_MESSAGES = {
  [ServiceType.Residential]: "Quote Request Received! We've sent the details to your email.",
  [ServiceType.Commercial]: "Request Received. Our team will contact you within 24 hours.",
  [ServiceType.Airbnb]: "Turnover Request Received! We'll be in touch shortly.",
  [ServiceType.Jobs]: "Application Submitted. Good luck!",
  [ServiceType.ClientFeedback]: "Feedback Received. Thank you!",
};
