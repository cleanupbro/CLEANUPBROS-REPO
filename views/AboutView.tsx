import React from 'react';
import { NavigationProps } from '../types';
import { Card } from '../components/Card';

const AboutView: React.FC<NavigationProps> = ({ navigateTo }) => {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-bold text-brand-navy mb-6">
          About Clean Up Bros
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
          Sydney's most trusted cleaning service. Professional, reliable, and always on time.
        </p>
      </div>

      {/* Story Section */}
      <Card>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold text-brand-navy mb-4">Our Story</h2>
            <p className="text-gray-700 mb-4">
              Founded in Liverpool, Sydney, Clean Up Bros was born from a simple mission: to provide exceptional cleaning services that exceed expectations. What started as a small team has grown into Sydney's most trusted cleaning service.
            </p>
            <p className="text-gray-700 mb-4">
              We understand that your home or business is more than just a space—it's where life happens. That's why we treat every job with the care and attention it deserves.
            </p>
            <p className="text-gray-700">
              From residential homes to commercial offices, Airbnb turnovers to post-construction clean-ups, we've mastered the art of making spaces shine.
            </p>
          </div>
          <div className="h-80 bg-gradient-to-br from-brand-navy to-brand-gold rounded-2xl flex items-center justify-center">
            <div className="text-center text-white p-8">
              <div className="text-6xl mb-4">🧹</div>
              <p className="text-2xl font-bold">5+ Years</p>
              <p className="text-lg">Serving Sydney</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Values Section */}
      <div className="mt-16">
        <h2 className="text-4xl font-bold text-brand-navy text-center mb-12">Why Choose Us</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <div className="text-center">
              <div className="text-5xl mb-4">✨</div>
              <h3 className="text-2xl font-bold text-brand-navy mb-3">Quality Guaranteed</h3>
              <p className="text-gray-600">
                We don't just clean—we deliver perfection. 100% satisfaction guaranteed or we re-clean for free.
              </p>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <div className="text-5xl mb-4">⏰</div>
              <h3 className="text-2xl font-bold text-brand-navy mb-3">Always On Time</h3>
              <p className="text-gray-600">
                Punctuality matters. We arrive when we say we will and finish on schedule, every single time.
              </p>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <div className="text-5xl mb-4">💯</div>
              <h3 className="text-2xl font-bold text-brand-navy mb-3">Fully Insured</h3>
              <p className="text-gray-600">
                Your peace of mind matters. We're fully insured and trained to industry standards.
              </p>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <div className="text-5xl mb-4">🌱</div>
              <h3 className="text-2xl font-bold text-brand-navy mb-3">Eco-Friendly</h3>
              <p className="text-gray-600">
                We use environmentally friendly products that are safe for your family, pets, and the planet.
              </p>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <div className="text-5xl mb-4">👨‍👩‍👧‍👦</div>
              <h3 className="text-2xl font-bold text-brand-navy mb-3">Local Team</h3>
              <p className="text-gray-600">
                We're Sydney locals who understand our community. Supporting us means supporting local families.
              </p>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-brand-navy mb-3">Attention to Detail</h3>
              <p className="text-gray-600">
                We clean every corner, every surface, every time. No shortcuts, no compromises.
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Stats Section */}
      <div className="mt-16 bg-brand-navy text-white rounded-3xl p-12">
        <h2 className="text-4xl font-bold text-center mb-12">By The Numbers</h2>
        <div className="grid md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-5xl font-bold text-brand-gold mb-2">10,000+</div>
            <div className="text-xl">Jobs Completed</div>
          </div>
          <div>
            <div className="text-5xl font-bold text-brand-gold mb-2">4.9★</div>
            <div className="text-xl">Average Rating</div>
          </div>
          <div>
            <div className="text-5xl font-bold text-brand-gold mb-2">500+</div>
            <div className="text-xl">Happy Clients</div>
          </div>
          <div>
            <div className="text-5xl font-bold text-brand-gold mb-2">24/7</div>
            <div className="text-xl">Support Available</div>
          </div>
        </div>
      </div>

      {/* Service Areas */}
      <div className="mt-16">
        <h2 className="text-4xl font-bold text-brand-navy text-center mb-8">We Serve All of Sydney</h2>
        <Card>
          <div className="text-center">
            <p className="text-lg text-gray-700 mb-4">
              Based in Liverpool, we proudly serve Sydney-wide including:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-gray-600">
              <div>Liverpool</div>
              <div>Campbelltown</div>
              <div>Parramatta</div>
              <div>Bankstown</div>
              <div>Fairfield</div>
              <div>Camden</div>
              <div>Casula</div>
              <div>Moorebank</div>
              <div>Prestons</div>
              <div>CBD</div>
              <div>Inner West</div>
              <div>Eastern Suburbs</div>
            </div>
            <p className="text-sm text-gray-500 mt-6">
              Don't see your suburb? <button onClick={() => navigateTo('Contact')} className="text-brand-gold hover:underline font-semibold">Contact us</button> - we probably service your area!
            </p>
          </div>
        </Card>
      </div>

      {/* CTA Section */}
      <div className="mt-16 text-center">
        <h2 className="text-4xl font-bold text-brand-navy mb-6">Ready to Experience the Difference?</h2>
        <p className="text-xl text-gray-600 mb-8">Get a quote in 60 seconds or less</p>
        <button onClick={() => navigateTo('Landing')} className="btn-primary text-xl px-12 py-4">
          Get Your Free Quote
        </button>
      </div>
    </div>
  );
};

export default AboutView;
