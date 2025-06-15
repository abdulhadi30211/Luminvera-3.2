/*
  # Seed initial data

  1. Categories
    - Insert initial product categories
  
  2. Products
    - Insert sample products for each category
*/

-- Insert categories
INSERT INTO categories (name, slug, image_url, product_count) VALUES
  ('Home & Kitchen', 'home-kitchen', 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=800', 245),
  ('Fashion & Travel', 'fashion-travel', 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800', 189),
  ('Health & Beauty', 'health-beauty', 'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=800', 156),
  ('Tech & Gadgets', 'tech-gadgets', 'https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg?auto=compress&cs=tinysrgb&w=800', 312),
  ('Baby & Family', 'baby-family', 'https://images.pexels.com/photos/1166473/pexels-photo-1166473.jpeg?auto=compress&cs=tinysrgb&w=800', 98),
  ('Pets & Outdoors', 'pets-outdoors', 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=800', 134),
  ('Auto & DIY', 'auto-diy', 'https://images.pexels.com/photos/1319460/pexels-photo-1319460.jpeg?auto=compress&cs=tinysrgb&w=800', 87),
  ('Office & Stationery', 'office-stationery', 'https://images.pexels.com/photos/159751/book-address-book-learning-learn-159751.jpeg?auto=compress&cs=tinysrgb&w=800', 123)
ON CONFLICT (slug) DO NOTHING;

-- Insert products
INSERT INTO products (name, slug, price, category_id, subcategory, image_url, description, rating, in_stock, stock_quantity) VALUES
  (
    'Premium Electric Kettle',
    'premium-electric-kettle',
    49.99,
    (SELECT id FROM categories WHERE slug = 'home-kitchen'),
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
    (SELECT id FROM categories WHERE slug = 'tech-gadgets'),
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
    (SELECT id FROM categories WHERE slug = 'fashion-travel'),
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
    (SELECT id FROM categories WHERE slug = 'tech-gadgets'),
    'Wearables',
    'https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg?auto=compress&cs=tinysrgb&w=800',
    'Advanced fitness tracking smartwatch with heart rate monitor, GPS, and sleep tracking',
    4.6,
    true,
    8
  ),
  (
    'Organic Anti-Aging Face Cream',
    'organic-anti-aging-face-cream',
    24.99,
    (SELECT id FROM categories WHERE slug = 'health-beauty'),
    'Skincare',
    'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=800',
    'Natural moisturizing face cream with SPF 30 protection and anti-aging properties',
    4.4,
    true,
    30
  ),
  (
    'Soft Plush Baby Toy',
    'soft-plush-baby-toy',
    19.99,
    (SELECT id FROM categories WHERE slug = 'baby-family'),
    'Toys',
    'https://images.pexels.com/photos/1166473/pexels-photo-1166473.jpeg?auto=compress&cs=tinysrgb&w=800',
    'Ultra-soft plush toy perfect for babies and toddlers, made with hypoallergenic materials',
    4.7,
    true,
    20
  ),
  (
    'Stainless Steel Coffee Maker',
    'stainless-steel-coffee-maker',
    79.99,
    (SELECT id FROM categories WHERE slug = 'home-kitchen'),
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
    (SELECT id FROM categories WHERE slug = 'tech-gadgets'),
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
    (SELECT id FROM categories WHERE slug = 'fashion-travel'),
    'Travel Gear',
    'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=800',
    'Durable travel backpack with laptop compartment and USB charging port',
    4.4,
    true,
    14
  ),
  (
    'Vitamin C Serum',
    'vitamin-c-serum',
    34.99,
    (SELECT id FROM categories WHERE slug = 'health-beauty'),
    'Skincare',
    'https://images.pexels.com/photos/3757957/pexels-photo-3757957.jpeg?auto=compress&cs=tinysrgb&w=800',
    'Brightening vitamin C serum with hyaluronic acid for radiant skin',
    4.6,
    true,
    28
  )
ON CONFLICT (slug) DO NOTHING;