import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Loader from "../components/Loader";
import AddToCartButton from "../components/AddToCartButton"

const SingleFood = () => {
  const { id } = useParams();
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5000/foods/${id}`)
      .then(res => res.json())
      .then(data => {
        setFood(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <Loader />;
  }

  if (!food) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">😕</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Food Not Found</h2>
          <p className="text-gray-600 mb-6">The food item you're looking for doesn't exist.</p>
          <Link
            to="/all-foods"
            className="px-6 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors duration-300"
          >
            Back to All Foods
          </Link>
        </div>
      </div>
    );
  }

  const isOutOfStock = food.quantity === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Breadcrumb Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-amber-600 transition-colors">Home</Link>
            <span>›</span>
            <Link to="/all-foods" className="hover:text-amber-600 transition-colors">All Foods</Link>
            <span>›</span>
            <span className="text-amber-600 font-medium">{food.foodName}</span>
          </nav>
        </motion.div>

        <div className="bg-white rounded-2xl shadow-2xl border border-amber-200 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Food Image Section */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <img
                src={food.foodImage}
                alt={food.foodName}
                className="w-full h-96 lg:h-full object-cover"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col space-y-2">
                {food.category && (
                  <span className="px-4 py-2 bg-amber-500 text-white text-sm font-semibold rounded-full shadow-lg">
                    {food.category}
                  </span>
                )}
                {isOutOfStock && (
                  <span className="px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-full shadow-lg">
                    Out of Stock
                  </span>
                )}
                {(food.purchaseCount > 0) && (
                  <span className="px-4 py-2 bg-black/80 text-white text-sm font-semibold rounded-full shadow-lg">
                    🔥 {food.purchaseCount} Sold
                  </span>
                )}
              </div>
            </motion.div>

            {/* Food Details Section */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="p-8 flex flex-col justify-between"
            >
              <div>
                {/* Food Header */}
                <div className="mb-6">
                  <h1 className="text-4xl font-bold text-gray-800 mb-4">{food.foodName}</h1>
                  <p className="text-gray-600 text-lg leading-relaxed">{food.shortDescription}</p>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <span className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                    ${food.price}
                  </span>
                  <span className="text-gray-500 text-sm ml-2">per serving</span>
                </div>

                {/* Food Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center space-x-3 p-3 bg-amber-50 rounded-lg">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      <span className="text-amber-600">📦</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Available Quantity</p>
                      <p className={`font-semibold ${isOutOfStock ? 'text-red-600' : 'text-gray-800'}`}>
                        {food.quantity} {isOutOfStock ? ' (Out of Stock)' : 'in stock'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-amber-50 rounded-lg">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      <span className="text-amber-600">🌍</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Food Origin</p>
                      <p className="font-semibold text-gray-800">{food.foodOrigin}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-amber-50 rounded-lg">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      <span className="text-amber-600">🍽️</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Category</p>
                      <p className="font-semibold text-gray-800">{food.foodCategory}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-amber-50 rounded-lg">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      <span className="text-amber-600">👨‍🍳</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Added By</p>
                      <p className="font-semibold text-gray-800">{food.addedBy?.name}</p>
                    </div>
                  </div>
                </div>

                {/* Full Description */}
                {food.description && (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">About This Dish</h3>
                    <p className="text-gray-600 leading-relaxed">{food.description}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  onClick={() => navigate(`/purchase/${food._id}`)}
                  disabled={isOutOfStock}
                  whileHover={!isOutOfStock ? { scale: 1.05 } : {}}
                  whileTap={!isOutOfStock ? { scale: 0.95 } : {}}
                  className={`flex-1 px-8 py-4 font-semibold rounded-xl shadow-lg transition-all duration-300 ${isOutOfStock
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-amber-500/25'
                    }`}
                >
                  {isOutOfStock ? 'Out of Stock' : 'Purchase Now'}
                </motion.button>

                {/* Add AddToCartButton */}
                <div className="flex-1">
                  <AddToCartButton
                    food={food}
                    size="large"
                    showQuantity={true}
                    className="h-full"
                  />
                </div>

                <motion.button
                  onClick={() => navigate('/all-foods')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 border-2 border-amber-500 text-amber-600 font-semibold rounded-xl hover:bg-amber-50 transition-all duration-300"
                >
                  Back to Menu
                </motion.button>
              </div>

              {/* Additional Info */}
              <div className="mt-6 pt-6 border-t border-amber-100">
                <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                  <span className="flex items-center space-x-2">
                    <span>🚚</span>
                    <span>Free Delivery</span>
                  </span>
                  <span className="flex items-center space-x-2">
                    <span>⭐</span>
                    <span>4.9 Rating</span>
                  </span>
                  <span className="flex items-center space-x-2">
                    <span>⏱️</span>
                    <span>30 min prep</span>
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Related Foods Suggestion */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Explore More Delicious Options</h3>
          <Link
            to="/all-foods"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-white text-gray-800 font-semibold rounded-xl shadow-lg hover:shadow-xl border border-amber-200 hover:border-amber-300 transition-all duration-300"
          >
            <span>View All Foods</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default SingleFood;