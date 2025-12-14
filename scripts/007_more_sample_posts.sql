-- Add more diverse sample posts for a richer feed experience
-- This will create posts with various content types

DO $$
DECLARE
  user_id uuid;
  post_id uuid;
BEGIN
  -- Get the first user
  SELECT id INTO user_id FROM public.profiles LIMIT 1;

  IF user_id IS NOT NULL THEN
    -- Post about project showcase
    INSERT INTO public.posts (author_id, content, image_url)
    VALUES (
      user_id,
      'Proud to share my final year project: a smart campus navigation app! 🗺️ Features include AR wayfinding, event locations, and accessibility routes. Built with React Native and Firebase. Check out the demo video in my profile!',
      '/placeholder.svg?height=400&width=600'
    );

    -- Post about study group
    INSERT INTO public.posts (author_id, content)
    VALUES (
      user_id,
      'Looking to form a study group for Data Structures & Algorithms. Planning to meet twice a week to solve LeetCode problems together. DM me if you''re interested! 📚'
    );

    -- Post about achievement
    INSERT INTO public.posts (author_id, content, image_url)
    VALUES (
      user_id,
      'Thrilled to share that our team won 2nd place at the National Innovation Challenge! Our project on sustainable energy solutions for rural areas received amazing feedback. Thank you to all my teammates! 🏆',
      '/placeholder.svg?height=400&width=600'
    );

    -- Post about workshop
    INSERT INTO public.posts (author_id, content)
    VALUES (
      user_id,
      'Hosting a free UI/UX design workshop next Friday at 4 PM in the Design Lab! We''ll cover Figma basics, design thinking, and prototyping. All students welcome, no prior experience needed. Limited spots available! 🎨'
    );

    -- Post about tech article
    INSERT INTO public.posts (author_id, content)
    VALUES (
      user_id,
      'Just published my first tech article on Medium about "Building Scalable Microservices with Node.js"! Would love to hear your thoughts and feedback. Link in bio. ✍️'
    );

    -- Post about career fair
    INSERT INTO public.posts (author_id, content, image_url)
    VALUES (
      user_id,
      'Had an incredible time at the Career Fair today! Talked to recruiters from 15+ companies and learned so much about different career paths. Pro tip: prepare your elevator pitch and bring multiple copies of your resume! 💼',
      '/placeholder.svg?height=400&width=600'
    );

  END IF;
END $$;
