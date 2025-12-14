-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;
-- Added RLS for notifications table
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;

-- Profiles policies (public read, own edit)
CREATE POLICY "profiles_select_all" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- Skills policies (public read, authenticated insert)
CREATE POLICY "skills_select_all" ON public.skills FOR SELECT USING (true);
CREATE POLICY "skills_insert_authenticated" ON public.skills FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- User skills policies (public read, own write)
CREATE POLICY "user_skills_select_all" ON public.user_skills FOR SELECT USING (true);
CREATE POLICY "user_skills_insert_own" ON public.user_skills FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_skills_delete_own" ON public.user_skills FOR DELETE USING (auth.uid() = user_id);

-- Posts policies (public read, own write)
CREATE POLICY "posts_select_all" ON public.posts FOR SELECT USING (true);
CREATE POLICY "posts_insert_own" ON public.posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "posts_update_own" ON public.posts FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "posts_delete_own" ON public.posts FOR DELETE USING (auth.uid() = author_id);

-- Post likes policies (public read, authenticated write)
CREATE POLICY "post_likes_select_all" ON public.post_likes FOR SELECT USING (true);
CREATE POLICY "post_likes_insert_authenticated" ON public.post_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "post_likes_delete_own" ON public.post_likes FOR DELETE USING (auth.uid() = user_id);

-- Post comments policies (public read, own write)
CREATE POLICY "post_comments_select_all" ON public.post_comments FOR SELECT USING (true);
CREATE POLICY "post_comments_insert_authenticated" ON public.post_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "post_comments_update_own" ON public.post_comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "post_comments_delete_own" ON public.post_comments FOR DELETE USING (auth.uid() = user_id);

-- Added policies for notifications table (users can only see their own notifications)
-- Notifications policies (view own, system can insert)
CREATE POLICY "notifications_select_own" ON public.notifications FOR SELECT 
  USING (auth.uid() = user_id);
CREATE POLICY "notifications_insert_authenticated" ON public.notifications FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "notifications_update_own" ON public.notifications FOR UPDATE 
  USING (auth.uid() = user_id);
CREATE POLICY "notifications_delete_own" ON public.notifications FOR DELETE 
  USING (auth.uid() = user_id);

-- Events policies (public read, own write)
CREATE POLICY "events_select_all" ON public.events FOR SELECT USING (true);
CREATE POLICY "events_insert_authenticated" ON public.events FOR INSERT WITH CHECK (auth.uid() = organizer_id);
CREATE POLICY "events_update_own" ON public.events FOR UPDATE USING (auth.uid() = organizer_id);
CREATE POLICY "events_delete_own" ON public.events FOR DELETE USING (auth.uid() = organizer_id);

-- Discounts policies (public read, admin write - for now all authenticated can write)
CREATE POLICY "discounts_select_all" ON public.discounts FOR SELECT USING (true);
CREATE POLICY "discounts_insert_authenticated" ON public.discounts FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "discounts_update_authenticated" ON public.discounts FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "discounts_delete_authenticated" ON public.discounts FOR DELETE USING (auth.uid() IS NOT NULL);

-- Connections policies (view if involved, create if requester)
CREATE POLICY "connections_select_involved" ON public.connections FOR SELECT 
  USING (auth.uid() = requester_id OR auth.uid() = receiver_id);
CREATE POLICY "connections_insert_own" ON public.connections FOR INSERT 
  WITH CHECK (auth.uid() = requester_id);
CREATE POLICY "connections_update_receiver" ON public.connections FOR UPDATE 
  USING (auth.uid() = receiver_id);
CREATE POLICY "connections_delete_own" ON public.connections FOR DELETE 
  USING (auth.uid() = requester_id OR auth.uid() = receiver_id);

-- Messages policies (view if sender or receiver)
CREATE POLICY "messages_select_involved" ON public.messages FOR SELECT 
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "messages_insert_own" ON public.messages FOR INSERT 
  WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "messages_update_receiver" ON public.messages FOR UPDATE 
  USING (auth.uid() = receiver_id);
CREATE POLICY "messages_delete_own" ON public.messages FOR DELETE 
  USING (auth.uid() = sender_id);

-- Experience policies (public read, own write)
CREATE POLICY "experience_select_all" ON public.experience FOR SELECT USING (true);
CREATE POLICY "experience_insert_own" ON public.experience FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "experience_update_own" ON public.experience FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "experience_delete_own" ON public.experience FOR DELETE USING (auth.uid() = user_id);

-- Projects policies (public read, own write)
CREATE POLICY "projects_select_all" ON public.projects FOR SELECT USING (true);
CREATE POLICY "projects_insert_own" ON public.projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "projects_update_own" ON public.projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "projects_delete_own" ON public.projects FOR DELETE USING (auth.uid() = user_id);

-- Certifications policies (public read, own write)
CREATE POLICY "certifications_select_all" ON public.certifications FOR SELECT USING (true);
CREATE POLICY "certifications_insert_own" ON public.certifications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "certifications_update_own" ON public.certifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "certifications_delete_own" ON public.certifications FOR DELETE USING (auth.uid() = user_id);
