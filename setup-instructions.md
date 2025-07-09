# Database Setup Instructions

## Current Project Status
Your project is designed to work **without a database** for core functionality. It uses:
- **localStorage** for todos, flashcards, admin data, and user preferences
- **Supabase Auth** for user authentication (optional)

## Option 1: Run Without Database (Recommended)
The project works perfectly without any database setup:

1. **Update your `.env` file:**
```env
VITE_SUPABASE_URL=https://placeholder.supabase.co
VITE_SUPABASE_ANON_KEY=placeholder-key
```

2. **Features that work without database:**
   - ✅ Todo management (localStorage)
   - ✅ Flashcard learning with AI detection
   - ✅ Admin panel (localStorage)
   - ✅ Theme settings
   - ✅ All core functionality

3. **Authentication fallback:**
   - Hardcoded admin login: `admin@demo.com` / `admin`
   - No user registration, but full app functionality

## Option 2: Set Up Supabase (For Authentication)

### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for setup to complete

### Step 2: Run SQL Migrations
1. Go to SQL Editor in Supabase Dashboard
2. Run the contents of `supabase/migrations/setup_auth_tables.sql`
3. Optionally run `supabase/migrations/optional_data_tables.sql` if you want database storage

### Step 3: Configure Authentication
1. Go to Authentication > Settings
2. **Disable email confirmation** (or the app won't work):
   - Set "Enable email confirmations" to OFF
3. Configure any social providers if needed

### Step 4: Update Environment Variables
```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Step 5: Update Admin Email (Optional)
In the SQL migration, change the admin email:
```sql
INSERT INTO admin_users (email) 
VALUES ('your-admin-email@example.com')
```

## What Each Migration Does

### setup_auth_tables.sql
- Creates user profiles table
- Sets up admin users table
- Configures Row Level Security (RLS)
- Creates triggers for automatic profile creation

### optional_data_tables.sql (Optional)
- Creates todos table (alternative to localStorage)
- Creates user subscriptions table
- Creates flashcard progress tracking
- **Note:** You'd need to modify the app code to use these tables

## Troubleshooting

### If you get authentication errors:
1. Check that email confirmation is disabled
2. Verify your Supabase URL and keys
3. Make sure RLS policies are set correctly

### If you prefer localStorage only:
- Just use placeholder values in `.env`
- Everything will work with local storage
- Use `admin@demo.com` / `admin` for admin access

## Current Data Storage
- **Todos:** localStorage (`todos`)
- **Admin data:** localStorage (`admin_plans`, `admin_coupons`, `admin_users`)
- **User preferences:** localStorage (theme, flashcard settings)
- **Subscriptions:** localStorage (`subscription_${userId}`)

The app is designed to work offline-first with localStorage, so database setup is optional!