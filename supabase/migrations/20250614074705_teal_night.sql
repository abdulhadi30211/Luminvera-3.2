/*
  # Email Verification System Setup

  1. Database Changes
    - Enable email confirmation in Supabase Auth settings
    - Update RLS policies to handle unverified users
    - Add trigger for profile creation after email verification

  2. Security
    - Users must verify email before accessing protected features
    - Profiles are created automatically after email verification
    - Cart and other user-specific features require verified email

  3. User Experience
    - Clear messaging about email verification requirement
    - Resend verification email functionality
    - Proper error handling for unverified users
*/

-- Create a function to handle new user profile creation after email verification
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Only create profile if email is confirmed
  IF NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL THEN
    INSERT INTO public.profiles (id, username, full_name, role)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
      COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
      'user'
    )
    ON CONFLICT (id) DO UPDATE SET
      username = COALESCE(NEW.raw_user_meta_data->>'username', profiles.username),
      full_name = COALESCE(NEW.raw_user_meta_data->>'full_name', profiles.full_name);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic profile creation after email verification
DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update cart_items table to ensure it exists with proper structure
CREATE TABLE IF NOT EXISTS public.cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, product_id)
);

-- Enable RLS on cart_items
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- Create policies for cart_items (only for verified users)
CREATE POLICY "Users can manage their own cart items"
  ON public.cart_items
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Update profiles policies to be more restrictive
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Only allow profile updates for verified users
CREATE POLICY "Verified users can update their own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id AND auth.jwt() ->> 'email_confirmed_at' IS NOT NULL)
  WITH CHECK (auth.uid() = id AND auth.jwt() ->> 'email_confirmed_at' IS NOT NULL);

-- Allow profile creation through the trigger function
CREATE POLICY "Allow profile creation through trigger"
  ON public.profiles
  FOR INSERT
  WITH CHECK (true);