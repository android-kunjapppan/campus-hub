-- Insert sample discounts (these would be managed by admins in production)
INSERT INTO public.discounts (brand_name, description, discount_code, redeem_url, category, valid_until, brand_logo) VALUES
  -- Food
  ('Dominos', 'Get 25% off on orders above $15', 'STUDENT25', NULL, 'Food', '2027-12-31', '/discounts/dominos.svg'),

  -- Fashion
  ('Nike', 'Nike Student Discount - 10% off', 'NIKESTUDENT', NULL, 'Fashion', '2027-12-31', '/discounts/nike.svg'),

  -- Entertainment & Music
  ('Spotify Student Premium', 'Spotify Premium for students at a discounted price (eligibility required).', NULL, 'https://www.spotify.com/in-en/student/', 'Entertainment & Music', '2027-12-31', '/discounts/spotify.svg'),
  ('Apple Music Student Plan', 'Apple Music student subscription pricing (eligibility required).', NULL, 'https://offers.applemusic.apple/en-in/student-offer', 'Entertainment & Music', '2027-12-31', '/discounts/apple-music.svg'),
  ('YouTube Premium Student', 'YouTube Premium student plan (eligibility required).', NULL, 'https://www.youtube.com/premium/student', 'Entertainment & Music', '2027-12-31', '/discounts/youtube.svg'),

  -- Electronics
  ('Lenovo Student Store', 'Student discounts on Lenovo laptops and accessories.', NULL, 'https://www.lenovo.com/in/en/d/students-offer/?srsltid=AfmBOopoFd0dO34ua5kr-fStJ04L4ggTcFUYZz-ksBXIuVWOdSM7DeqY', 'Electronics', '2027-12-31', '/discounts/lenovo.svg'),
  ('Apple Education Store', 'Education pricing on Apple products (India education store).', NULL, 'https://www.apple.com/in-edu/store', 'Electronics', '2027-12-31', '/discounts/apple.svg'),
  ('Dell Student Discounts', 'Student pricing and offers on Dell devices.', NULL, 'https://www.dell.com/en-in/lp/students', 'Electronics', '2027-12-31', '/discounts/dell.svg'),
  ('Samsung Student Discount', 'Student offers on Samsung products.', NULL, 'https://www.samsung.com/in/offer/student-discount/?srsltid=AfmBOor-ACVvRn0bJzhy9NZeGpSYMTkXOpTChPFq5OEESaYanOoy2Ebt', 'Electronics', '2027-12-31', '/discounts/samsung.svg'),

  -- Tools
  ('Adobe Creative Cloud (Students)', 'Student pricing for Adobe Creative Cloud plans.', NULL, 'https://www.adobe.com/in/creativecloud/buy/students.html', 'Tools', '2027-12-31', '/discounts/adobe.svg'),
  ('Canva for Education', 'Canva education access and benefits (eligibility required).', NULL, 'https://www.canva.com/en_in/education/', 'Tools', '2027-12-31', '/discounts/canva.svg'),
  ('GitHub Student Developer Pack', 'Free developer tools and services for verified students.', NULL, 'https://education.github.com/pack', 'Tools', '2027-12-31', '/discounts/github.svg'),
  ('Microsoft Office 365 Education', 'Microsoft 365/Office for students (eligibility required).', NULL, 'https://www.microsoft.com/en-in/education/products/office', 'Tools', '2027-12-31', '/discounts/microsoft.svg'),
  ('Google Gemini for Students', 'Gemini student offers (availability may vary).', NULL, 'https://gemini.google/in/students/?hl=en-IN', 'Tools', '2027-12-31', '/discounts/google.svg'),

  -- Education
  ('AWS Educate', 'Cloud learning resources and credits for students.', NULL, 'https://aws.amazon.com/education/awseducate/', 'Education', '2027-12-31', '/discounts/aws.svg'),
  ('freeCodeCamp', 'Free coding curriculum and certifications.', NULL, 'https://www.freecodecamp.org/', 'Education', '2027-12-31', '/discounts/freecodecamp.svg'),
  ('Figma for Education', 'Figma education plan and benefits.', NULL, 'https://www.figma.com/education/', 'Education', '2027-12-31', '/discounts/figma.svg')
ON CONFLICT DO NOTHING;
