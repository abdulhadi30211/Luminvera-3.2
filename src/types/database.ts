export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      cart_items: {
        Row: {
          id: string
          user_id: string
          product_id: string
          quantity: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          quantity: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          quantity?: number
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          image_url: string | null
          product_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          image_url?: string | null
          product_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          image_url?: string | null
          product_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          price: number
          category_id: string | null
          subcategory: string | null
          image_url: string | null
          rating: number
          in_stock: boolean
          stock_quantity: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          price: number
          category_id?: string | null
          subcategory?: string | null
          image_url?: string | null
          rating?: number
          in_stock?: boolean
          stock_quantity?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          price?: number
          category_id?: string | null
          subcategory?: string | null
          image_url?: string | null
          rating?: number
          in_stock?: boolean
          stock_quantity?: number
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          username: string
          full_name: string | null
          role: 'user' | 'seller' | 'publisher' | 'admin'
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          username: string
          full_name?: string | null
          role?: 'user' | 'seller' | 'publisher' | 'admin'
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          username?: string
          full_name?: string | null
          role?: 'user' | 'seller' | 'publisher' | 'admin'
          created_at?: string | null
          updated_at?: string | null
        }
      }
      wishlist_items: {
        Row: {
          id: string
          user_id: string
          product_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'user' | 'seller' | 'publisher' | 'admin'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}