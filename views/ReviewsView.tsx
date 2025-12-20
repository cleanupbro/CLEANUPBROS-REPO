import React from 'react';
import { NavigationProps } from '../types';
import { Card } from '../components/Card';
import { StarRating } from '../components/StarRating';

const ReviewsView: React.FC<NavigationProps> = ({ navigateTo }) => {
  const reviews = [
    {
      name: "Sarah M.",
      location: "Liverpool",
      rating: 5,
      service: "End of Lease Clean",
      date: "2 weeks ago",
      text: "Absolutely phenomenal service! The team did our end of lease clean and we got our full bond back. They were thorough, professional, and the place looked brand new. Highly recommend!",
      verified: true
    },
    {
      name: "Michael T.",
      location: "Campbelltown",
      rating: 5,
      service: "Commercial Office",
      date: "1 month ago",
      text: "We've been using Clean Up Bros for our office cleaning for 6 months now. Always on time, never miss a spot, and super professional. Our workplace has never looked better!",
      verified: true
    },
    {
      name: "Emma L.",
      location: "Parramatta",
      rating: 5,
      service: "Airbnb Turnover",
      date: "3 days ago",
      text: "As an Airbnb host, timing is everything. Clean Up Bros never lets me down. They're fast, efficient, and my guests always comment on how spotless the place is. Worth every penny!",
      verified: true
    },
    {
      name: "David K.",
      location: "Bankstown",
      rating: 5,
      service: "Deep Clean",
      date: "2 months ago",
      text: "Had them do a deep clean before my parents visited. They transformed my apartment! Even cleaned areas I forgot existed. The attention to detail was incredible.",
      verified: true
    },
    {
      name: "Jessica R.",
      location: "Camden",
      rating: 5,
      service: "Post-Construction",
      date: "1 week ago",
      text: "After our renovation, the house was a disaster. Clean Up Bros came in and made it look showroom ready. They removed all the dust, cleaned every surface, and even polished the windows. Amazing work!",
      verified: true
    },
    {
      name: "Tom W.",
      location: "Moorebank",
      rating: 5,
      service: "Regular Cleaning",
      date: "3 weeks ago",
      text: "Been using their bi-weekly service for a year now. It's like having a consistently clean home without any effort. The team is friendly, trustworthy, and does a fantastic job every time.",
      verified: true
    },
    {
      name: "Priya S.",
      location: "Fairfield",
      rating: 5,
      service: "Residential Clean",
      date: "1 month ago",
      text: "Very impressed! They worked around my schedule, arrived exactly on time, and cleaned every room to perfection. Even my teenage son noticed how clean his room was!",
      verified: true
    },
    {
      name: "James H.",
      location: "Prestons",
      rating: 5,
      service: "Office Clean",
      date: "2 weeks ago",
      text: "Clean Up Bros has been cleaning our medical centre for 3 months. They understand the importance of hygiene in healthcare and always go above and beyond. Couldn't ask for better service.",
      verified: true
    },
    {
      name: "Rachel B.",
      location: "Casula",
      rating: 5,
      service: "Spring Clean",
      date: "1 week ago",
      text: "Did a spring clean of our entire house including windows, carpets, and oven. The place sparkles! They even organized my pantry without me asking. So happy with the results!",
      verified: true
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Inspirational Quote Section */}
      <div className="text-center mb-12 py-16 px-4 bg-gradient-to-r from-brand-navy/5 to-brand-gold/5 rounded-3xl">
        <div className="max-w-4xl mx-auto">
          <svg className="w-16 h-16 text-brand-gold mx-auto mb-4 opacity-50" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
          </svg>
          <p className="text-2xl md:text-3xl font-light text-gray-700 italic leading-relaxed mb-6">
            "A clean space is not just about appearance—it's about creating an environment where life, business, and dreams can flourish."
          </p>
          <p className="text-lg text-brand-navy font-semibold">— Clean Up Bros Philosophy</p>
        </div>
      </div>

      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-bold text-brand-navy mb-6">
          Customer Reviews
        </h1>
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="flex gap-1">
            {[1,2,3,4,5].map(i => (
              <svg key={i} className="w-12 h-12 text-brand-gold fill-current" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
              </svg>
            ))}
          </div>
        </div>
        <p className="text-3xl font-bold text-brand-navy mb-2">4.9 out of 5</p>
        <p className="text-xl text-gray-600">Based on 127+ verified Google reviews</p>
      </div>

      {/* Trust Badges */}
      <div className="grid md:grid-cols-4 gap-6 mb-16">
        <Card>
          <div className="text-center">
            <div className="text-4xl mb-2">✅</div>
            <div className="font-bold text-brand-navy">Verified Reviews</div>
            <div className="text-sm text-gray-600">Real customers only</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-4xl mb-2">🏆</div>
            <div className="font-bold text-brand-navy">5-Star Service</div>
            <div className="text-sm text-gray-600">Consistently rated</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-4xl mb-2">💯</div>
            <div className="font-bold text-brand-navy">100% Satisfaction</div>
            <div className="text-sm text-gray-600">Guaranteed results</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-4xl mb-2">👥</div>
            <div className="font-bold text-brand-navy">500+ Clients</div>
            <div className="text-sm text-gray-600">Happy customers</div>
          </div>
        </Card>
      </div>

      {/* Reviews Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {reviews.map((review, index) => (
          <Card key={index}>
            <div className="flex flex-col h-full">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-bold text-brand-navy">{review.name}</div>
                  <div className="text-sm text-gray-500">{review.location}</div>
                </div>
                {review.verified && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-semibold">
                    ✓ Verified
                  </span>
                )}
              </div>

              <div className="flex gap-1 mb-2">
                {[1,2,3,4,5].map(i => (
                  <svg key={i} className="w-5 h-5 text-brand-gold fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                  </svg>
                ))}
              </div>

              <div className="text-sm font-semibold text-brand-gold mb-2">{review.service}</div>

              <p className="text-gray-700 mb-4 flex-grow">{review.text}</p>

              <div className="text-xs text-gray-400">{review.date}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Leave Review CTA */}
      <div className="bg-gradient-to-r from-brand-navy to-brand-gold text-white rounded-3xl p-12 text-center mb-16">
        <h2 className="text-4xl font-bold mb-4">Had a Great Experience?</h2>
        <p className="text-xl mb-8">Share your feedback and help others discover our service</p>
        <button onClick={() => navigateTo('ClientFeedback')} className="bg-white text-brand-navy px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105">
          Leave a Review
        </button>
      </div>

      {/* What Customers Love */}
      <div className="mb-16">
        <h2 className="text-4xl font-bold text-brand-navy text-center mb-12">What Our Customers Love</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <div className="text-center">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-brand-navy mb-3">Speed & Efficiency</h3>
              <p className="text-gray-600">
                "They get the job done fast without compromising quality"
              </p>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <div className="text-5xl mb-4">🤝</div>
              <h3 className="text-xl font-bold text-brand-navy mb-3">Professional Team</h3>
              <p className="text-gray-600">
                "Friendly, respectful, and always professional"
              </p>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <div className="text-5xl mb-4">💎</div>
              <h3 className="text-xl font-bold text-brand-navy mb-3">Attention to Detail</h3>
              <p className="text-gray-600">
                "They clean areas I didn't even think of"
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Get Quote CTA */}
      <div className="text-center">
        <h2 className="text-4xl font-bold text-brand-navy mb-6">Join Our Happy Customers</h2>
        <p className="text-xl text-gray-600 mb-8">Experience 5-star cleaning service today</p>
        <button onClick={() => navigateTo('Landing')} className="btn-primary text-xl px-12 py-4">
          Get Your Free Quote
        </button>
      </div>
    </div>
  );
};

export default ReviewsView;
