import React, { useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';
import AOS from "aos";
import "aos/dist/aos.css";

const testimonials = [
  {
    id: 1,
    name: "John Doe",
    review: "The food here is absolutely incredible! Every dish is packed with flavor and made with fresh ingredients. The service was exceptional too!",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    rating: 5,
    location: "Food Critic"
  },
  {
    id: 2,
    name: "Jane Smith",
    review: "I'm obsessed with their desserts! The chocolate lava cake is to die for. Perfect balance of sweetness and texture. Will definitely order again!",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    rating: 5,
    location: "Regular Customer"
  },
  {
    id: 3,
    name: "Mark Lee",
    review: "Impressed by the fast delivery and quality. Food arrived hot and fresh, exactly as described. The packaging was eco-friendly too!",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    rating: 4,
    location: "Business Professional"
  },
  {
    id: 4,
    name: "Sara Khan",
    review: "The seafood platter is a must-try! Fresh, perfectly cooked, and beautifully presented. This has become our family's favorite restaurant!",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
    rating: 5,
    location: "Food Enthusiast"
  },
  {
    id: 5,
    name: "Alex Johnson",
    review: "From the ambiance to the food quality, everything was perfect. The staff went above and beyond to make our anniversary special. Highly recommended!",
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
    rating: 5,
    location: "Local Resident"
  },
  {
    id: 6,
    name: "Emily Davis",
    review: "The cozy atmosphere made our family dinner unforgettable. Kids loved the special menu, and adults enjoyed the sophisticated flavors. Perfect for everyone!",
    avatar: "https://randomuser.me/api/portraits/women/6.jpg",
    rating: 5,
    location: "Family Visitor"
  },
];

const Testimonials = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000, once: false });
  }, []);

  const handleOrderNow = () => {
    if (user) {
      // User is logged in - go directly to all foods
      navigate("/all-foods");
    } else {
      // User not logged in - go to login with redirect back to all-foods
      navigate("/login", { state: { from: "/all-foods" } });
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`text-lg ${index < rating ? 'text-amber-500' : 'text-gray-300'
          }`}
      >
        ★
      </span>
    ));
  };

  return (
    <section className="bg-gradient-to-br from-amber-50 to-orange-50 py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-6 py-2 bg-amber-100 rounded-full border border-amber-200 mb-6">
            <span className="text-amber-700 text-sm font-semibold">⭐ Customer Love</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            What Our <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Customers Say</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our valued customers have to say about their experience.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-6 border border-amber-100 hover:border-amber-200 transform hover:-translate-y-2 h-full flex flex-col">
                {/* Rating Stars */}
                <div className="flex justify-center mb-4">
                  <div className="flex space-x-1">
                    {renderStars(testimonial.rating)}
                  </div>
                </div>

                {/* Review Text */}
                <div className="flex-1 mb-6">
                  <p className="text-gray-600 leading-relaxed text-center italic relative">
                    <span className="text-amber-400 text-2xl absolute -left-2 -top-2">"</span>
                    {testimonial.review}
                    <span className="text-amber-400 text-2xl absolute -right-2 -bottom-2">"</span>
                  </p>
                </div>

                {/* Customer Info */}
                <div className="text-center mt-auto">
                  <div className="flex items-center justify-center space-x-4 mb-3">
                    <div className="relative">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-amber-400 shadow-md"
                      />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    </div>
                    <div className="text-left">
                      <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                      <p className="text-amber-600 text-sm">{testimonial.location}</p>
                    </div>
                  </div>
                </div>

                {/* Decorative Quote Icon */}
                <div className="absolute top-4 right-4 opacity-10">
                  <svg className="w-8 h-8 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="bg-white rounded-2xl shadow-lg border border-amber-200 p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Why Customers Love Us</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">4.9/5</div>
                <div className="text-gray-600 text-sm">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">2K+</div>
                <div className="text-gray-600 text-sm">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">98%</div>
                <div className="text-gray-600 text-sm">Would Recommend</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">24/7</div>
                <div className="text-gray-600 text-sm">Support</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 mb-6">Ready to experience it yourself?</p>
          <motion.button
            onClick={handleOrderNow}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-amber-500/25 transition-all duration-300"
          >
            Order Now & Join Our Happy Customers
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;