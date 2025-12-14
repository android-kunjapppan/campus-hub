-- Insert common skills by category
INSERT INTO public.skills (name, category) VALUES
  -- Frontend
  ('Frontend', 'Development'),
  ('React', 'Development'),
  ('Vue.js', 'Development'),
  ('Angular', 'Development'),
  ('HTML/CSS', 'Development'),
  ('TypeScript', 'Development'),
  ('JavaScript', 'Development'),
  
  -- Backend
  ('Backend', 'Development'),
  ('Node.js', 'Development'),
  ('Python', 'Development'),
  ('Java', 'Development'),
  ('Go', 'Development'),
  ('PHP', 'Development'),
  
  -- Data & AI
  ('AI/ML', 'Technology'),
  ('Data Science', 'Technology'),
  ('Machine Learning', 'Technology'),
  ('Deep Learning', 'Technology'),
  ('Data Analysis', 'Technology'),
  
  -- Design
  ('UI/UX', 'Design'),
  ('Design', 'Design'),
  ('Graphic Design', 'Design'),
  ('Figma', 'Design'),
  ('Adobe XD', 'Design'),
  
  -- Business
  ('Marketing', 'Business'),
  ('Finance', 'Business'),
  ('Business Analysis', 'Business'),
  ('Project Management', 'Business'),
  ('Sales', 'Business'),
  
  -- Other
  ('Mobile Development', 'Development'),
  ('DevOps', 'Technology'),
  ('Cloud Computing', 'Technology'),
  ('Cybersecurity', 'Technology'),
  ('Blockchain', 'Technology'),
  ('Content Writing', 'Creative'),
  ('Video Editing', 'Creative'),
  ('Photography', 'Creative')
ON CONFLICT (name) DO NOTHING;
