import React from 'react';
import { NavigationProps } from '../types';

const AboutView: React.FC<NavigationProps> = ({ navigateTo }) => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="hero-unit min-h-[650px] md:min-h-[750px] bg-black text-white mb-0 relative group overflow-hidden">
        <div className="hero-unit-text flex flex-col items-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 leading-tight text-center drop-shadow-2xl text-white">
            About Clean Up Bros
          </h1>
          <p className="text-2xl md:text-3xl font-medium mb-2 text-center drop-shadow-lg max-w-4xl">
            Sydney's most trusted cleaning service
          </p>
          <p className="text-lg md:text-xl text-white/90 text-center drop-shadow-md max-w-3xl">
            Professional, reliable, and always on time
          </p>
        </div>
        <div
          className="absolute inset-0 bg-cover bg-center animate-slow-zoom"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1527515862127-a4fc05baf7a5?w=1920&q=80)`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
      </div>

      {/* Our Story Section */}
      <div className="bg-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#1D1D1F] mb-6">Our Story</h2>
              <p className="text-lg text-[#86868b] mb-6 leading-relaxed">
                Founded in Liverpool, Sydney, Clean Up Bros was born from a simple mission: to provide exceptional cleaning services that exceed expectations. What started as a small team has grown into Sydney's most trusted cleaning service.
              </p>
              <p className="text-lg text-[#86868b] mb-6 leading-relaxed">
                We understand that your home or business is more than just a space—it's where life happens. That's why we treat every job with the care and attention it deserves.
              </p>
              <p className="text-lg text-[#86868b] leading-relaxed">
                From residential homes to commercial offices, Airbnb turnovers to post-construction clean-ups, we've mastered the art of making spaces shine.
              </p>
            </div>
            <div className="apple-card bg-gradient-to-br from-[#1D1D1F] to-gray-800 rounded-3xl flex items-center justify-center transform hover:scale-105 transition-all duration-300 shadow-2xl" style={{ minHeight: '400px' }}>
              <div className="text-center text-white p-12">
                <div className="text-7xl md:text-8xl mb-6 animate-float">🧹</div>
                <p className="text-4xl md:text-5xl font-bold mb-2">5+ Years</p>
                <p className="text-xl md:text-2xl text-white/80">Serving Sydney</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="bg-gradient-to-br from-[#F5F5F7] to-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-[#1D1D1F] text-center mb-16">
            Why Choose Us
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="apple-card p-8 text-center transform hover:scale-105 transition-all duration-300">
              <div className="text-6xl mb-4">✨</div>
              <h3 className="text-2xl font-bold text-[#1D1D1F] mb-3">Quality Guaranteed</h3>
              <p className="text-[#86868b] leading-relaxed">
                We don't just clean—we deliver perfection. 100% satisfaction guaranteed or we re-clean for free.
              </p>
            </div>

            <div className="apple-card p-8 text-center transform hover:scale-105 transition-all duration-300">
              <div className="text-6xl mb-4">⏰</div>
              <h3 className="text-2xl font-bold text-[#1D1D1F] mb-3">Always On Time</h3>
              <p className="text-[#86868b] leading-relaxed">
                Punctuality matters. We arrive when we say we will and finish on schedule, every single time.
              </p>
            </div>

            <div className="apple-card p-8 text-center transform hover:scale-105 transition-all duration-300">
              <div className="text-6xl mb-4">💯</div>
              <h3 className="text-2xl font-bold text-[#1D1D1F] mb-3">Fully Insured</h3>
              <p className="text-[#86868b] leading-relaxed">
                Your peace of mind matters. We're fully insured and trained to industry standards.
              </p>
            </div>

            <div className="apple-card p-8 text-center transform hover:scale-105 transition-all duration-300">
              <div className="text-6xl mb-4">🌱</div>
              <h3 className="text-2xl font-bold text-[#1D1D1F] mb-3">Eco-Friendly</h3>
              <p className="text-[#86868b] leading-relaxed">
                We use environmentally friendly products that are safe for your family, pets, and the planet.
              </p>
            </div>

            <div className="apple-card p-8 text-center transform hover:scale-105 transition-all duration-300">
              <div className="text-6xl mb-4">👨‍👩‍👧‍👦</div>
              <h3 className="text-2xl font-bold text-[#1D1D1F] mb-3">Local Team</h3>
              <p className="text-[#86868b] leading-relaxed">
                We're Sydney locals who understand our community. Supporting us means supporting local families.
              </p>
            </div>

            <div className="apple-card p-8 text-center transform hover:scale-105 transition-all duration-300">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-[#1D1D1F] mb-3">Attention to Detail</h3>
              <p className="text-[#86868b] leading-relaxed">
                We clean every corner, every surface, every time. No shortcuts, no compromises.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-br from-[#1D1D1F] to-gray-900 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">By The Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="transform hover:scale-110 transition-all duration-300">
              <div className="text-5xl md:text-6xl font-bold text-brand-gold mb-3">10,000+</div>
              <div className="text-lg md:text-xl text-white/90">Jobs Completed</div>
            </div>
            <div className="transform hover:scale-110 transition-all duration-300">
              <div className="text-5xl md:text-6xl font-bold text-brand-gold mb-3">4.9★</div>
              <div className="text-lg md:text-xl text-white/90">Average Rating</div>
            </div>
            <div className="transform hover:scale-110 transition-all duration-300">
              <div className="text-5xl md:text-6xl font-bold text-brand-gold mb-3">500+</div>
              <div className="text-lg md:text-xl text-white/90">Happy Clients</div>
            </div>
            <div className="transform hover:scale-110 transition-all duration-300">
              <div className="text-5xl md:text-6xl font-bold text-brand-gold mb-3">24/7</div>
              <div className="text-lg md:text-xl text-white/90">Support Available</div>
            </div>
          </div>
        </div>
      </div>

      {/* Service Areas Section */}
      <div className="bg-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-[#1D1D1F] text-center mb-12">
            We Serve All of Sydney
          </h2>
          <div className="apple-card p-12">
            <div className="text-center">
              <p className="text-xl text-[#86868b] mb-8">
                Based in Liverpool, we proudly serve Sydney-wide including:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 text-lg text-[#1D1D1F] font-medium mb-8">
                <div className="hover:text-[#0071e3] transition-colors">Liverpool</div>
                <div className="hover:text-[#0071e3] transition-colors">Campbelltown</div>
                <div className="hover:text-[#0071e3] transition-colors">Parramatta</div>
                <div className="hover:text-[#0071e3] transition-colors">Bankstown</div>
                <div className="hover:text-[#0071e3] transition-colors">Fairfield</div>
                <div className="hover:text-[#0071e3] transition-colors">Camden</div>
                <div className="hover:text-[#0071e3] transition-colors">Casula</div>
                <div className="hover:text-[#0071e3] transition-colors">Moorebank</div>
                <div className="hover:text-[#0071e3] transition-colors">Prestons</div>
                <div className="hover:text-[#0071e3] transition-colors">CBD</div>
                <div className="hover:text-[#0071e3] transition-colors">Inner West</div>
                <div className="hover:text-[#0071e3] transition-colors">Eastern Suburbs</div>
              </div>
              <p className="text-base text-[#86868b]">
                Don't see your suburb?{' '}
                <button
                  onClick={() => navigateTo('Contact')}
                  className="text-[#0071e3] hover:underline font-semibold"
                >
                  Contact us
                </button>
                {' '}- we probably service your area!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-[#F5F5F7] to-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-[#1D1D1F] mb-6">
            Ready to Experience the Difference?
          </h2>
          <p className="text-xl md:text-2xl text-[#86868b] mb-10">
            Get a quote in 60 seconds or less
          </p>
          <button
            onClick={() => navigateTo('Landing')}
            className="btn-primary text-xl px-12 py-4 shadow-xl hover:shadow-2xl"
          >
            Get Your Free Quote
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutView;
