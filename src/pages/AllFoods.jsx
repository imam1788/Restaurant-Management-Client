import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import Loader from "../components/Loader";
import AddToCartButton from "../components/AddToCartButton";

const AllFoods = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("default");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    AOS.init({ duration: 800, once: false });
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/foods")
      .then((res) => res.json())
      .then((data) => {
        setFoods(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch foods:", err);
        setLoading(false);
      });
  }, []);

  // Get unique categories for filter
  const categories = ["all", ...new Set(foods.map(food => food.category).filter(Boolean))];

  const filteredFoods = foods.filter((food) => {
    const matchesSearch = (food.foodName ?? "").toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "all" || food.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedFoods = [...filteredFoods];

  if (sortOrder === "asc") {
    sortedFoods.sort((a, b) => a.price - b.price);
  } else if (sortOrder === "desc") {
    sortedFoods.sort((a, b) => b.price - a.price);
  } else if (sortOrder === "popular") {
    sortedFoods.sort((a, b) => (b.purchaseCount || 0) - (a.purchaseCount || 0));
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center px-6 py-2 bg-amber-100 rounded-full border border-amber-200 mb-6">
            <span className="text-amber-700 text-sm font-semibold">🍽️ Our Menu</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Explore Our <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Foods</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover our delicious selection of handcrafted dishes made with the freshest ingredients and passion.
          </p>
        </motion.div>

        {/* Search and Filter Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8 bg-white rounded-2xl shadow-lg border border-amber-200 p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Foods
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by food name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 cursor-pointer"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 cursor-pointer"
              >
                <option value="default">Default</option>
                <option value="popular">Most Popular</option>
                <option value="asc">Price: Low to High</option>
                <option value="desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-6"
        >
          <p className="text-gray-600">
            Showing <span className="font-semibold text-amber-600">{sortedFoods.length}</span> of <span className="font-semibold text-amber-600">{foods.length}</span> foods
            {search && ` for "${search}"`}
            {selectedCategory !== "all" && ` in ${selectedCategory}`}
          </p>
        </motion.div>

        {/* Food Cards Grid */}
        {sortedFoods.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🔍</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Foods Found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => {
                setSearch("");
                setSelectedCategory("all");
                setSortOrder("default");
              }}
              className="px-6 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors duration-300"
            >
              Reset Filters
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedFoods.map((food, index) => (
              <motion.div
                key={food._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-amber-100 hover:border-amber-200 transform hover:-translate-y-2 h-full flex flex-col">
                  
                  {/* Food Image */}
                  <div className="relative overflow-hidden">
                    <img
                      src={food.foodImage}
                      alt={food.foodName}
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    
                    {/* Category Badge */}
                    {food.category && (
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 bg-amber-500 text-white text-xs font-semibold rounded-full shadow-lg">
                          {food.category}
                        </span>
                      </div>
                    )}

                    {/* Purchase Count Badge */}
                    {(food.purchaseCount > 0) && (
                      <div className="absolute top-3 right-3 bg-black/80 text-white px-2 py-1 rounded-full text-xs font-medium">
                        🛒 {food.purchaseCount} sold
                      </div>
                    )}
                  </div>

                  {/* Food Content */}
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1 group-hover:text-amber-700 transition-colors">
                        {food.foodName}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {food.shortDescription || "Delicious and flavorful dish made with fresh ingredients."}
                      </p>

                      <div className="flex justify-between items-center mb-4">
                        <span className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                          ${food.price}
                        </span>
                        <span className={`text-sm font-medium px-2 py-1 rounded ${
                          food.quantity > 10 
                            ? "bg-green-100 text-green-700" 
                            : food.quantity > 0 
                            ? "bg-amber-100 text-amber-700" 
                            : "bg-red-100 text-red-700"
                        }`}>
                          {food.quantity > 0 ? `${food.quantity} in stock` : "Out of stock"}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons - Compact Layout */}
                    <div className="flex flex-col space-y-2">
                      {/* View Details Button */}
                      <Link
                        to={`/foods/${food._id}`}
                        className="block w-full text-center px-3 py-2 bg-white border border-amber-500 text-amber-600 font-semibold rounded-xl hover:bg-amber-50 transition-all duration-200 text-sm group/details"
                      >
                        <span className="flex items-center justify-center space-x-1">
                          <span>View Details</span>
                          <svg 
                            className="w-3 h-3 transform group-hover/details:translate-x-0.5 transition-transform duration-300" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </span>
                      </Link>
                      
                      {/* Add to Cart Button */}
                      <AddToCartButton 
                        food={food} 
                        size="small" 
                        showQuantity={false}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllFoods;