/*
  # Create products table and establish relationship with categories

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `slug` (text, unique, required)
      - `description` (text, optional)
      - `price` (numeric, required)
      - `category_id` (uuid, foreign key to categories)
      - `subcategory` (text, optional)
      - `image_url` (text, optional)
      - `rating` (numeric, default 0)
      - `in_stock` (boolean, default true)
      - `stock_quantity` (integer, default 0)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `products` table
    - Add policy for public read access to products

  3. Relationships
    - Foreign key constraint from products.category_id to categories.id
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  price numeric NOT NULL CHECK (price >= 0),
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  subcategory text,
  image_url text,
  rating numeric DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  in_stock boolean DEFAULT true,
  stock_quantity integer DEFAULT 0 CHECK (stock_quantity >= 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Add policy for public read access
CREATE POLICY "Enable read access for all users"
  ON products
  FOR SELECT
  TO public
  USING (true);

-- Create index on category_id for better query performance
CREATE INDEX IF NOT EXISTS products_category_id_idx ON products(category_id);

-- Create index on slug for better query performance
CREATE INDEX IF NOT EXISTS products_slug_idx ON products(slug);

-- Create index on in_stock for filtering
CREATE INDEX IF NOT EXISTS products_in_stock_idx ON products(in_stock);