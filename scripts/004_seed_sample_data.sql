-- Insert sample discounts (these would be managed by admins in production)
INSERT INTO public.discounts (brand_name, description, discount_code, category, valid_until, brand_logo) VALUES
  ('Spotify', 'Get 50% off Spotify Premium for students', 'STUDENT50', 'Tech', '2025-12-31', '/placeholder.svg?height=100&width=100'),
  ('Adobe', 'Adobe Creative Cloud - 60% off for students', 'STUDENT60', 'Tech', '2025-12-31', '/placeholder.svg?height=100&width=100'),
  ('Amazon', 'Amazon Prime Student - 6 months free', 'PRIMESTUDENT', 'Tech', '2025-12-31', '/placeholder.svg?height=100&width=100'),
  ('Dominos', 'Get 25% off on orders above $15', 'STUDENT25', 'Food', '2025-06-30', '/placeholder.svg?height=100&width=100'),
  ('Nike', 'Nike Student Discount - 10% off', 'NIKESTUDENT', 'Fashion', '2025-12-31', '/placeholder.svg?height=100&width=100'),
  ('Apple', 'Education pricing on Mac and iPad', 'EDUDISCOUNT', 'Tech', '2025-12-31', '/placeholder.svg?height=100&width=100'),
  ('Grammarly', 'Grammarly Premium - 20% off for students', 'GRAMSTUDY', 'Education', '2025-12-31', '/placeholder.svg?height=100&width=100'),
  ('Notion', 'Notion Personal Pro - Free for students', 'STUDENTFREE', 'Education', '2025-12-31', '/placeholder.svg?height=100&width=100')
ON CONFLICT DO NOTHING;
