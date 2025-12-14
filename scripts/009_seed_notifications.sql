-- Seed notifications for existing users
-- Note: Replace user IDs with actual IDs from your profiles table after running other scripts

INSERT INTO public.notifications (user_id, actor_id, type, content, is_read, created_at) VALUES
  -- Connection requests
  ((SELECT id FROM public.profiles ORDER BY created_at LIMIT 1 OFFSET 0), 
   (SELECT id FROM public.profiles ORDER BY created_at LIMIT 1 OFFSET 1), 
   'connection', 'sent you a connection request', false, NOW() - INTERVAL '2 hours'),
  
  ((SELECT id FROM public.profiles ORDER BY created_at LIMIT 1 OFFSET 0), 
   (SELECT id FROM public.profiles ORDER BY created_at LIMIT 1 OFFSET 2), 
   'connection', 'accepted your connection request', true, NOW() - INTERVAL '1 day'),
  
  -- Likes on posts
  ((SELECT id FROM public.profiles ORDER BY created_at LIMIT 1 OFFSET 0), 
   (SELECT id FROM public.profiles ORDER BY created_at LIMIT 1 OFFSET 3), 
   'like', 'liked your post', false, NOW() - INTERVAL '3 hours'),
  
  ((SELECT id FROM public.profiles ORDER BY created_at LIMIT 1 OFFSET 0), 
   (SELECT id FROM public.profiles ORDER BY created_at LIMIT 1 OFFSET 4), 
   'like', 'liked your post', true, NOW() - INTERVAL '2 days'),
  
  -- Comments
  ((SELECT id FROM public.profiles ORDER BY created_at LIMIT 1 OFFSET 0), 
   (SELECT id FROM public.profiles ORDER BY created_at LIMIT 1 OFFSET 1), 
   'comment', 'commented on your post', false, NOW() - INTERVAL '1 hour'),
  
  ((SELECT id FROM public.profiles ORDER BY created_at LIMIT 1 OFFSET 0), 
   (SELECT id FROM public.profiles ORDER BY created_at LIMIT 1 OFFSET 2), 
   'comment', 'commented on your post', true, NOW() - INTERVAL '5 hours'),
  
  -- Event notifications
  ((SELECT id FROM public.profiles ORDER BY created_at LIMIT 1 OFFSET 0), 
   NULL, 
   'event', 'New hackathon event: AI Innovation Challenge', false, NOW() - INTERVAL '4 hours'),
  
  ((SELECT id FROM public.profiles ORDER BY created_at LIMIT 1 OFFSET 0), 
   NULL, 
   'event', 'Reminder: Workshop on Machine Learning starts tomorrow', true, NOW() - INTERVAL '1 day');
