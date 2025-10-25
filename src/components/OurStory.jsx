import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const OurStory = () => {
  const navigate = useNavigate();
  const [showVisitOptions, setShowVisitOptions] = useState(false);

  const handleVisitRestaurant = () => {
    setShowVisitOptions(true);
  };

  const handleAction = (action) => {
    setShowVisitOptions(false);
    switch (action) {
      case 'location':
        navigate("/contact");
        break;
      case 'reservation':
        navigate("/reservation");
        break;
      case 'directions':
        const address = "123+Restaurant+Street+Food+City+FC+12345";
        window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank');
        break;
      case 'hours':
        navigate("/contact#hours");
        break;
      default:
        break;
    }
  };

  return (
    <section className="bg-gradient-to-br from-amber-50 to-orange-50 py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-6 py-2 bg-amber-100 rounded-full border border-amber-200 mb-6">
            <span className="text-amber-700 text-sm font-semibold">📖 Our Journey</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Our <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Story</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            From humble beginnings to becoming your favorite dining destination
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Text Section */}
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {/* Story Timeline */}
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-sm">2010</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">The Beginning</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Established in 2010, <span className="font-semibold text-amber-700">TasteHub</span> started as a small family-owned restaurant with a simple mission: to serve exceptional cuisine made with fresh, locally sourced ingredients.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white text-lg">👨‍🍳</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Culinary Excellence</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Our talented chefs craft each dish with passion, blending traditional recipes with modern culinary techniques. From classic comfort foods to innovative specialties, there's something for every palate.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white text-lg">❤️</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Our Philosophy</h3>
                    <p className="text-gray-600 leading-relaxed">
                      We believe food is an art that brings people together. Our commitment goes beyond great food — we create an environment where friends and families can relax, celebrate, and enjoy quality time.
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-6 pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">13+</div>
                  <div className="text-gray-600 text-sm">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">50K+</div>
                  <div className="text-gray-600 text-sm">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">100+</div>
                  <div className="text-gray-600 text-sm">Menu Items</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">24/7</div>
                  <div className="text-gray-600 text-sm">Support</div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="pt-6">
                <motion.button
                  onClick={handleVisitRestaurant}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-amber-500/25 transition-all duration-300"
                >
                  Visit Our Restaurant
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Images Grid */}
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Main Image */}
              <motion.div
                className="relative mb-8"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img
                  src="https://i.ibb.co.com/nMBN7QKL/restaurant-interior-1.jpg"
                  alt="Restaurant interior with cozy seating"
                  className="rounded-2xl shadow-2xl w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h4 className="font-bold text-lg">Cozy Ambiance</h4>
                  <p className="text-sm">Perfect for family gatherings</p>
                </div>
              </motion.div>

              {/* Secondary Images */}
              <div className="grid grid-cols-2 gap-6">
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <img
                    src="https://i.ibb.co.com/j93BCTYL/chef-cooking-kitchen-while-wearing-professional-attire.jpg"
                    alt="Chef preparing fresh food"
                    className="rounded-2xl shadow-lg w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-2xl"></div>
                  <div className="absolute bottom-3 left-3 text-white">
                    <h4 className="font-semibold text-sm">Expert Chefs</h4>
                  </div>
                </motion.div>

                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                    alt="Delicious food presentation"
                    className="rounded-2xl shadow-lg w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-2xl"></div>
                  <div className="absolute bottom-3 left-3 text-white">
                    <h4 className="font-semibold text-sm">Fresh Dishes</h4>
                  </div>
                </motion.div>
              </div>

              {/* Floating Decorative Elements */}
              <motion.div
                className="absolute -top-4 -right-4 w-20 h-20 bg-amber-200 rounded-full opacity-20"
                animate={{
                  y: [0, -20, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute -bottom-4 -left-4 w-16 h-16 bg-orange-200 rounded-full opacity-20"
                animate={{
                  y: [0, 15, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              />
            </motion.div>
          </div>
        </div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="bg-white rounded-2xl shadow-lg border border-amber-200 p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h3>
            <p className="text-gray-600 text-lg leading-relaxed max-w-3xl mx-auto">
              "To create unforgettable dining experiences by combining exceptional cuisine, warm hospitality,
              and a welcoming atmosphere where every guest feels like family. We're committed to sustainability,
              community, and the art of bringing people together through the joy of food."
            </p>
          </div>
        </motion.div>
      </div>

      {/* Visit Options Modal */}
      {showVisitOptions && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-2xl border border-amber-200 flex flex-col max-h-[90vh] w-full max-w-md mx-auto"
          >
            {/* Modal Header - Fixed */}
            <div className="flex-shrink-0 p-6 border-b border-amber-200 bg-white rounded-t-2xl">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white">🏪</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Visit Us</h3>
                <p className="text-gray-600">Choose how you'd like to visit</p>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-3">
                <button
                  onClick={() => handleAction('location')}
                  className="w-full p-4 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl text-left transition-all duration-300 group hover:shadow-md"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-lg">📍</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-800 group-hover:text-amber-700 truncate">View Location</h4>
                      <p className="text-sm text-gray-600 mt-1">See address & contact info</p>
                    </div>
                    <div className="text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleAction('reservation')}
                  className="w-full p-4 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl text-left transition-all duration-300 group hover:shadow-md"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-lg">📅</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-800 group-hover:text-amber-700 truncate">Make Reservation</h4>
                      <p className="text-sm text-gray-600 mt-1">Book your table online</p>
                    </div>
                    <div className="text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleAction('directions')}
                  className="w-full p-4 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl text-left transition-all duration-300 group hover:shadow-md"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-lg">🗺️</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-800 group-hover:text-amber-700 truncate">Get Directions</h4>
                      <p className="text-sm text-gray-600 mt-1">Open in Google Maps</p>
                    </div>
                    <div className="text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleAction('hours')}
                  className="w-full p-4 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl text-left transition-all duration-300 group hover:shadow-md"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-lg">⏰</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-800 group-hover:text-amber-700 truncate">View Hours</h4>
                      <p className="text-sm text-gray-600 mt-1">See opening times</p>
                    </div>
                    <div className="text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </button>

                {/* Additional Options for Better Scroll Demonstration */}
                <button
                  onClick={() => handleAction('menu')}
                  className="w-full p-4 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl text-left transition-all duration-300 group hover:shadow-md"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-lg">📋</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-800 group-hover:text-amber-700 truncate">View Menu</h4>
                      <p className="text-sm text-gray-600 mt-1">Browse our food options</p>
                    </div>
                    <div className="text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleAction('events')}
                  className="w-full p-4 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl text-left transition-all duration-300 group hover:shadow-md"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-lg">🎉</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-800 group-hover:text-amber-700 truncate">Special Events</h4>
                      <p className="text-sm text-gray-600 mt-1">See upcoming events & offers</p>
                    </div>
                    <div className="text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleAction('catering')}
                  className="w-full p-4 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl text-left transition-all duration-300 group hover:shadow-md"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-lg">🍽️</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-800 group-hover:text-amber-700 truncate">Catering Services</h4>
                      <p className="text-sm text-gray-600 mt-1">Book catering for events</p>
                    </div>
                    <div className="text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleAction('gallery')}
                  className="w-full p-4 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl text-left transition-all duration-300 group hover:shadow-md"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-lg">🖼️</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-800 group-hover:text-amber-700 truncate">Photo Gallery</h4>
                      <p className="text-sm text-gray-600 mt-1">See our restaurant photos</p>
                    </div>
                    <div className="text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Footer - Fixed */}
            <div className="flex-shrink-0 p-6 border-t border-amber-200 bg-white rounded-b-2xl">
              <button
                onClick={() => setShowVisitOptions(false)}
                className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors duration-300 hover:border-gray-400"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default OurStory;