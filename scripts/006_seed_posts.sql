-- Seed some sample posts for the feed
-- First, get or create some sample users (these would be real students in production)

-- Insert sample posts with dummy data
-- Note: Replace user IDs with actual user IDs from your profiles table after signup

DO $$
DECLARE
  user_id_1 uuid;
  user_id_2 uuid;
  user_id_3 uuid;
  post_id_1 uuid;
  post_id_2 uuid;
  post_id_3 uuid;
BEGIN
  -- Get some existing user IDs (if any exist)
  SELECT id INTO user_id_1 FROM public.profiles LIMIT 1 OFFSET 0;
  SELECT id INTO user_id_2 FROM public.profiles LIMIT 1 OFFSET 1;
  SELECT id INTO user_id_3 FROM public.profiles LIMIT 1 OFFSET 2;

  -- Only insert posts if we have at least one user
  IF user_id_1 IS NOT NULL THEN
    -- Post 1
    INSERT INTO public.posts (author_id, content, image_url)
    VALUES (
      user_id_1,
      'Just completed an amazing hackathon project using React and Node.js! Built a real-time collaboration tool for students. Looking forward to presenting it at the tech fair next week. 🚀',
      '/placeholder.svg?height=400&width=600'
    )
    RETURNING id INTO post_id_1;

    -- Add some likes and comments to Post 1
    IF user_id_2 IS NOT NULL THEN
      INSERT INTO public.post_likes (post_id, user_id) VALUES (post_id_1, user_id_2);
      INSERT INTO public.post_comments (post_id, user_id, content)
      VALUES (post_id_1, user_id_2, 'This looks amazing! Would love to see a demo.');
    END IF;

    -- Post 2
    INSERT INTO public.posts (author_id, content)
    VALUES (
      user_id_1,
      'Excited to announce that I''ll be interning at TechCorp this summer! Grateful for all the support from the CampusHub community. If anyone has tips for a first-time intern, drop them below! 💼',
      NULL
    )
    RETURNING id INTO post_id_2;

    -- Post 3
    INSERT INTO public.posts (author_id, content, image_url)
    VALUES (
      user_id_1,
      'Attended an incredible AI/ML workshop today at the university. Learned about neural networks and built my first image classification model. The future of AI is so exciting! 🤖',
      '/placeholder.svg?height=400&width=600'
    )
    RETURNING id INTO post_id_3;

    IF user_id_2 IS NOT NULL THEN
      INSERT INTO public.post_likes (post_id, user_id) VALUES (post_id_3, user_id_2);
    END IF;
  END IF;

  -- Insert some sample notifications for the first user
  IF user_id_1 IS NOT NULL AND user_id_2 IS NOT NULL THEN
    INSERT INTO public.notifications (user_id, type, content, related_id, is_read)
    VALUES 
      (user_id_1, 'like', 'Someone liked your post about the hackathon project', user_id_2, false),
      (user_id_1, 'comment', 'Someone commented on your post: "This looks amazing! Would love to see a demo."', user_id_2, false),
      (user_id_1, 'connection', 'You have a new connection request', user_id_2, false);
  END IF;

END $$;
