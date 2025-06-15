/*
  # Create products table with proper foreign key relationship

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `slug` (text, unique, required)
      - `description` (text, optional)
      - `price` (decimal, required)
      - `category_id` (uuid, foreign key to categories)
      - `subcategory` (text, optional)
      - `image_url` (text, optional)
      - `rating` (decimal, default 0)
      - `in_stock` (boolean, default true)
      - `stock_quantity` (integer, default 0)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `products` table
    - Add policy for public read access to products

  3. Sample Data
    - Insert sample products for each category
*/

-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  price decimal(10,2) NOT NULL,
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  subcategory text,
  image_url text,
  rating decimal(2,1) DEFAULT 0,
  in_stock boolean DEFAULT true,
  stock_quantity integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable RLS on products table
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access to products
CREATE POLICY "Products are viewable by everyone"
  ON public.products
  FOR SELECT
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON public.products(in_stock);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at 
  BEFORE UPDATE ON public.products 
  FOR EACH ROW 
  EXECUTE FUNCTION update_products_updated_at();

-- Insert sample products
INSERT INTO public.products (name, slug, price, category_id, subcategory, image_url, description, rating, in_stock, stock_quantity) VALUES
  (
    'Premium Electric Kettle',
    'premium-electric-kettle',
    49.99,
    (SELECT id FROM public.categories WHERE slug = 'home-garden'),
    'Kitchen Appliances',
    'https://images.pexels.com/photos/6315801/pexels-photo-6315801.jpeg?auto=compress&cs=tinysrgb&w=800',
    'Stainless steel electric kettle with temperature control and auto shut-off feature',
    4.5,
    true,
    25
  ),
  (
    'Wireless Noise-Cancelling Headphones',
    'wireless-noise-cancelling-headphones',
    129.99,
    (SELECT id FROM public.categories WHERE slug = 'electronics'),
    'Audio',
    'https://images.pexels.com/photos/3945667/pexels-photo-3945667.jpeg?auto=compress&cs=tinysrgb&w=800',
    'Premium wireless headphones with active noise cancellation and 30-hour battery life',
    4.8,
    true,
    15
  ),
  (
    'Genuine Leather Handbag',
    'genuine-leather-handbag',
    89.99,
    (SELECT id FROM public.categories WHERE slug = 'clothing'),
    'Bags',
    'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800',
    'Elegant genuine leather handbag with multiple compartments and adjustable strap',
    4.3,
    true,
    12
  ),
  (
    'Smart Fitness Watch',
    'smart-fitness-watch',
    199.99,
    (SELECT id FROM public.categories WHERE slug = 'electronics'),
    'Wearables',
    'https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg?auto=compress&cs=tinysrgb&w=800',
    'Advanced fitness tracking smartwatch with heart rate monitor, GPS, and sleep tracking',
    4.6,
    true,
    8
  ),
  (
    'Organic Skincare Set',
    'organic-skincare-set',
    24.99,
    (SELECT id FROM public.categories WHERE slug = 'home-garden'),
    'Beauty',
    'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=800',
    'Natural moisturizing skincare set with SPF 30 protection and anti-aging properties',
    4.4,
    true,
    30
  ),
  (
    'Running Shoes',
    'running-shoes',
    89.99,
    (SELECT id FROM public.categories WHERE slug = 'sports-outdoors'),
    'Footwear',
    'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=800',
    'Lightweight running shoes with advanced cushioning and breathable mesh upper',
    4.7,
    true,
    20
  ),
  (
    'Stainless Steel Coffee Maker',
    'stainless-steel-coffee-maker',
    79.99,
    (SELECT id FROM public.categories WHERE slug = 'home-garden'),
    'Kitchen Appliances',
    'https://images.pexels.com/photos/324028/pexels-photo-324028.jpeg?auto=compress&cs=tinysrgb&w=800',
    'Programmable coffee maker with thermal carafe and built-in grinder',
    4.2,
    true,
    18
  ),
  (
    'Wireless Bluetooth Speaker',
    'wireless-bluetooth-speaker',
    59.99,
    (SELECT id FROM public.categories WHERE slug = 'electronics'),
    'Audio',
    'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=800',
    'Portable Bluetooth speaker with 360-degree sound and waterproof design',
    4.5,
    true,
    22
  ),
  (
    'Travel Backpack',
    'travel-backpack',
    69.99,
    (SELECT id FROM public.categories WHERE slug = 'clothing'),
    'Travel Gear',
    'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=800',
    'Durable travel backpack with laptop compartment and USB charging port',
    4.4,
    true,
    14
  ),
  (
    'Programming Book Collection',
    'programming-book-collection',
    34.99,
    (SELECT id FROM public.categories WHERE slug = 'books'),
    'Technology',
    'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=800',
    'Complete collection of programming books covering modern web development',
    4.6,
    true,
    28
  )
ON CONFLICT (slug) DO NOTHING;

-- Update category product counts
UPDATE public.categories SET product_count = (
  SELECT COUNT(*) FROM public.products WHERE products.category_id = categories.id
);