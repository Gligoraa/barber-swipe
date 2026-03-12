-- Seed barbershops data
INSERT INTO public.barbershops (name, rating, distance, images, phone, address, hours) VALUES
(
  'FreshCuts Barbershop',
  4.8,
  '1.2 km away',
  ARRAY[
    'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&h=600&fit=crop'
  ],
  '(555) 123-4567',
  '123 Main Street, Downtown',
  'Mon-Sat: 9AM - 8PM'
),
(
  'The Gentleman''s Cut',
  4.9,
  '0.8 km away',
  ARRAY[
    'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1517832606299-7ae9b720a186?w=400&h=600&fit=crop'
  ],
  '(555) 987-6543',
  '456 Oak Avenue, Midtown',
  'Tue-Sun: 10AM - 7PM'
),
(
  'Urban Fade Studio',
  4.7,
  '2.1 km away',
  ARRAY[
    'https://images.unsplash.com/photo-1493256338651-d82f7acb2b38?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1622287162716-f311baa1a2b8?w=400&h=600&fit=crop'
  ],
  '(555) 456-7890',
  '789 Urban Street, Arts District',
  'Mon-Fri: 8AM - 9PM'
),
(
  'Classic Cuts & Shaves',
  4.6,
  '1.5 km away',
  ARRAY[
    'https://images.unsplash.com/photo-1512690459411-b9245aed614b?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1599351431613-18ef1fdd27e1?w=400&h=600&fit=crop'
  ],
  '(555) 321-0987',
  '321 Vintage Lane, Old Town',
  'Mon-Sat: 9AM - 6PM'
),
(
  'Prime Barber Lounge',
  4.9,
  '0.5 km away',
  ARRAY[
    'https://images.unsplash.com/photo-1634302086887-13b5281d7431?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1596362601603-8ae4b9e72690?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=600&fit=crop'
  ],
  '(555) 654-3210',
  '555 Prime Boulevard, Financial District',
  'Daily: 8AM - 10PM'
);
