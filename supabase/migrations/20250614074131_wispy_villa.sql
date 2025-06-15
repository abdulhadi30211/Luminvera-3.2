/*
  # Add INSERT policy for profiles table

  1. Security Changes
    - Add policy to allow authenticated users to insert their own profile
    - This enables user signup to work properly by allowing profile creation

  The policy ensures that authenticated users can only create a profile record
  where the id matches their auth.uid(), preventing users from creating
  profiles for other users.
*/

CREATE POLICY "Users can insert their own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);