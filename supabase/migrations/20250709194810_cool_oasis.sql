/*
# Initial Supabase Setup for Authentication

This migration sets up the basic authentication structure for the TaskFlow application.
The application primarily uses localStorage for data persistence, but Supabase handles user authentication.

1. Authentication Tables
   - Users are handled by Supabase Auth automatically
   - No additional user tables needed for basic functionality

2. Optional: User Profiles Table
   - Extended user information if needed
   - Links to Supabase auth.users

3. Security
   - Enable RLS on all tables
   - Add policies for user data access
*/

-- Create user profiles table (optional - for extended user info)
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policies for user profiles
CREATE POLICY "Users can view own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, full_name)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email)
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Optional: Create admin users table for admin panel access
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id),
  UNIQUE(email)
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Insert default admin user (update email as needed)
INSERT INTO admin_users (email) 
VALUES ('admin@admin.com'), ('admin@demo.com')
ON CONFLICT (email) DO NOTHING;

-- Policy for admin users
CREATE POLICY "Only admins can access admin table"
  ON admin_users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );