import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-gray-50 to-white py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Shop All
                <br />
                <span className="text-primary-600">Categories</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Discover our wide selection of products
              </p>
            </div>
            
            <button className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              Shop Now
            </button>
          </div>

          {/* Product showcase */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              {/* Main product - Electric Kettle */}
              <div className="col-span-2 bg-white rounded-2xl p-6 shadow-lg">
                <img
                  src="https://images.pexels.com/photos/6315801/pexels-photo-6315801.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Electric Kettle"
                  className="w-full h-48 object-cover rounded-xl"
                />
              </div>
              
              {/* Secondary products */}
              <div className="bg-white rounded-2xl p-4 shadow-lg">
                <img
                  src="https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Fashion Item"
                  className="w-full h-32 object-cover rounded-lg"
                />
              </div>
              
              <div className="bg-white rounded-2xl p-4 shadow-lg">
                <img
                  src="https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Tech Gadget"
                  className="w-full h-32 object-cover rounded-lg"
                />
              </div>
            </div>
            
            {/* Floating elements for visual interest */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary-100 rounded-full opacity-50"></div>
            <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-primary-200 rounded-full opacity-30"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;