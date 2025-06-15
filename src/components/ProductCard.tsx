import React, { useState } from 'react';
import { Heart, Share2, Eye, ShoppingCart, Star, Truck, Shield, RotateCcw } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { useWishlist } from '../hooks/useWishlist';
import { Database } from '../types/database';

type Product = Database['public']['Tables']['products']['Row'] & {
  categories?: Database['public']['Tables']['categories']['Row'];
};

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails, className = '' }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const isWishlisted = isInWishlist(product.id);
  const discountPercentage = Math.floor(Math.random() * 30) + 10; // Mock discount
  const originalPrice = product.price * (1 + discountPercentage / 100);
  const hasDiscount = Math.random() > 0.7; // 30% chance of discount

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      alert('Please sign in to add items to cart');
      return;
    }
    await addToCart(product.id, 1);
  };

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      alert('Please sign in to add items to wishlist');
      return;
    }
    
    if (isWishlisted) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product.id);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      await navigator.share({
        title: product.name,
        text: product.description || '',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Product link copied to clipboard!');
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : i < rating
            ? 'text-yellow-400 fill-current opacity-50'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div
      className={`group cursor-pointer bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onViewDetails(product)}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
          </div>
        )}
        
        <img
          src={product.image_url || ''}
          alt={product.name}
          className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {hasDiscount && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {discountPercentage}% OFF
            </span>
          )}
          {product.stock_quantity < 10 && product.stock_quantity > 0 && (
            <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              Low Stock
            </span>
          )}
          {!product.in_stock && (
            <span className="bg-gray-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              Out of Stock
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className={`absolute top-3 right-3 flex flex-col gap-2 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <button
            onClick={handleWishlistToggle}
            className={`p-2 rounded-full shadow-lg transition-colors ${
              isWishlisted
                ? 'bg-red-500 text-white'
                : 'bg-white text-gray-600 hover:text-red-500'
            }`}
          >
            <Heart className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleShare}
            className="p-2 bg-white text-gray-600 hover:text-blue-500 rounded-full shadow-lg transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(product);
            }}
            className="p-2 bg-white text-gray-600 hover:text-green-500 rounded-full shadow-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Add to Cart */}
        {isHovered && product.in_stock && (
          <div className="absolute bottom-3 left-3 right-3">
            <button
              onClick={handleAddToCart}
              className="w-full bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              Quick Add
            </button>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Category */}
        <div className="mb-2">
          <span className="text-xs text-gray-500 uppercase tracking-wider">
            {product.categories?.name || product.subcategory}
          </span>
        </div>

        {/* Product Name */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            {renderStars(product.rating || 0)}
          </div>
          <span className="text-sm text-gray-600">
            ({product.rating || 0})
          </span>
          <span className="text-xs text-gray-500">
            ({Math.floor(Math.random() * 500) + 50} reviews)
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl font-bold text-primary-600">
            ${product.price}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-500 line-through">
              ${originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Features */}
        <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
          <div className="flex items-center gap-1">
            <Truck className="w-3 h-3" />
            <span>Free Shipping</span>
          </div>
          <div className="flex items-center gap-1">
            <RotateCcw className="w-3 h-3" />
            <span>7 Day Return</span>
          </div>
          <div className="flex items-center gap-1">
            <Shield className="w-3 h-3" />
            <span>Warranty</span>
          </div>
        </div>

        {/* Stock Status */}
        <div className="flex items-center justify-between">
          <span className={`text-sm font-medium ${
            product.in_stock && product.stock_quantity > 0
              ? 'text-green-600'
              : 'text-red-600'
          }`}>
            {product.in_stock && product.stock_quantity > 0
              ? `${product.stock_quantity} in stock`
              : 'Out of stock'
            }
          </span>
          
          {product.stock_quantity < 10 && product.stock_quantity > 0 && (
            <span className="text-xs text-orange-600 font-medium">
              Only {product.stock_quantity} left!
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;