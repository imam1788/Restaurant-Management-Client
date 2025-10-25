import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

const TopFoods = () => {
  const [topFoods, setTopFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 800, once: false });
    
    fetch("https://restaurant-management-server-liart.vercel.app/foods")
      .then((res) => res.json())
      .then((data) => {
        const sorted = data.sort((a, b) => b.purchaseCount - a.purchaseCount);
        setTopFoods(sorted.slice(0, 6));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load top foods:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="animate-pulse bg-amber-200 h-8 w-64 mx-auto rounded-lg mb-4"></div>
            <div className="animate-pulse bg-amber-200 h-4 w-96 mx-auto rounded-lg"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
                <div className="bg-amber-200 h-48 rounded-xl mb-4"></div>
                <div className="bg-amber-200 h-6 rounded-lg mb-2"></div>
                <div className="bg-amber-200 h-4 rounded-lg w-3/4 mb-2"></div>
                <div className="bg-amber-200 h-4 rounded-lg w-1/2 mb-4"></div>
                <div className="bg-amber-200 h-10 rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 py-16">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12" data-aos="fade-down">
          <div className="inline-flex items-center px-4 py-2 bg-amber-100 rounded-full border border-amber-200 mb-4">
            <span className="text-amber-700 text-sm font-semibold">🔥 Most Popular</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Top Selling <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Foods</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover our customer favorites! These dishes are loved by everyone and always in high demand.
          </p>
        </div>

        {/* Food Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {topFoods.map((food, index) => (
            <div
              key={food._id}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-amber-100 hover:border-amber-200 transform hover:-translate-y-2"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              {/* Food Image */}
              <div className="relative overflow-hidden">
                <img
                  src={food.foodImage}
                  alt={food.foodName}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Popular Badge */}
                <div className="absolute top-4 left-4">
                  <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg flex items-center space-x-1">
                    <span>🔥</span>
                    <span>#{index + 1} Popular</span>
                  </div>
                </div>

                {/* Purchase Count Badge */}
                <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                  <span className="flex items-center space-x-1">
                    <span>🛒</span>
                    <span>{food.purchaseCount} sold</span>
                  </span>
                </div>

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Food Content */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-amber-700 transition-colors duration-300 line-clamp-1">
                    {food.foodName}
                  </h3>
                  <span className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                    ${food.price}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {food.description || "Delicious and flavorful dish made with fresh ingredients."}
                </p>

                {/* Food Meta Info */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    {food.category && (
                      <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-lg text-sm font-medium">
                        {food.category}
                      </span>
                    )}
                  </div>
                  
                  {/* Rating (if available) */}
                  {food.rating && (
                    <div className="flex items-center space-x-1 bg-amber-50 px-3 py-1 rounded-lg">
                      <span className="text-amber-500">⭐</span>
                      <span className="text-sm font-semibold text-amber-700">{food.rating}</span>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <Link
                  to={`/foods/${food._id}`}
                  className="block w-full text-center px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-amber-500/25 transform hover:scale-105 transition-all duration-300 group/btn"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <span>View Details</span>
                    <svg 
                      className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform duration-300" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* See All Button */}
        <div className="text-center mt-12" data-aos="fade-up">
          <Link
            to="/all-foods"
            className="inline-flex items-center space-x-3 px-8 py-4 bg-white text-gray-800 font-bold rounded-xl shadow-lg hover:shadow-xl border border-amber-200 hover:border-amber-300 transform hover:-translate-y-1 transition-all duration-300 group"
          >
            <span>Explore All Foods</span>
            <svg 
              className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* Decorative Elements */}
        <div className="absolute right-10 top-1/4 opacity-10 transform rotate-12">
          <div className="text-6xl">🍔</div>
        </div>
        <div className="absolute left-10 bottom-1/4 opacity-10 transform -rotate-12">
          <div className="text-6xl">🍕</div>
        </div>
      </div>
    </div>
  );
};

export default TopFoods;