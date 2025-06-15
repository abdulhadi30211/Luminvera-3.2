/*
  # Create categories table and fix product relationships

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `slug` (text, unique, required)
      - `image_url` (text, optional)
      - `product_count` (integer, default 0)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Table Updates
    - Add foreign key constraint from `products.category_id` to `categories.id`

  3. Security
    - Enable RLS on `categories` table
    - Add policy for public read access to categories
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  image_url text,
  product_count integer DEFAULT 0 NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable RLS on categories table
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access to categories
CREATE POLICY "Enable read access for all users" 
  ON public.categories 
  FOR SELECT 
  USING (true);

-- Check if products table exists and add foreign key constraint if category_id column exists
DO $$
BEGIN
  -- Check if products table exists and has category_id column
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'products'
  ) AND EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'category_id'
  ) THEN
    -- Add foreign key constraint if it doesn't already exist
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints
      WHERE constraint_schema = 'public' 
      AND table_name = 'products' 
      AND constraint_name = 'fk_products_category'
    ) THEN
      ALTER TABLE public.products
      ADD CONSTRAINT fk_products_category
      FOREIGN KEY (category_id) REFERENCES public.categories(id);
    END IF;
  END IF;
END $$;

-- Insert some sample categories to get started
INSERT INTO public.categories (name, slug, image_url, product_count) VALUES
  ('Electronics', 'electronics', 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg', 0),
  ('Clothing', 'clothing', 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg', 0),
  ('Home & Garden', 'home-garden', 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg', 0),
  ('Sports & Outdoors', 'sports-outdoors', 'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg', 0),
  ('Books', 'books', 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg', 0)
ON CONFLICT (slug) DO NOTHING;