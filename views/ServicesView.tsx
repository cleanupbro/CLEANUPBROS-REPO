import React from 'react';
import { NavigationProps, ServiceType } from '../types';
import { Card } from '../components/Card';

const ServicesView: React.FC<NavigationProps> = ({ navigateTo }) => {
  const services = [
    {
      title: "Residential Cleaning",
      icon: "🏠",
      description: "Professional home cleaning for houses, apartments, and townhouses across Sydney",
      features: [
        "General cleaning & maintenance",
        "Deep cleaning services",
        "End of lease / bond cleaning",
        "Post-construction cleanup",
        "Spring cleaning",
        "One-time or recurring schedules"
      ],
      startingPrice: "$150",
      action: () => navigateTo(ServiceType.Residential)
    },
    {
      title: "Commercial Cleaning",
      icon: "🏢",
      description: "Keep your workspace spotless with our professional office and commercial cleaning",
      features: [
        "Office buildings & co-working spaces",
        "Retail stores & showrooms",
        "Medical centres & clinics",
        "Gyms & fitness centres",
        "Warehouses & industrial spaces",
        "Customized cleaning schedules"
      ],
      startingPrice: "$200",
      action: () => navigateTo(ServiceType.Commercial)
    },
    {
      title: "Airbnb Turnover",
      icon: "🏨",
      description: "Fast, reliable turnover cleaning for short-term rental hosts",
      features: [
        "Same-day turnovers available",
        "Linen change & restocking",
        "Quality inspection reports",
        "Guest-ready standard",
        "Damage & maintenance reporting",
        "Flexible scheduling 7 days a week"
      ],
      startingPrice: "$120",
      action: () => navigateTo(ServiceType.Airbnb)
    }
  ];

  const addOnServices = [
    {
      title: "Carpet Steam Cleaning",
      icon: "🧼",
      description: "Professional steam cleaning to remove stains, odors, and allergens",
      price: "From $80"
    },
    {
      title: "Window Cleaning",
      icon: "🪟",
      description: "Streak-free crystal clear windows inside and out",
      price: "From $60"
    },
    {
      title: "Oven & Kitchen Deep Clean",
      icon: "🔥",
      description: "Heavy-duty cleaning for ovens, range hoods, and appliances",
      price: "From $90"
    },
    {
      title: "Pressure Washing",
      icon: "💦",
      description: "Driveways, patios, decks, and exterior surfaces",
      price: "From $150"
    },
    {
      title: "Fridge & Freezer Clean",
      icon: "❄️",
      description: "Complete sanitization and organization",
      price: "From $50"
    },
    {
      title: "Wall Washing",
      icon: "🧽",
      description: "Remove marks, scuffs, and grime from walls",
      price: "From $100"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-bold text-brand-navy mb-6">
          Our Services
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Professional cleaning solutions for every need. From homes to offices, we've got you covered.
        </p>
      </div>

      {/* Main Services */}
      <div className="mb-20">
        <h2 className="text-4xl font-bold text-brand-navy text-center mb-12">Core Services</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index}>
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">{service.icon}</div>
                <h3 className="text-2xl font-bold text-brand-navy mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
              </div>

              <div className="space-y-2 mb-6">
                {service.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-brand-gold">✓</span>
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 mt-auto">
                <div className="text-center mb-4">
                  <span className="text-sm text-gray-500">Starting from</span>
                  <div className="text-3xl font-bold text-brand-navy">{service.startingPrice}</div>
                </div>
                <button onClick={service.action} className="btn-primary w-full">
                  Get Quote
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Add-On Services */}
      <div className="mb-20">
        <h2 className="text-4xl font-bold text-brand-navy text-center mb-4">Add-On Services</h2>
        <p className="text-center text-gray-600 mb-12">Enhance your cleaning with these specialized services</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {addOnServices.map((addon, index) => (
            <Card key={index}>
              <div className="flex items-start gap-4">
                <div className="text-4xl">{addon.icon}</div>
                <div className="flex-1">
                  <h3 className="font-bold text-brand-navy mb-1">{addon.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{addon.description}</p>
                  <p className="text-brand-gold font-semibold">{addon.price}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Process Section */}
      <div className="mb-20">
        <h2 className="text-4xl font-bold text-brand-navy text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-brand-gold text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
            <h3 className="font-bold text-brand-navy mb-2">Get a Quote</h3>
            <p className="text-gray-600 text-sm">Fill out our quick form or call us for an instant estimate</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-brand-gold text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
            <h3 className="font-bold text-brand-navy mb-2">Schedule Service</h3>
            <p className="text-gray-600 text-sm">Choose a date and time that works for you</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-brand-gold text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
            <h3 className="font-bold text-brand-navy mb-2">We Clean</h3>
            <p className="text-gray-600 text-sm">Our professional team arrives and gets to work</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-brand-gold text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">4</div>
            <h3 className="font-bold text-brand-navy mb-2">Enjoy</h3>
            <p className="text-gray-600 text-sm">Relax in your spotless space!</p>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="bg-gradient-to-r from-brand-navy to-brand-gold text-white rounded-3xl p-12 mb-20">
        <h2 className="text-4xl font-bold text-center mb-12">Why Choose Clean Up Bros?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-5xl mb-3">✨</div>
            <h3 className="font-bold text-xl mb-2">Quality Guaranteed</h3>
            <p className="text-sm opacity-90">100% satisfaction or we re-clean free</p>
          </div>

          <div className="text-center">
            <div className="text-5xl mb-3">💯</div>
            <h3 className="font-bold text-xl mb-2">Fully Insured</h3>
            <p className="text-sm opacity-90">Your property is protected</p>
          </div>

          <div className="text-center">
            <div className="text-5xl mb-3">⏰</div>
            <h3 className="font-bold text-xl mb-2">Punctual</h3>
            <p className="text-sm opacity-90">Always on time, every time</p>
          </div>

          <div className="text-center">
            <div className="text-5xl mb-3">🌱</div>
            <h3 className="font-bold text-xl mb-2">Eco-Friendly</h3>
            <p className="text-sm opacity-90">Safe products for your family</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center">
        <h2 className="text-4xl font-bold text-brand-navy mb-6">Ready to Get Started?</h2>
        <p className="text-xl text-gray-600 mb-8">Get your free quote in less than 60 seconds</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={() => navigateTo('Landing')} className="btn-primary text-xl px-12 py-4">
            Get Free Quote
          </button>
          <button onClick={() => navigateTo('Contact')} className="btn-secondary text-xl px-12 py-4">
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServicesView;
