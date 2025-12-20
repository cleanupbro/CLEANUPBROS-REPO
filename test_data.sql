-- TEST DATA FOR CLEAN UP BROS
-- Run this in Supabase SQL Editor to create sample submissions

-- Insert test residential cleaning quote
INSERT INTO submissions (id, created_at, type, status, data, summary, lead_score, lead_reasoning)
VALUES (
  'TEST-RES-001',
  NOW() - INTERVAL '2 hours',
  'Residential Cleaning',
  'Pending',
  '{
    "fullName": "Sarah Johnson",
    "email": "sarah.johnson@example.com",
    "phone": "0412 345 678",
    "suburb": "Liverpool",
    "propertyType": "House",
    "bedrooms": 3,
    "bathrooms": 2,
    "serviceType": "Deep Clean",
    "condition": "Standard",
    "frequency": "One-time",
    "addOns": ["Carpet Cleaning", "Window Cleaning"],
    "preferredDate": "2025-12-25",
    "preferredTime": "Morning (8am-12pm)",
    "specialNotes": "Please use eco-friendly products. Have two small dogs.",
    "aiEstimate": {
      "estimatedPrice": 180,
      "breakdown": "3BR/2BA Deep Clean + Carpet + Windows",
      "confidence": "high"
    }
  }'::jsonb,
  'High-value residential deep clean request from Liverpool. Customer wants eco-friendly products and has pets. Excellent lead - property size and add-ons indicate good revenue potential.',
  85,
  'SCORE: 85/100 (HOT LEAD)\n\nPositive Factors:\n- Deep clean service (higher value)\n- Multiple add-ons (carpet + windows)\n- Clear date preference\n- Detailed special notes\n- Liverpool location (service area)\n\nAction: Call within 2 hours. High conversion probability.'
);

-- Insert test commercial cleaning quote
INSERT INTO submissions (id, created_at, type, status, data, summary, lead_score, lead_reasoning)
VALUES (
  'TEST-COM-001',
  NOW() - INTERVAL '4 hours',
  'Commercial Cleaning',
  'Pending',
  '{
    "companyName": "Liverpool Medical Centre",
    "contactName": "Dr. Michael Chen",
    "email": "michael.chen@liverpoolmedical.com.au",
    "phone": "02 9602 1234",
    "facilityType": "Medical Centre",
    "squareMeters": 350,
    "cleaningFrequency": "Daily",
    "compliance": ["COVID-19 Protocols", "Medical Grade Cleaning"],
    "contractTerm": "12 Months",
    "preferredStartDate": "2026-01-15",
    "specialRequirements": "Need medical-grade disinfection. NDIS compliant cleaning required.",
    "aiEstimate": {
      "estimatedPrice": 2800,
      "monthly": true,
      "breakdown": "350sqm medical facility, daily cleaning, 12-month contract",
      "confidence": "high"
    }
  }'::jsonb,
  'Excellent commercial opportunity - medical centre requires daily cleaning with specialized protocols. 12-month contract worth $33,600 annually. NDIS compliance required.',
  95,
  'SCORE: 95/100 (ULTRA HOT LEAD)\n\nPositive Factors:\n- 12-month contract commitment\n- Daily cleaning frequency\n- Medical facility (premium pricing)\n- NDIS compliance (specialized service)\n- High monthly value ($2,800)\n- Clear start date\n\nAction: PRIORITY - Call immediately. This is a major contract opportunity.'
);

-- Insert test Airbnb cleaning quote
INSERT INTO submissions (id, created_at, type, status, data, summary, lead_score, lead_reasoning)
VALUES (
  'TEST-AIR-001',
  NOW() - INTERVAL '1 hour',
  'Airbnb Cleaning',
  'Pending',
  '{
    "propertyUrl": "https://airbnb.com/rooms/12345678",
    "fullName": "Emma Williams",
    "email": "emma.williams@gmail.com",
    "phone": "0423 456 789",
    "suburb": "Parramatta",
    "bedrooms": 2,
    "bathrooms": 1,
    "turnaroundRequirements": ["Linen Change", "Restocking", "Deep Clean"],
    "accessMethod": "Smart Lock",
    "preferredTime": "12pm-3pm",
    "cleaningFrequency": "On Checkout",
    "specialNotes": "Average 3-4 turnovers per week. Need same-day service availability.",
    "aiEstimate": {
      "estimatedPrice": 95,
      "perClean": true,
      "breakdown": "2BR/1BA Airbnb turnover with full service",
      "confidence": "medium"
    }
  }'::jsonb,
  'Regular Airbnb turnover opportunity in Parramatta. Host needs 3-4 cleans per week. Smart lock access for easy scheduling. Recurring revenue potential.',
  75,
  'SCORE: 75/100 (WARM LEAD)\n\nPositive Factors:\n- Recurring business (3-4x weekly)\n- Full turnover service requested\n- Smart lock (convenient access)\n- Parramatta location\n- $380-$400 weekly revenue potential\n\nConcerns:\n- Same-day requirement (scheduling complexity)\n\nAction: Call to discuss availability and pricing for recurring service.'
);

-- Insert test job application
INSERT INTO submissions (id, created_at, type, status, data, summary, lead_score)
VALUES (
  'TEST-JOB-001',
  NOW() - INTERVAL '6 hours',
  'Job Application',
  'Pending',
  '{
    "fullName": "Jason Kumar",
    "email": "jason.kumar@email.com",
    "phone": "0434 567 890",
    "dateOfBirth": "1995-03-15",
    "address": "42 Smith Street, Liverpool NSW 2170",
    "workRights": "Australian Citizen",
    "experience": "3 years commercial cleaning experience. Previously worked for CleanCo and Spotless. Familiar with medical-grade cleaning protocols.",
    "ownEquipment": true,
    "hasVehicle": true,
    "availability": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    "serviceSuburbs": "Liverpool, Moorebank, Casula, Prestons, Edmondson Park",
    "references": "Available upon request - Previous supervisor: John Smith (CleanCo)",
    "backgroundCheck": true
  }'::jsonb,
  'Experienced cleaner with 3 years in commercial cleaning. Has own equipment and vehicle. Available weekdays. Liverpool-based. Good candidate for medical centre contracts.',
  NULL
);

-- Insert test client feedback
INSERT INTO submissions (id, created_at, type, status, data, summary, lead_score)
VALUES (
  'TEST-FEED-001',
  NOW() - INTERVAL '30 minutes',
  'Client Feedback',
  'Pending',
  '{
    "name": "David Thompson",
    "email": "david.t@email.com",
    "phone": "0445 678 901",
    "rating": 5,
    "npsScore": 10,
    "comments": "Absolutely fantastic service! The team was professional, thorough, and on time. My house has never looked better. Already recommended to 3 friends. Will definitely use again!",
    "serviceDate": "2025-12-20",
    "serviceType": "Residential Deep Clean"
  }'::jsonb,
  '5-star review with NPS 10 (Promoter). Customer highly satisfied and has referred 3 friends. Excellent testimonial for marketing.',
  NULL
);

-- Insert test landing lead
INSERT INTO submissions (id, created_at, type, status, data, summary, lead_score, lead_reasoning)
VALUES (
  'TEST-LAND-001',
  NOW() - INTERVAL '15 minutes',
  'Landing Lead',
  'Pending',
  '{
    "name": "Rachel Green",
    "email": "rachel.green@email.com",
    "phone": "0456 789 012",
    "suburb": "Campbelltown",
    "serviceInterest": "End of Lease Cleaning",
    "message": "Moving out on Dec 31st. Need bond clean for 4BR house. Real estate requires professional cleaning certificate.",
    "source": "Google Search"
  }'::jsonb,
  'End of lease cleaning inquiry from Campbelltown. 4-bedroom property. Requires professional certificate for bond return. Time-sensitive (Dec 31st move-out).',
  80,
  'SCORE: 80/100 (HOT LEAD)\n\nPositive Factors:\n- End of lease (urgent/committed)\n- Large property (4BR)\n- Requires certificate (professional service only)\n- Clear deadline\n- Campbelltown (service area)\n\nAction: Call today to provide quote and availability.'
);

-- Verify data
SELECT
  id,
  type,
  status,
  data->>'fullName' as customer_name,
  data->>'email' as email,
  lead_score,
  created_at
FROM submissions
WHERE id LIKE 'TEST-%'
ORDER BY created_at DESC;
