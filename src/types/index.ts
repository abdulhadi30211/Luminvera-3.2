export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  subcategory: string;
  image: string;
  description: string;
  rating: number;
  inStock: boolean;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  productCount: number;
}