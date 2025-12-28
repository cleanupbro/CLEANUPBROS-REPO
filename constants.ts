
import { ServiceType } from './types';

export const WEBHOOK_URLS = {
  // Main ROI Workflow paths (from N8N workflow 49xi6gSdDwMlcHmj)
  [ServiceType.Residential]: 'https://nioctibinu.online/webhook/98d35453-4f18-40ca-bdfa-ba3aaa02646c',
  [ServiceType.Commercial]: 'https://nioctibinu.online/webhook/bb5fdb61-31d7-4001-9dd1-44ef7dc64d32',
  [ServiceType.Airbnb]: 'https://nioctibinu.online/webhook/5d3f6ff4-5f08-4ccf-9b78-03b62ae6b72f',
  [ServiceType.Jobs]: 'https://nioctibinu.online/webhook/67f764f2-adff-481e-aa49-fd3de1feecde',
  [ServiceType.ClientFeedback]: 'https://nioctibinu.online/webhook/client-feedback',
  LANDING_LEAD: 'https://nioctibinu.online/webhook/8fe0b2c9-3d5b-44f5-84ff-0d0ef896e1fa',

  // Admin Booking Confirmation & Payment
  BOOKING_CONFIRMATION: 'https://nioctibinu.online/webhook/booking-confirmation',
  SQUARE_PAYMENT_LINK: 'https://nioctibinu.online/webhook/create-payment-link',

  // AI & SMS Features
  AI_CHAT: 'https://nioctibinu.online/webhook/cub-ai-chat',
  SMS_FOLLOWUP: 'https://nioctibinu.online/webhook/cub-sms-followup',
};

export const SUCCESS_MESSAGES = {
  [ServiceType.Residential]: "Quote Request Received! We've sent the details to your email.",
  [ServiceType.Commercial]: "Request Received. Our team will contact you within 24 hours.",
  [ServiceType.Airbnb]: "Turnover Request Received! We'll be in touch shortly.",
  [ServiceType.Jobs]: "Application Submitted. Good luck!",
  [ServiceType.ClientFeedback]: "Feedback Received. Thank you!",
};
