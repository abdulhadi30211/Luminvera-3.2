/*
  # Database cleanup and optimization

  1. Cleanup
    - Remove redundant tables (users, Test-password)
    - Add performance indexes
    - Add data integrity constraints

  2. Categories
    - Update existing categories to match frontend
    - Add missing categories
    - Set up automatic product count updates

  3. Products
    - Add more sample products
    - Ensure proper categorization
    - Update product counts

  4. Performance
    - Add search indexes
    - Create automatic triggers for data consistency
*/

-- Remove redundant and test tables
DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public."Test-password" CASCADE;

-- Add missing indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_name_search ON public.products USING gin(to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_products_description_search ON public.products USING gin(to_tsvector('english', description));
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);
CREATE INDEX IF NOT EXISTS idx_products_rating ON public.products(rating DESC);
CREATE INDEX IF NOT EXISTS idx_cart_items_user_product ON public.cart_items(user_id, product_id);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);

-- Add check constraints for data integrity
DO $$
BEGIN
  -- Add price constraint if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'products_price_check'
    AND table_name = 'products'
  ) THEN
    ALTER TABLE public.products ADD CONSTRAINT products_price_check CHECK (price >= 0);
  END IF;

  -- Add rating constraint if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'products_rating_check'
    AND table_name = 'products'
  ) THEN
    ALTER TABLE public.products ADD CONSTRAINT products_rating_check CHECK (rating >= 0 AND rating <= 5);
  END IF;

  -- Add stock quantity constraint if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'products_stock_quantity_check'
    AND table_name = 'products'
  ) THEN
    ALTER TABLE public.products ADD CONSTRAINT products_stock_quantity_check CHECK (stock_quantity >= 0);
  END IF;

  -- Add cart items quantity constraint if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'cart_items_quantity_check'
    AND table_name = 'cart_items'
  ) THEN
    ALTER TABLE public.cart_items ADD CONSTRAINT cart_items_quantity_check CHECK (quantity > 0);
  END IF;
END $$;

-- First, let's see what categories we have and update them properly
-- Update existing categories to match frontend expectations
UPDATE public.categories SET 
  name = 'Home & Kitchen',
  image_url = 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=800'
WHERE slug = 'home-garden' AND NOT EXISTS (SELECT 1 FROM public.categories WHERE slug = 'home-kitchen');

UPDATE public.categories SET 
  name = 'Tech & Gadgets',
  image_url = 'https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg?auto=compress&cs=tinysrgb&w=800'
WHERE slug = 'electronics' AND NOT EXISTS (SELECT 1 FROM public.categories WHERE slug = 'tech-gadgets');

UPDATE public.categories SET 
  name = 'Fashion & Travel',
  image_url = 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800'
WHERE slug = 'clothing' AND NOT EXISTS (SELECT 1 FROM public.categories WHERE slug = 'fashion-travel');

-- Handle the slug updates more carefully to avoid conflicts
DO $$
BEGIN
  -- Update home-garden to home-kitchen if home-kitchen doesn't exist
  IF NOT EXISTS (SELECT 1 FROM public.categories WHERE slug = 'home-kitchen') THEN
    UPDATE public.categories SET slug = 'home-kitchen' WHERE slug = 'home-garden';
  END IF;
  
  -- Update electronics to tech-gadgets if tech-gadgets doesn't exist
  IF NOT EXISTS (SELECT 1 FROM public.categories WHERE slug = 'tech-gadgets') THEN
    UPDATE public.categories SET slug = 'tech-gadgets' WHERE slug = 'electronics';
  END IF;
  
  -- Update clothing to fashion-travel if fashion-travel doesn't exist
  IF NOT EXISTS (SELECT 1 FROM public.categories WHERE slug = 'fashion-travel') THEN
    UPDATE public.categories SET slug = 'fashion-travel' WHERE slug = 'clothing';
  END IF;
END $$;

-- Add missing categories (only if they don't exist)
INSERT INTO public.categories (name, slug, image_url, product_count) 
SELECT * FROM (VALUES
  ('Health & Beauty', 'health-beauty', 'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=800', 0),
  ('Baby & Family', 'baby-family', 'https://images.pexels.com/photos/1166473/pexels-photo-1166473.jpeg?auto=compress&cs=tinysrgb&w=800', 0),
  ('Pets & Outdoors', 'pets-outdoors', 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=800', 0),
  ('Auto & DIY', 'auto-diy', 'https://images.pexels.com/photos/1319460/pexels-photo-1319460.jpeg?auto=compress&cs=tinysrgb&w=800', 0),
  ('Office & Stationery', 'office-stationery', 'https://images.pexels.com/photos/159751/book-address-book-learning-learn-159751.jpeg?auto=compress&cs=tinysrgb&w=800', 0)
) AS new_categories(name, slug, image_url, product_count)
WHERE NOT EXISTS (
  SELECT 1 FROM public.categories WHERE categories.slug = new_categories.slug
);

-- Add more sample products for better variety (only if they don't exist)
INSERT INTO public.products (name, slug, price, category_id, subcategory, image_url, description, rating, in_stock, stock_quantity)
SELECT * FROM (VALUES
  (
    'Organic Face Moisturizer',
    'organic-face-moisturizer',
    29.99,
    (SELECT id FROM public.categories WHERE slug = 'health-beauty' LIMIT 1),
    'Skincare',
    'https://images.pexels.com/photos/3738347/pexels-photo-3738347.jpeg?auto=compress&cs=tinysrgb&w=800',
    'Natural organic face moisturizer with vitamin E and aloe vera',
    4.3,
    true,
    35
  ),
  (
    'Baby Soft Blanket',
    'baby-soft-blanket',
    24.99,
    (SELECT id FROM public.categories WHERE slug = 'baby-family' LIMIT 1),
    'Baby Care',
    'https://images.pexels.com/photos/1166473/pexels-photo-1166473.jpeg?auto=compress&cs=tinysrgb&w=800',
    'Ultra-soft hypoallergenic baby blanket made from organic cotton',
    4.8,
    true,
    18
  ),
  (
    'Wireless Gaming Mouse',
    'wireless-gaming-mouse',
    45.99,
    (SELECT id FROM public.categories WHERE slug IN ('tech-gadgets', 'electronics') LIMIT 1),
    'Gaming',
    'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=800',
    'High-precision wireless gaming mouse with RGB lighting',
    4.6,
    true,
    22
  ),
  (
    'Yoga Mat Premium',
    'yoga-mat-premium',
    39.99,
    (SELECT id FROM public.categories WHERE slug = 'sports-outdoors' LIMIT 1),
    'Fitness',
    'https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=800',
    'Non-slip premium yoga mat with alignment lines and carrying strap',
    4.5,
    true,
    16
  ),
  (
    'Ceramic Coffee Mug Set',
    'ceramic-coffee-mug-set',
    19.99,
    (SELECT id FROM public.categories WHERE slug IN ('home-kitchen', 'home-garden') LIMIT 1),
    'Drinkware',
    'https://images.pexels.com/photos/1251175/pexels-photo-1251175.jpeg?auto=compress&cs=tinysrgb&w=800',
    'Set of 4 elegant ceramic coffee mugs with modern design',
    4.4,
    true,
    28
  ),
  (
    'Pet Food Bowl Set',
    'pet-food-bowl-set',
    15.99,
    (SELECT id FROM public.categories WHERE slug = 'pets-outdoors' LIMIT 1),
    'Pet Supplies',
    'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=800',
    'Stainless steel pet food and water bowl set with non-slip base',
    4.2,
    true,
    24
  ),
  (
    'Car Phone Mount',
    'car-phone-mount',
    12.99,
    (SELECT id FROM public.categories WHERE slug = 'auto-diy' LIMIT 1),
    'Car Accessories',
    'https://images.pexels.com/photos/1319460/pexels-photo-1319460.jpeg?auto=compress&cs=tinysrgb&w=800',
    'Universal car phone mount with 360-degree rotation',
    4.1,
    true,
    32
  ),
  (
    'Notebook Set',
    'notebook-set',
    8.99,
    (SELECT id FROM public.categories WHERE slug = 'office-stationery' LIMIT 1),
    'Stationery',
    'https://images.pexels.com/photos/159751/book-address-book-learning-learn-159751.jpeg?auto=compress&cs=tinysrgb&w=800',
    'Set of 3 lined notebooks with hardcover and elastic band',
    4.0,
    true,
    40
  )
) AS new_products(name, slug, price, category_id, subcategory, image_url, description, rating, in_stock, stock_quantity)
WHERE NOT EXISTS (
  SELECT 1 FROM public.products WHERE products.slug = new_products.slug
) AND new_products.category_id IS NOT NULL;

-- Update all category product counts
UPDATE public.categories SET product_count = (
  SELECT COUNT(*) FROM public.products WHERE products.category_id = categories.id
);

-- Create a function to automatically update category product counts
CREATE OR REPLACE FUNCTION update_category_product_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Update count for old category (if exists)
  IF TG_OP = 'UPDATE' AND OLD.category_id IS NOT NULL THEN
    UPDATE public.categories 
    SET product_count = (
      SELECT COUNT(*) FROM public.products WHERE category_id = OLD.category_id
    )
    WHERE id = OLD.category_id;
  END IF;
  
  -- Update count for deleted product's category
  IF TG_OP = 'DELETE' AND OLD.category_id IS NOT NULL THEN
    UPDATE public.categories 
    SET product_count = (
      SELECT COUNT(*) FROM public.products WHERE category_id = OLD.category_id
    )
    WHERE id = OLD.category_id;
    RETURN OLD;
  END IF;
  
  -- Update count for new/updated category
  IF NEW.category_id IS NOT NULL THEN
    UPDATE public.categories 
    SET product_count = (
      SELECT COUNT(*) FROM public.products WHERE category_id = NEW.category_id
    )
    WHERE id = NEW.category_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update category product counts
DROP TRIGGER IF EXISTS update_category_count_on_product_change ON public.products;
CREATE TRIGGER update_category_count_on_product_change
  AFTER INSERT OR UPDATE OR DELETE ON public.products
  FOR EACH ROW EXECUTE FUNCTION update_category_product_count();