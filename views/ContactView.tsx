import React, { useState } from 'react';
import { NavigationProps, ServiceType } from '../types';
import { Card } from '../components/Card';

const ContactView: React.FC<NavigationProps> = ({ navigateTo }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send to a contact webhook
    console.log('Contact form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 3000);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-bold text-brand-navy mb-6">
          Get In Touch
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Have a question? Need a quote? We're here to help!
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 mb-16">
        {/* Contact Form */}
        <Card>
          <h2 className="text-3xl font-bold text-brand-navy mb-6">Send Us a Message</h2>

          {submitted ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-2xl font-bold text-brand-navy mb-2">Message Sent!</h3>
              <p className="text-gray-600">We'll get back to you within 24 hours</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="input"
                  placeholder="John Smith"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="input"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="input"
                  placeholder="0400 123 456"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                <select
                  required
                  value={formData.subject}
                  onChange={e => setFormData({...formData, subject: e.target.value})}
                  className="select"
                >
                  <option value="">Select a subject...</option>
                  <option>General Inquiry</option>
                  <option>Get a Quote</option>
                  <option>Service Question</option>
                  <option>Booking Assistance</option>
                  <option>Feedback</option>
                  <option>Partnership Opportunity</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                <textarea
                  required
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  rows={5}
                  className="input"
                  placeholder="Tell us how we can help..."
                ></textarea>
              </div>

              <button type="submit" className="btn-primary w-full text-lg">
                Send Message
              </button>
            </form>
          )}
        </Card>

        {/* Contact Info */}
        <div className="space-y-6">
          <Card>
            <div className="flex items-start gap-4">
              <div className="text-4xl">📞</div>
              <div>
                <h3 className="text-xl font-bold text-brand-navy mb-2">Phone</h3>
                <a href="tel:+61406764585" className="text-brand-gold hover:underline text-lg">
                  +61 406 764 585
                </a>
                <p className="text-sm text-gray-600 mt-1">Mon-Sun: 7am - 6pm</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-start gap-4">
              <div className="text-4xl">✉️</div>
              <div>
                <h3 className="text-xl font-bold text-brand-navy mb-2">Email</h3>
                <a href="mailto:cleanupbros.au@gmail.com" className="text-brand-gold hover:underline text-lg">
                  cleanupbros.au@gmail.com
                </a>
                <p className="text-sm text-gray-600 mt-1">We reply within 24 hours</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-start gap-4">
              <div className="text-4xl">📍</div>
              <div>
                <h3 className="text-xl font-bold text-brand-navy mb-2">Location</h3>
                <p className="text-lg">Liverpool, Sydney NSW 2170</p>
                <p className="text-sm text-gray-600 mt-1">Serving all Sydney suburbs</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-start gap-4">
              <div className="text-4xl">⏰</div>
              <div>
                <h3 className="text-xl font-bold text-brand-navy mb-2">Business Hours</h3>
                <div className="space-y-1 text-gray-700">
                  <div>Monday - Friday: 7am - 6pm</div>
                  <div>Saturday: 8am - 5pm</div>
                  <div>Sunday: 9am - 4pm</div>
                </div>
                <p className="text-sm text-brand-gold mt-2 font-semibold">Emergency cleans available 24/7</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Quick Links */}
      <div className="mb-16">
        <h2 className="text-4xl font-bold text-brand-navy text-center mb-12">Quick Actions</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <div className="text-center">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-2xl font-bold text-brand-navy mb-3">Get a Quote</h3>
              <p className="text-gray-600 mb-4">Instant price estimate in 60 seconds</p>
              <button onClick={() => navigateTo('Landing')} className="btn-primary w-full">
                Get Quote
              </button>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <div className="text-5xl mb-4">📅</div>
              <h3 className="text-2xl font-bold text-brand-navy mb-3">Book a Service</h3>
              <p className="text-gray-600 mb-4">Schedule your cleaning today</p>
              <button onClick={() => navigateTo(ServiceType.Residential)} className="btn-primary w-full">
                Book Now
              </button>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <div className="text-5xl mb-4">❓</div>
              <h3 className="text-2xl font-bold text-brand-navy mb-3">Learn More</h3>
              <p className="text-gray-600 mb-4">About our services and process</p>
              <button onClick={() => navigateTo('About')} className="btn-primary w-full">
                About Us
              </button>
            </div>
          </Card>
        </div>
      </div>

      {/* FAQ Section */}
      <Card>
        <h2 className="text-3xl font-bold text-brand-navy mb-8 text-center">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-bold text-lg text-brand-navy mb-2">How quickly can you respond?</h3>
            <p className="text-gray-700">We typically respond to inquiries within 2-4 hours during business hours. For urgent requests, call us directly at +61 406 764 585.</p>
          </div>

          <div>
            <h3 className="font-bold text-lg text-brand-navy mb-2">Do you provide quotes over the phone?</h3>
            <p className="text-gray-700">Yes! For straightforward jobs, we can provide an estimate over the phone. For more complex projects, we may arrange a free on-site inspection.</p>
          </div>

          <div>
            <h3 className="font-bold text-lg text-brand-navy mb-2">What areas do you service?</h3>
            <p className="text-gray-700">We service all Sydney suburbs including Liverpool, Campbelltown, Parramatta, Bankstown, CBD, and surrounding areas. Contact us to confirm service in your suburb.</p>
          </div>

          <div>
            <h3 className="font-bold text-lg text-brand-navy mb-2">Are you available for emergency cleans?</h3>
            <p className="text-gray-700">Yes! We offer 24/7 emergency cleaning services for urgent situations. Additional fees may apply for after-hours service.</p>
          </div>
        </div>
      </Card>

      {/* Map placeholder */}
      <div className="mt-16 bg-gray-200 rounded-3xl h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🗺️</div>
          <p className="text-xl text-gray-600 font-semibold">Serving All of Sydney</p>
          <p className="text-gray-500">Based in Liverpool NSW</p>
        </div>
      </div>
    </div>
  );
};

export default ContactView;
