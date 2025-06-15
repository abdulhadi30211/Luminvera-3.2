import React, { useState, useEffect } from 'react';
import {
  X, Heart, Share2, ShoppingCart, Star, Plus, Minus, Truck,
  Shield, RotateCcw, ZoomIn, ChevronLeft, ChevronRight,
  MapPin, Clock, Award, Users
} from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { useWishlist } from '../hooks/useWishlist';
import { Database } from '../types/database';


type Product = Database['public']['Tables']['products']['Row'] & {
  categories?: Database['public']['Tables']['categories']['Row'];
};

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAuthRequired: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose, onAuthRequired }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews'>('description');
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [deliveryLocation, setDeliveryLocation] = useState('');

  // Mock data for enhanced features
  const mockImages = [
    product?.image_url || '',
    'https://images.pexels.com/photos/3945667/pexels-photo-3945667.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg?auto=compress&cs=tinysrgb&w=800',
  ];

  const mockVariants = ['Standard', 'Premium', 'Pro'];
  const mockReviews = [
    {
      id: 1,
      user: 'John D.',
      rating: 5,
      comment: 'Excellent product! Highly recommended.',
      date: '2024-01-15',
      verified: true,
      helpful: 12
    },
    {
      id: 2,
      user: 'Sarah M.',
      rating: 4,
      comment: 'Good quality, fast delivery.',
      date: '2024-01-10',
      verified: true,
      helpful: 8
    }
  ];

  const discountPercentage = Math.floor(Math.random() * 30) + 10;
  const originalPrice = product ? product.price * (1 + discountPercentage / 100) : 0;
  const hasDiscount = Math.random() > 0.7;
  const isWishlisted = product ? isInWishlist(product.id) : false;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const handleAddToCart = async () => {
    if (!user) {
      onAuthRequired();
      return;
    }
    await addToCart(product.id, quantity);
    onClose();
  };

  const handleWishlistToggle = async () => {
    if (!user) {
      onAuthRequired();
      return;
    }
    
    if (isWishlisted) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product.id);
    }
  };

  const handleShare = async () => {
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

  const ratingBreakdown = [
    { stars: 5, count: 45, percentage: 60 },
    { stars: 4, count: 20, percentage: 27 },
    { stars: 3, count: 8, percentage: 11 },
    { stars: 2, count: 1, percentage: 1 },
    { stars: 1, count: 1, percentage: 1 },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden">
        <div className="flex h-full">
          {/* Left Side - Images */}
          <div className="w-1/2 p-6 border-r border-gray-200">
            <div className="relative">
              {/* Main Image */}
              <div className="relative aspect-square mb-4 bg-gray-100 rounded-xl overflow-hidden">
                <img
                  src={mockImages[selectedImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover cursor-zoom-in"
                  onClick={() => setIsImageZoomed(true)}
                />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {hasDiscount && (
                    <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                      {discountPercentage}% OFF
                    </span>
                  )}
                  {product.stock_quantity < 10 && product.stock_quantity > 0 && (
                    <span className="bg-orange-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                      Low Stock
                    </span>
                  )}
                </div>

                {/* Zoom Icon */}
                <button
                  onClick={() => setIsImageZoomed(true)}
                  className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                >
                  <ZoomIn className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Thumbnail Images */}
              <div className="flex gap-2 overflow-x-auto">
                {mockImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === index
                        ? 'border-primary-500'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Product Details */}
          <div className="w-1/2 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Brand & Category */}
              <div className="mb-4">
                <span className="text-sm text-gray-500 uppercase tracking-wider">
                  {product.categories?.name || product.subcategory}
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-medium text-primary-600">Brand Name</span>
                  <Award className="w-4 h-4 text-primary-600" />
                </div>
              </div>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  {renderStars(product.rating || 0)}
                  <span className="text-lg font-semibold ml-2">{product.rating || 0}</span>
                </div>
                <span className="text-gray-600">
                  ({Math.floor(Math.random() * 500) + 50} reviews)
                </span>
                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  See all reviews
                </button>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl font-bold text-primary-600">
                    ${product.price}
                  </span>
                  {hasDiscount && (
                    <>
                      <span className="text-xl text-gray-500 line-through">
                        ${originalPrice.toFixed(2)}
                      </span>
                      <span className="bg-red-100 text-red-600 text-sm font-bold px-2 py-1 rounded">
                        Save ${(originalPrice - product.price).toFixed(2)}
                      </span>
                    </>
                  )}
                </div>
                <p className="text-sm text-gray-600">Inclusive of all taxes</p>
              </div>

              {/* Variants */}
              {mockVariants.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Select Variant:</h3>
                  <div className="flex gap-2">
                    {mockVariants.map((variant) => (
                      <button
                        key={variant}
                        onClick={() => setSelectedVariant(variant)}
                        className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                          selectedVariant === variant
                            ? 'border-primary-500 bg-primary-50 text-primary-600'
                            : 'border-gray-300 text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        {variant}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity & Actions */}
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                      className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <span className={`text-sm font-medium ${
                    product.in_stock && product.stock_quantity > 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}>
                    {product.in_stock && product.stock_quantity > 0
                      ? `${product.stock_quantity} available`
                      : 'Out of stock'
                    }
                  </span>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={!product.in_stock || product.stock_quantity === 0}
                    className="flex-1 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </button>
                  
                  <button
                    onClick={handleWishlistToggle}
                    className={`p-3 border rounded-lg transition-colors ${
                      isWishlisted
                        ? 'border-red-500 bg-red-50 text-red-500'
                        : 'border-gray-300 text-gray-600 hover:border-red-300 hover:text-red-500'
                    }`}
                  >
                    <Heart className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={handleShare}
                    className="p-3 border border-gray-300 text-gray-600 hover:border-blue-300 hover:text-blue-500 rounded-lg transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Delivery Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Truck className="w-4 h-4 text-green-600" />
                    <span className="text-green-600 font-medium">Free Delivery</span>
                    <span className="text-gray-600">by Tomorrow, 11 PM</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="text-gray-600">Order within 2 hours for same day dispatch</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-600" />
                    <input
                      type="text"
                      placeholder="Enter delivery pincode"
                      value={deliveryLocation}
                      onChange={(e) => setDeliveryLocation(e.target.value)}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    <button className="text-primary-600 text-sm font-medium">Check</button>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Key Features</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <RotateCcw className="w-4 h-4 text-green-600" />
                    <span className="text-gray-600">7 Day Return</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="w-4 h-4 text-blue-600" />
                    <span className="text-gray-600">1 Year Warranty</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Award className="w-4 h-4 text-purple-600" />
                    <span className="text-gray-600">Authentic</span>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="mb-6">
                <div className="flex border-b border-gray-200 mb-4">
                  {[
                    { id: 'description', label: 'Description' },
                    { id: 'specifications', label: 'Specifications' },
                    { id: 'reviews', label: 'Reviews' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === tab.id
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="text-sm text-gray-700">
                  {activeTab === 'description' && (
                    <div>
                      <p className="mb-4">{product.description}</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>High-quality materials and construction</li>
                        <li>Advanced features for enhanced performance</li>
                        <li>Ergonomic design for comfortable use</li>
                        <li>Energy efficient and environmentally friendly</li>
                      </ul>
                    </div>
                  )}
                  
                  {activeTab === 'specifications' && (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">Brand:</span>
                        <span>Brand Name</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Model:</span>
                        <span>Model XYZ-123</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Dimensions:</span>
                        <span>10 x 8 x 6 inches</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Weight:</span>
                        <span>2.5 lbs</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Material:</span>
                        <span>Premium Grade A</span>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'reviews' && (
                    <div>
                      {/* Rating Summary */}
                      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-gray-900">{product.rating}</div>
                            <div className="flex items-center justify-center mb-1">
                              {renderStars(product.rating || 0)}
                            </div>
                            <div className="text-sm text-gray-600">75 reviews</div>
                          </div>
                          
                          <div className="flex-1">
                            {ratingBreakdown.map((item) => (
                              <div key={item.stars} className="flex items-center gap-2 mb-1">
                                <span className="text-sm w-6">{item.stars}★</span>
                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-yellow-400 h-2 rounded-full"
                                    style={{ width: `${item.percentage}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm text-gray-600 w-8">{item.count}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Individual Reviews */}
                      <div className="space-y-4">
                        {mockReviews.map((review) => (
                          <div key={review.id} className="border-b border-gray-200 pb-4">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex items-center">
                                {renderStars(review.rating)}
                              </div>
                              <span className="font-medium text-gray-900">{review.user}</span>
                              {review.verified && (
                                <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                                  Verified Purchase
                                </span>
                              )}
                            </div>
                            <p className="text-gray-700 mb-2">{review.comment}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>{review.date}</span>
                              <button className="flex items-center gap-1 hover:text-gray-700">
                                <Users className="w-3 h-3" />
                                Helpful ({review.helpful})
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Zoom Modal */}
      {isImageZoomed && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-60">
          <button
            onClick={() => setIsImageZoomed(false)}
            className="absolute top-4 right-4 text-white p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="relative max-w-4xl max-h-4xl">
            <img
              src={mockImages[selectedImageIndex]}
              alt={product.name}
              className="max-w-full max-h-full object-contain"
            />
            
            {mockImages.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImageIndex((prev) => 
                    prev === 0 ? mockImages.length - 1 : prev - 1
                  )}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                
                <button
                  onClick={() => setSelectedImageIndex((prev) => 
                    prev === mockImages.length - 1 ? 0 : prev + 1
                  )}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductModal;