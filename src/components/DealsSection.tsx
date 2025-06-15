import React from 'react';

const DealsSection: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
          <div className="space-y-6">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Shop the
              <br />
              <span className="text-primary-600">Latest Deals</span>
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Discover new arrivals and
              <br />
              best-selling products
            </p>
            <button className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
              Shop Now
            </button>
          </div>
          
          {/* Featured product showcase */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <img
                  src="https://images.pexels.com/photos/3945667/pexels-photo-3945667.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Featured Product"
                  className="w-full h-40 object-cover rounded-xl"
                />
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <img
                  src="https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Featured Product"
                  className="w-full h-40 object-cover rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Product categories showcase */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { name: 'Home & Kitchen', image: 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=800' },
            { name: 'Gadgets & Tech', image: 'https://images.pexels.com/photos/3945667/pexels-photo-3945667.jpeg?auto=compress&cs=tinysrgb&w=800' },
            { name: 'Fashion & Travel', image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800' },
            { name: 'Baby & Kids', image: 'https://images.pexels.com/photos/1166473/pexels-photo-1166473.jpeg?auto=compress&cs=tinysrgb&w=800' }
          ].map((category) => (
            <div key={category.name} className="group cursor-pointer">
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 group-hover:text-primary-600 transition-colors">
                  {category.name}
                </h3>
                <div className="aspect-square overflow-hidden rounded-xl">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Health & Beauty section */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Health &
                <br />
                <span className="text-primary-600">Beauty</span>
              </h3>
              <p className="text-gray-600 mb-6">
                Premium skincare and wellness products for your daily routine
              </p>
              <button className="text-primary-600 font-semibold hover:text-primary-700 transition-colors">
                Explore Collection →
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <img
                src="https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Beauty Product"
                className="w-full h-32 object-cover rounded-xl"
              />
              <img
                src="https://images.pexels.com/photos/3757957/pexels-photo-3757957.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Beauty Product"
                className="w-full h-32 object-cover rounded-xl"
              />
              <img
                src="https://images.pexels.com/photos/3738347/pexels-photo-3738347.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Beauty Product"
                className="w-full h-32 object-cover rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DealsSection;