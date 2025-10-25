import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../providers/AuthProvider';
import Swal from 'sweetalert2';
import Loader from '../components/Loader';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const MyFoods = () => {
  const { user } = useContext(AuthContext);
  const [myFoods, setMyFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingFood, setEditingFood] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const foodCategories = [
    'Appetizers', 'Main Course', 'Desserts', 'Beverages', 'Salads',
    'Seafood', 'Vegetarian', 'Specials', 'Breakfast', 'Lunch', 'Dinner'
  ];

  useEffect(() => {
    if (!user?.email) return;

    setLoading(true);
    fetch(`https://restaurant-management-server-liart.vercel.app/my-foods?email=${user.email}`)
      .then(res => res.json())
      .then(data => {
        setMyFoods(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [user]);

  const handleUpdateClick = (food) => {
    setEditingFood(food);
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingFood({ ...editingFood, [name]: value });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    const { _id, ...updateData } = editingFood;

    try {
      const response = await fetch(`https://restaurant-management-server-liart.vercel.app/foods/${_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (data.modifiedCount > 0) {
        Swal.fire({
          title: 'Success!',
          text: 'Food updated successfully.',
          icon: 'success',
          confirmButtonColor: '#f59e0b',
          background: '#fffbeb'
        });

        const updatedFoods = myFoods.map(food =>
          food._id === _id ? { ...food, ...updateData } : food
        );
        setMyFoods(updatedFoods);

        setShowModal(false);
      }
    } catch (error) {
      console.error('Update error:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to update food item.',
        icon: 'error',
        confirmButtonColor: '#f59e0b',
        background: '#fffbeb'
      });
    }
  };

  if (loading) return <Loader />;

  if (myFoods.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-md mx-4"
        >
          <div className="w-32 h-32 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-6xl">🍽️</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            No Foods Added
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            You haven't added any food items yet. Start building your menu with delicious dishes!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/add-food"
              className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-amber-500/25 transition-all duration-300"
            >
              Add First Food
            </Link>
            <Link
              to="/"
              className="px-8 py-3 border-2 border-amber-500 text-amber-600 font-semibold rounded-xl hover:bg-amber-50 transition-all duration-300"
            >
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const totalValue = myFoods.reduce((sum, food) => sum + (food.price * food.quantity), 0);
  const totalItems = myFoods.reduce((sum, food) => sum + parseInt(food.quantity), 0);

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
            <span className="text-amber-700 text-sm font-semibold">🍽️ My Menu</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            My <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Foods</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Manage and update your delicious food offerings
          </p>
        </motion.div>

        {/* Food Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white rounded-2xl shadow-lg border border-amber-200 p-6 text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-2">
              {myFoods.length}
            </div>
            <div className="text-gray-600">Total Items</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-amber-200 p-6 text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-2">
              {totalItems}
            </div>
            <div className="text-gray-600">Available Quantity</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-amber-200 p-6 text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-2">
              ${totalValue.toFixed(2)}
            </div>
            <div className="text-gray-600">Total Value</div>
          </div>
        </motion.div>

        {/* Desktop Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="hidden lg:block"
        >
          <div className="bg-white rounded-2xl shadow-lg border border-amber-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-amber-50">
                  <tr>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">Food Item</th>
                    <th className="p-4 text-center text-sm font-semibold text-gray-700">Category</th>
                    <th className="p-4 text-center text-sm font-semibold text-gray-700">Quantity</th>
                    <th className="p-4 text-center text-sm font-semibold text-gray-700">Price</th>
                    <th className="p-4 text-center text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-100">
                  {myFoods.map((food, index) => (
                    <motion.tr
                      key={food._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="hover:bg-amber-50 transition-colors duration-200"
                    >
                      <td className="p-4">
                        <div className="flex items-center space-x-4">
                          <img
                            src={food.foodImage}
                            alt={food.foodName}
                            className="w-16 h-16 object-cover rounded-xl shadow-sm"
                          />
                          <div>
                            <h3 className="font-semibold text-gray-800">{food.foodName}</h3>
                            <p className="text-sm text-gray-600 line-clamp-2 max-w-xs">
                              {food.shortDescription}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span className="inline-flex items-center px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                          {food.foodCategory}
                        </span>
                      </td>
                      <td className="p-4 text-center text-gray-700 font-medium">
                        {food.quantity}
                      </td>
                      <td className="p-4 text-center font-semibold text-amber-600">
                        ${food.price}
                      </td>
                      <td className="p-4 text-center">
                        <motion.button
                          onClick={() => handleUpdateClick(food)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-xl shadow-lg hover:shadow-amber-500/25 transition-all duration-300"
                        >
                          Update
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Mobile Card List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="lg:hidden space-y-6"
        >
          {myFoods.map((food, index) => (
            <motion.div
              key={food._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg border border-amber-200 p-6"
            >
              <div className="flex items-start space-x-4 mb-4">
                <img
                  src={food.foodImage}
                  alt={food.foodName}
                  className="w-20 h-20 object-cover rounded-xl shadow-sm flex-shrink-0"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 text-lg mb-1">{food.foodName}</h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                    {food.shortDescription}
                  </p>
                  <span className="inline-flex items-center px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
                    {food.foodCategory}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <span className="text-gray-600">Quantity:</span>
                  <span className="font-semibold ml-2">{food.quantity}</span>
                </div>
                <div>
                  <span className="text-gray-600">Price:</span>
                  <span className="font-semibold text-amber-600 ml-2">${food.price}</span>
                </div>
              </div>

              <motion.button
                onClick={() => handleUpdateClick(food)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-xl shadow-lg hover:shadow-amber-500/25 transition-all duration-300"
              >
                Update Food
              </motion.button>
            </motion.div>
          ))}
        </motion.div>

        {/* Add More Food CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Link
            to="/add-food"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-gray-800 font-semibold rounded-2xl shadow-lg hover:shadow-xl border border-amber-200 hover:border-amber-300 transition-all duration-300"
          >
            <span>Add More Food</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </Link>
        </motion.div>

        {/* Update Modal */}
        {showModal && editingFood && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 py-6 px-6">
                <h1 className="text-2xl font-bold text-white text-center">Update Food Item</h1>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-white hover:text-amber-200 text-xl font-bold transition-colors duration-200 w-8 h-8 flex items-center justify-center"
              >
                ✖
              </button>

              {/* Modal Form */}
              <form onSubmit={handleUpdateSubmit} className="p-8 space-y-6">
                {/* Food Image Upload - Circular Design */}
                <div className="flex flex-col items-center">
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Food Image *
                  </label>

                  {/* Circular Image Upload Area */}
                  <div className="relative">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => document.getElementById('updateFoodImage')?.click()}
                      className={`w-48 h-48 rounded-full border-2 border-dashed cursor-pointer transition-all duration-300 flex items-center justify-center overflow-hidden ${editingFood.foodImage
                          ? 'border-amber-400 bg-amber-50'
                          : 'border-gray-300 hover:border-amber-400 hover:bg-amber-50'
                        }`}
                    >
                      {editingFood.foodImage ? (
                        <div className="relative w-full h-full">
                          <img
                            src={editingFood.foodImage}
                            alt={editingFood.foodName}
                            className="w-full h-full object-cover rounded-full"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                            <div className="text-white text-center">
                              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-1">
                                <span className="text-lg">📷</span>
                              </div>
                              <p className="text-sm font-medium">Change Image</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center p-4">
                          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-2xl text-amber-600">📷</span>
                          </div>
                          <p className="text-sm font-medium text-gray-700 mb-1">
                            Click to upload
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, JPEG
                          </p>
                          <p className="text-xs text-gray-500">
                            or paste URL below
                          </p>
                        </div>
                      )}
                    </motion.div>

                    <input
                      id="updateFoodImage"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (e) => {
                            setEditingFood({
                              ...editingFood,
                              foodImage: e.target.result
                            });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                    />
                  </div>

                  <p className="text-xs text-gray-500 text-center mt-4 max-w-sm">
                    Click the image to upload a new one, or update the URL below
                  </p>
                </div>

                {/* Image URL Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Or Update Image URL *
                  </label>
                  <input
                    type="text"
                    name="foodImage"
                    value={editingFood.foodImage}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300"
                    placeholder="https://example.com/food-image.jpg"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Paste a direct image URL or upload a new image above
                  </p>
                </div>

                {/* Rest of the form fields remain the same */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Food Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Food Name *
                    </label>
                    <input
                      type="text"
                      name="foodName"
                      value={editingFood.foodName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300"
                      placeholder="e.g., Spaghetti Carbonara"
                      required
                    />
                  </div>

                  {/* Food Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Food Category *
                    </label>
                    <select
                      name="foodCategory"
                      value={editingFood.foodCategory}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 cursor-pointer"
                      required
                    >
                      <option value="">Select a category</option>
                      {foodCategories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Quantity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available Quantity *
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      value={editingFood.quantity}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300"
                      placeholder="e.g., 50"
                      min="1"
                      max="1000"
                      required
                    />
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price ($) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={editingFood.price}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300"
                      placeholder="e.g., 12.99"
                      step="0.01"
                      min="0.01"
                      max="1000"
                      required
                    />
                  </div>
                </div>

                {/* Food Origin */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Food Origin (Country) *
                  </label>
                  <input
                    type="text"
                    name="foodOrigin"
                    value={editingFood.foodOrigin || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300"
                    placeholder="e.g., Italy, Japan, Mexico"
                    required
                  />
                </div>

                {/* Short Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Short Description *
                  </label>
                  <textarea
                    name="shortDescription"
                    value={editingFood.shortDescription}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 resize-none"
                    placeholder="Brief description of your food (appears in food cards)"
                    rows="3"
                    maxLength="150"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Keep it short and appealing (max 150 characters) • {editingFood.shortDescription?.length || 0}/150
                  </p>
                </div>

                {/* Full Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Description
                  </label>
                  <textarea
                    name="description"
                    value={editingFood.description || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 resize-none"
                    placeholder="Detailed description including ingredients, preparation method, special features, etc."
                    rows="5"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Optional: Provide more details about your dish
                  </p>
                </div>

                {/* Added By Info */}
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                  <h3 className="font-semibold text-gray-800 mb-2">Last Updated By</h3>
                  <div className="flex items-center space-x-3">
                    {user?.photoURL && (
                      <img
                        src={user.photoURL}
                        alt={user.displayName}
                        className="w-10 h-10 rounded-full"
                      />
                    )}
                    <div>
                      <p className="font-medium text-gray-800">{user?.displayName || 'User'}</p>
                      <p className="text-sm text-gray-600">{user?.email}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date().toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <motion.button
                    type="button"
                    onClick={() => setShowModal(false)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-8 py-4 border-2 border-amber-500 text-amber-600 font-semibold rounded-xl hover:bg-amber-50 transition-all duration-300"
                  >
                    Cancel
                  </motion.button>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-amber-500/25 transition-all duration-300"
                  >
                    Update Food Item
                  </motion.button>
                </div>

                {/* Update Tips */}
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 mt-6">
                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                    <span className="mr-2">💡</span>
                    Update Tips
                  </h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Click the image to upload a new photo</li>
                    <li>• Update quantities regularly to keep inventory accurate</li>
                    <li>• Adjust prices based on ingredient costs and demand</li>
                    <li>• Keep descriptions fresh and appealing</li>
                    <li>• Ensure image URLs are working properly</li>
                  </ul>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyFoods;