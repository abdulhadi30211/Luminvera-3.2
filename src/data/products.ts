import { Product, Category } from '../types';

export const categories: Category[] = [
  {
    id: 'home-kitchen',
    name: 'Home & Kitchen',
    image: 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=800',
    productCount: 245
  },
  {
    id: 'fashion-travel',
    name: 'Fashion & Travel',
    image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800',
    productCount: 189
  },
  {
    id: 'health-beauty',
    name: 'Health & Beauty',
    image: 'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=800',
    productCount: 156
  },
  {
    id: 'tech-gadgets',
    name: 'Tech & Gadgets',
    image: 'https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg?auto=compress&cs=tinysrgb&w=800',
    productCount: 312
  },
  {
    id: 'baby-family',
    name: 'Baby & Family',
    image: 'https://images.pexels.com/photos/1166473/pexels-photo-1166473.jpeg?auto=compress&cs=tinysrgb&w=800',
    productCount: 98
  },
  {
    id: 'pets-outdoors',
    name: 'Pets & Outdoors',
    image: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=800',
    productCount: 134
  },
  {
    id: 'auto-diy',
    name: 'Auto & DIY',
    image: 'https://images.pexels.com/photos/1319460/pexels-photo-1319460.jpeg?auto=compress&cs=tinysrgb&w=800',
    productCount: 87
  },
  {
    id: 'office-stationery',
    name: 'Office & Stationery',
    image: 'https://images.pexels.com/photos/159751/book-address-book-learning-learn-159751.jpeg?auto=compress&cs=tinysrgb&w=800',
    productCount: 123
  }
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Premium Electric Kettle',
    price: 49.99,
    category: 'Home & Kitchen',
    subcategory: 'Kitchen Appliances',
    image: 'https://images.pexels.com/photos/6315801/pexels-photo-6315801.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Stainless steel electric kettle with temperature control',
    rating: 4.5,
    inStock: true
  },
  {
    id: '2',
    name: 'Wireless Headphones',
    price: 129.99,
    category: 'Tech & Gadgets',
    subcategory: 'Audio',
    image: 'https://images.pexels.com/photos/3945667/pexels-photo-3945667.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Noise-cancelling wireless headphones with premium sound',
    rating: 4.8,
    inStock: true
  },
  {
    id: '3',
    name: 'Leather Handbag',
    price: 89.99,
    category: 'Fashion & Travel',
    subcategory: 'Bags',
    image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Genuine leather handbag with multiple compartments',
    rating: 4.3,
    inStock: true
  },
  {
    id: '4',
    name: 'Smart Watch',
    price: 199.99,
    category: 'Tech & Gadgets',
    subcategory: 'Wearables',
    image: 'https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Fitness tracking smartwatch with heart rate monitor',
    rating: 4.6,
    inStock: true
  },
  {
    id: '5',
    name: 'Organic Face Cream',
    price: 24.99,
    category: 'Health & Beauty',
    subcategory: 'Skincare',
    image: 'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Natural moisturizing face cream with SPF protection',
    rating: 4.4,
    inStock: true
  },
  {
    id: '6',
    name: 'Baby Soft Toy',
    price: 19.99,
    category: 'Baby & Family',
    subcategory: 'Toys',
    image: 'https://images.pexels.com/photos/1166473/pexels-photo-1166473.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Soft plush toy perfect for babies and toddlers',
    rating: 4.7,
    inStock: true
  }
];