import React, { useContext, useState, useRef } from 'react';
import { AuthContext } from '../providers/AuthProvider';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const AddFood = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const foodCategories = [
    'Appetizers', 'Main Course', 'Desserts', 'Beverages', 'Salads',
    'Seafood', 'Vegetarian', 'Specials', 'Breakfast', 'Lunch', 'Dinner'
  ];

  // Compress image function
  const compressImage = (file, maxWidth = 800, quality = 0.7) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(resolve, 'image/jpeg', quality);
      };

      img.src = URL.createObjectURL(file);
    });
  };

  // Handle image file selection and preview
  const handleImageChange = async (e) => {
    const file = e.target.files[0];

    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file (PNG, JPG, JPEG)');
        return;
      }

      // Check file size (max 20MB)
      if (file.size > 20 * 1024 * 1024) {
        toast.error('Image size should be less than 20MB');
        return;
      }

      try {
        setUploadingImage(true);

        // Compress image for preview and upload
        const compressedBlob = await compressImage(file, 800, 0.7);
        const compressedFile = new File([compressedBlob], file.name, {
          type: 'image/jpeg',
          lastModified: Date.now()
        });

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target.result);
          setUploadingImage(false);
        };
        reader.readAsDataURL(compressedFile);

      } catch (error) {
        console.error('Image compression error:', error);
        toast.error('Error processing image');
        setUploadingImage(false);
      }
    }
  };

  // Convert image to Base64 with compression
  const convertToBase64 = async (file) => {
    // Compress first, then convert to Base64
    const compressedBlob = await compressImage(file, 600, 0.6); // More compression for upload
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(compressedBlob);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  // Trigger file input click
  const handleCircleClick = () => {
    fileInputRef.current?.click();
  };

  // Clear selected image
  const clearImage = (e) => {
    e.stopPropagation();
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddFood = async (e) => {
    e.preventDefault();
    const form = e.target;

    const foodName = form.foodName.value;
    const foodCategory = form.foodCategory.value;
    const quantity = parseInt(form.quantity.value);
    const price = parseFloat(form.price.value);
    const foodOrigin = form.foodOrigin.value;
    const shortDescription = form.shortDescription.value;
    const fullDescription = form.fullDescription.value;

    // Get the image file
    const imageFile = fileInputRef.current?.files[0];

    if (!imageFile) {
      toast.error('Please select a food image');
      return;
    }

    try {
      setLoading(true);

      // Convert image to Base64 with compression
      const foodImage = await convertToBase64(imageFile);

      console.log('Base64 length:', foodImage.length); // Debug log

      const newFood = {
        foodName,
        foodImage,
        foodCategory,
        quantity,
        price,
        foodOrigin,
        shortDescription,
        description: fullDescription,
        purchaseCount: 0,
        addedBy: {
          name: user?.displayName || 'Unknown User',
          email: user?.email
        },
        createdAt: new Date()
      };

      const res = await fetch('https://restaurant-management-server-liart.vercel.app/foods', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newFood)
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (data.insertedId || data.acknowledged) {
        toast.success('🎉 Food added successfully!');
        form.reset();
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        navigate('/my-foods');
      } else {
        toast.error('Failed to add food item.');
      }
    } catch (error) {
      console.error('Add food error:', error);
      if (error.message.includes('413')) {
        toast.error('Image is too large. Please try a smaller image.');
      } else if (error.message.includes('CORS')) {
        toast.error('Server connection issue. Please try again later.');
      } else {
        toast.error('Error adding food item. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center px-6 py-2 bg-amber-100 rounded-full border border-amber-200 mb-6">
            <span className="text-amber-700 text-sm font-semibold">🍽️ Add New Dish</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Add New <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Food</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Share your culinary creations with our community. Upload a photo and fill in the details below.
          </p>
        </motion.div>

        {/* Form Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-2xl border border-amber-200 p-8"
        >
          <form onSubmit={handleAddFood} className="space-y-6">
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
                  onClick={handleCircleClick}
                  className={`w-48 h-48 rounded-full border-2 border-dashed cursor-pointer transition-all duration-300 flex items-center justify-center overflow-hidden ${imagePreview
                      ? 'border-amber-400 bg-amber-50'
                      : 'border-gray-300 hover:border-amber-400 hover:bg-amber-50'
                    }`}
                >
                  {uploadingImage ? (
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                      <p className="text-xs text-amber-600">Compressing...</p>
                    </div>
                  ) : imagePreview ? (
                    <div className="relative w-full h-full">
                      <img
                        src={imagePreview}
                        alt="Food preview"
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
                        up to 20MB
                      </p>
                    </div>
                  )}
                </motion.div>

                {imagePreview && !uploadingImage && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    type="button"
                    onClick={clearImage}
                    className="absolute -top-2 -right-2 w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-200 shadow-lg border-2 border-white"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <span className="text-lg font-bold">×</span>
                  </motion.button>
                )}

                <input
                  ref={fileInputRef}
                  id="foodImage"
                  name="foodImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  required
                />
              </div>

              <p className="text-xs text-gray-500 text-center mt-4 max-w-sm">
                Images are automatically compressed for optimal performance.
                Maximum file size: 20MB
              </p>
            </div>

            {/* Rest of the form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Food Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Food Name *
                </label>
                <input
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300"
                  type="text"
                  name="foodName"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 cursor-pointer"
                  name="foodCategory"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300"
                  type="number"
                  name="quantity"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300"
                  type="number"
                  step="0.01"
                  name="price"
                  placeholder="e.g., 12.99"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300"
                type="text"
                name="foodOrigin"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 resize-none"
                name="shortDescription"
                placeholder="Brief description of your food (appears in food cards)"
                rows="3"
                maxLength="150"
                required
              />
              <p className="text-xs text-gray-500 mt-2">Keep it short and appealing (max 150 characters)</p>
            </div>

            {/* Full Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Description
              </label>
              <textarea
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 resize-none"
                name="fullDescription"
                placeholder="Detailed description including ingredients, preparation method, special features, etc."
                rows="5"
              />
              <p className="text-xs text-gray-500 mt-2">Optional: Provide more details about your dish</p>
            </div>

            {/* Added By Info */}
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
              <h3 className="font-semibold text-gray-800 mb-2">Added By</h3>
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
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <motion.button
                type="submit"
                disabled={loading || !imagePreview}
                whileHover={!(loading || !imagePreview) ? { scale: 1.02 } : {}}
                whileTap={!(loading || !imagePreview) ? { scale: 0.98 } : {}}
                className={`flex-1 px-8 py-4 font-semibold rounded-xl shadow-lg transition-all duration-300 ${loading || !imagePreview
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-amber-500/25'
                  }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Adding Food...</span>
                  </span>
                ) : (
                  'Add Food to Menu'
                )}
              </motion.button>

              <Link
                to="/my-foods"
                className="px-8 py-4 border-2 border-amber-500 text-amber-600 font-semibold rounded-xl hover:bg-amber-50 text-center transition-all duration-300"
              >
                View My Foods
              </Link>
            </div>

            {/* Form Tips */}
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 mt-6">
              <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                <span className="mr-2">💡</span>
                Tips for Better Listings
              </h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Use high-quality, well-lit food photos</li>
                <li>• Capture the food from an appealing angle</li>
                <li>• Ensure good contrast and vibrant colors</li>
                <li>• Write clear and appealing descriptions</li>
                <li>• Set competitive prices for your dishes</li>
              </ul>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AddFood;