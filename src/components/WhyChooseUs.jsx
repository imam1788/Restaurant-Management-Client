import React, { useEffect, useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";
import freshIcon from '../assets/fresh.png';
import deliveryIcon from '../assets/delivery-bike.png';
import priceIcon from '../assets/best-price.png';
import chefIcon from '../assets/cooking.png';
import contactIcon from '../assets/telephone.png';
import earthIcon from '../assets/earth.png';
import AOS from "aos";
import "aos/dist/aos.css";

const reasons = [
  {
    id: 1,
    title: "Fresh Ingredients",
    description: "We use only the freshest and highest quality ingredients in all our dishes.",
    icon: freshIcon,
    color: "from-green-500 to-emerald-600",
    emoji: "🥬"
  },
  {
    id: 2,
    title: "Fast Delivery",
    description: "Enjoy quick and reliable delivery straight to your doorstep.",
    icon: deliveryIcon,
    color: "from-blue-500 to-cyan-600",
    emoji: "🚚"
  },
  {
    id: 3,
    title: "Affordable Prices",
    description: "Delicious meals at prices that won't break your budget.",
    icon: priceIcon,
    color: "from-amber-500 to-orange-600",
    emoji: "💰"
  },
  {
    id: 4,
    title: "Expert Chefs",
    description: "Our experienced chefs craft every dish with passion and skill.",
    icon: chefIcon,
    color: "from-red-500 to-cyan-600",
    emoji: "👨‍🍳"
  },
  {
    id: 5,
    title: "Customer Support",
    description: "We are here 24/7 to assist you with any questions or concerns.",
    icon: contactIcon,
    color: "from-purple-500 to-indigo-600",
    emoji: "📞"
  },
  {
    id: 6,
    title: "Variety of Cuisines",
    description: "Explore a wide range of cuisines from around the world.",
    icon: earthIcon,
    color: "from-teal-500 to-green-600",
    emoji: "🌎"
  },
];

const WhyChooseUs = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showQuickOrder, setShowQuickOrder] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800, once: false });
  }, []);

  const handleOrderNow = () => {
    if (user) {
      // User is logged in - show quick order modal
      setShowQuickOrder(true);
    } else {
      // User not logged in - go to login with redirect back to all-foods
      navigate("/login", { state: { from: "/all-foods" } });
    }
  };

  const handleLearnMore = () => {
    navigate("/about");
  };

  const handleQuickAction = (action) => {
    setShowQuickOrder(false);
    switch (action) {
      case 'all-foods':
        navigate("/all-foods");
        break;
      case 'top-foods':
        navigate("/all-foods?filter=top");
        break;
      case 'categories':
        navigate("/all-foods?filter=categories");
        break;
      default:
        navigate("/all-foods");
    }
  };

  return (
    <section className="bg-gradient-to-br from-amber-50 to-orange-50 py-16 relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16" data-aos="fade-down">
          <div className="inline-flex items-center px-6 py-2 bg-amber-100 rounded-full border border-amber-200 mb-6">
            <span className="text-amber-700 text-sm font-semibold">🌟 Why We're The Best</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Why Choose <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">TasteHub</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover what makes us different and why thousands of customers choose us for their dining experience.
          </p>
        </div>

        {/* Reasons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map(({ id, title, description, icon, color, emoji }, index) => (
            <div
              key={id}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-8 border border-amber-100 hover:border-amber-200 transform hover:-translate-y-2"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              {/* Icon Container */}
              <div className={`relative mb-6 flex justify-center`}>
                <div className={`relative p-5 rounded-2xl bg-gradient-to-r ${color} shadow-lg group-hover:scale-110 transform transition-transform duration-300`}>
                  <img 
                    src={icon} 
                    alt={title} 
                    className="w-16 h-16 filter brightness-0 invert" 
                  />
                  
                  {/* Emoji Decorator */}
                  <div className="absolute -top-2 -right-2 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg border border-amber-200">
                    <span className="text-sm">{emoji}</span>
                  </div>
                </div>
                
                {/* Floating Animation */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Content */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-amber-700 transition-colors duration-300">
                  {title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {description}
                </p>
              </div>

              {/* Hover Indicator */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500 group-hover:w-20 transition-all duration-300 rounded-t-full"></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12" data-aos="fade-up">
          <div className="bg-white rounded-2xl shadow-lg border border-amber-200 p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Ready to Experience the Difference?
            </h3>
            <p className="text-gray-600 mb-6">
              Join thousands of satisfied customers who trust us for their dining needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleOrderNow}
                className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-amber-500/25 transform hover:-translate-y-1 transition-all duration-300"
              >
                Order Now
              </button>
              <button 
                onClick={handleLearnMore}
                className="px-8 py-3 bg-white text-gray-800 font-semibold rounded-xl border border-amber-300 hover:border-amber-400 shadow-sm hover:shadow-md transform hover:-translate-y-1 transition-all duration-300"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute left-10 top-1/4 opacity-10 transform -rotate-12">
          <div className="text-6xl">🍴</div>
        </div>
        <div className="absolute right-10 bottom-1/4 opacity-10 transform rotate-12">
          <div className="text-6xl">🌟</div>
        </div>
      </div>

      {/* Quick Order Modal */}
      {showQuickOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div 
            className="bg-white rounded-2xl p-6 max-w-md w-full mx-auto shadow-2xl border border-amber-200 transform scale-95 animate-scaleIn"
            data-aos="zoom-in"
          >
            {/* Modal Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">🍕</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Quick Order</h3>
              <p className="text-gray-600">Choose how you'd like to start ordering</p>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3 mb-6">
              <button 
                onClick={() => handleQuickAction('all-foods')}
                className="w-full p-4 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl text-left transition-all duration-300 group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-lg">📖</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 group-hover:text-amber-700">Browse Full Menu</h4>
                    <p className="text-sm text-gray-600">Explore all our delicious dishes</p>
                  </div>
                </div>
              </button>

              <button 
                onClick={() => handleQuickAction('top-foods')}
                className="w-full p-4 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl text-left transition-all duration-300 group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-lg">🔥</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 group-hover:text-amber-700">Popular Items</h4>
                    <p className="text-sm text-gray-600">See what others are ordering</p>
                  </div>
                </div>
              </button>

              <button 
                onClick={() => handleQuickAction('categories')}
                className="w-full p-4 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl text-left transition-all duration-300 group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-lg">🍽️</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 group-hover:text-amber-700">By Category</h4>
                    <p className="text-sm text-gray-600">Browse by food categories</p>
                  </div>
                </div>
              </button>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3">
              <button 
                onClick={() => setShowQuickOrder(false)}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors duration-300"
              >
                Maybe Later
              </button>
              <Link 
                to="/all-foods" 
                className="flex-1 text-center px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:shadow-lg font-medium transition-all duration-300"
                onClick={() => setShowQuickOrder(false)}
              >
                View All
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Custom CSS for scale animation */}
      <style jsx>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default WhyChooseUs;