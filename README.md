# CampusHub - Student Networking Platform

CampusHub is a modern, comprehensive student networking platform that combines professional networking, campus events discovery, talent search, and exclusive student discounts—all within a secure, student-verified environment.

## Features

- **Authentication**: Secure email/password authentication with Supabase
- **Student Virtual ID**: Digital university ID card with QR code
- **Social Feed**: Share posts, images, like, comment, and engage with other students
- **Talent Search**: Find students by skills, university, and department
- **Events Discovery**: Browse campus events with filters by type and date
- **Student Discounts**: Exclusive discounts organized by category
- **Profile Pages**: Resume-style profiles with experience, projects, and certifications
- **Real-time Messaging**: Chat with connected students
- **Notifications**: Stay updated with likes, comments, connections, and events

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Icons**: Lucide React

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 18.x or later
- npm or yarn
- A Supabase account (free tier works)

## Project Setup

### 1. Clone or Download the Project

Download the project ZIP file and extract it, or clone the repository.

### 2. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Set Up Supabase

#### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in your project details:
   - Project name: `campushub`
   - Database password: Choose a strong password
   - Region: Select closest to your location
4. Wait for the project to be provisioned (takes ~2 minutes)

#### Get Your Environment Variables

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon/public key** (long string starting with `eyJ...`)

### 4. Configure Environment Variables

Create a `.env.local` file in the root of your project:

\`\`\`bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/feed
\`\`\`

Replace `your_project_url_here` and `your_anon_key_here` with the values from your Supabase dashboard.

### 5. Set Up the Database

CampusHub requires several database tables with Row Level Security enabled. You need to run the SQL scripts in order.

#### Option A: Using Supabase SQL Editor (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New query**
4. Run each script in order by copying and pasting the contents:

   **Run these in order:**
   \`\`\`
   1. scripts/001_create_tables.sql       (Creates all database tables)
   2. scripts/002_row_level_security.sql  (Enables RLS and policies)
   3. scripts/003_seed_skills.sql         (Populates skills)
   4. scripts/004_seed_sample_data.sql    (Creates sample profiles)
   5. scripts/005_profile_trigger.sql     (Auto-update timestamps)
   6. scripts/006_seed_posts.sql          (Sample posts)
   7. scripts/007_more_sample_posts.sql   (More sample posts)
   8. scripts/008_update_seed_with_images.sql (Adds images to posts)
   9. scripts/009_seed_notifications.sql  (Sample notifications)
   \`\`\`

5. After running each script, click **Run** and verify there are no errors

#### Option B: Using Supabase CLI

If you have the Supabase CLI installed:

\`\`\`bash
# Link your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
\`\`\`

### 6. Verify Database Setup

1. Go to **Table Editor** in your Supabase dashboard
2. You should see these tables:
   - profiles
   - skills
   - user_skills
   - posts
   - post_likes
   - post_comments
   - notifications
   - events
   - discounts
   - connections
   - messages
   - experience
   - projects
   - certifications

3. Check that the `skills` table has data (should have ~40+ skills)
4. Check that sample data exists in `profiles`, `posts`, and `events`

### 7. Run the Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## First Time Usage

### Create an Account

1. Click "Get Started" on the landing page
2. Click "Sign Up"
3. Enter your email and password
4. Check your email for the verification link
5. Click the verification link
6. Complete the onboarding form with your student details
7. Select your skills from the available categories
8. Submit to create your profile

### Explore the Platform

After signing up, you can:

- **Feed**: View and create posts, like, comment, and share
- **Talent**: Search for students by skills and connect with them
- **Events**: Browse upcoming campus events
- **Discounts**: Discover student discounts
- **Messages**: Chat with your connections
- **Notifications**: See your recent activity
- **Profile**: View and edit your resume-style profile
- **Virtual ID**: Access your digital student ID card

## Project Structure

\`\`\`
campushub/
├── app/
│   ├── (protected)/          # Protected routes (require auth)
│   │   ├── feed/            # Social feed
│   │   ├── talent/          # Talent search
│   │   ├── events/          # Events discovery
│   │   ├── discounts/       # Student discounts
│   │   ├── messages/        # Messaging
│   │   ├── notifications/   # Notifications page
│   │   └── profile/         # User profile & Virtual ID
│   ├── auth/                # Authentication pages
│   │   ├── login/
│   │   └── sign-up/
│   ├── onboarding/          # New user onboarding
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Landing page
│   └── globals.css          # Global styles
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── main-nav.tsx         # Main navigation bar
│   ├── post-card.tsx        # Social feed post card
│   ├── student-id-card.tsx  # Virtual ID card
│   └── ...                  # Other components
├── lib/
│   └── supabase/            # Supabase client utilities
│       ├── client.ts        # Browser client
│       ├── server.ts        # Server client
│       └── proxy.ts         # Proxy configuration
├── scripts/                 # SQL migration scripts
├── proxy.ts                 # Middleware for auth
└── package.json
\`\`\`

## Database Schema

### Core Tables

- **profiles**: Extended user profiles with student information
- **skills**: Available skills across categories
- **user_skills**: Junction table for user-skill relationships
- **posts**: Social feed posts
- **post_likes**: Post likes tracking
- **post_comments**: Comments on posts
- **notifications**: User notifications
- **events**: Campus events
- **discounts**: Student discount offers
- **connections**: User connection requests and relationships
- **messages**: Direct messages between users
- **experience**: Work experience entries
- **projects**: Student projects
- **certifications**: Certifications and achievements

### Row Level Security

All tables have RLS enabled with appropriate policies:
- Public read access for profiles, posts, events, discounts
- User-specific access for notifications, messages, connections
- Owner-only write access for user data

## Troubleshooting

### "Could not find table" Error

If you see errors like `Could not find the table 'public.notifications'`:
- Make sure you ran ALL SQL scripts in order
- Verify tables exist in the Supabase Table Editor
- Try refreshing the schema cache in Supabase

### Authentication Errors

If authentication isn't working:
- Verify your `.env.local` file has correct values
- Make sure `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` matches your local URL
- Check that email confirmation is enabled in Supabase Auth settings

### No Sample Data

If you don't see any posts or events:
- Run the seed scripts (006, 007, 008) again
- Check that profiles exist before running seed scripts
- Verify data in Supabase Table Editor

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` (use your production URL)
6. Deploy

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Check the troubleshooting section above
- Review the Supabase documentation
- Open an issue on GitHub

---

Built with ❤️ for students, by students.
