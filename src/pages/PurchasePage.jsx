import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const PurchasePage = () => {
  const { id } = useParams();
  const [food, setFood] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const { user } = useAuth();
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
        console.error("Failed to load food", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading food details...</p>
        </div>
      </div>
    );
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
  const isOwner = user?.email === food?.addedBy?.email;
  const totalPrice = (food.price * quantity).toFixed(2);
  const maxQuantity = Math.min(food.quantity, 20); // Limit to 20 max

  const handlePurchase = async (e) => {
    e.preventDefault();
    setPurchasing(true);

    if (quantity > food.quantity) {
      toast.error(`You cannot order more than ${food.quantity} items`);
      setPurchasing(false);
      return;
    }

    if (isOwner) {
      toast.error("You cannot purchase your own food items");
      setPurchasing(false);
      return;
    }

    const order = {
      foodId: id,
      foodName: food.foodName,
      foodImage: food.foodImage,
      price: food.price,
      quantity: parseInt(quantity),
      totalPrice: parseFloat(totalPrice),
      buyerName: user.displayName,
      buyerEmail: user.email,
      buyerPhoto: user.photoURL,
      date: new Date(),
      status: 'pending'
    };

    try {
      const res = await fetch("http://localhost:5000/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      });

      if (res.ok) {
        toast.success("🎉 Order placed successfully!");
        // Update food quantity in the backend
        await fetch(`http://localhost:5000/foods/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            quantity: food.quantity - quantity,
            purchaseCount: (food.purchaseCount || 0) + 1
          })
        });
        navigate('/my-orders');
      } else {
        throw new Error('Failed to place order');
      }
    } catch (error) {
      console.error("Purchase error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center px-6 py-2 bg-amber-100 rounded-full border border-amber-200 mb-6">
            <span className="text-amber-700 text-sm font-semibold">🛒 Complete Your Order</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Purchase <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">{food.foodName}</span>
          </h1>
          <p className="text-gray-600">Review your order details and complete the purchase</p>
        </motion.div>

        {/* Alert Messages */}
        {(isOutOfStock || isOwner) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 rounded-xl border-l-4 bg-red-50 border-red-500"
          >
            <div className="flex items-center space-x-3">
              <span className="text-red-500 text-xl">⚠️</span>
              <div>
                <p className="text-red-800 font-semibold">
                  {isOutOfStock
                    ? "This item is currently out of stock."
                    : "You cannot purchase your own food items."}
                </p>
                <p className="text-red-600 text-sm mt-1">
                  {isOutOfStock
                    ? "Please check back later or explore other delicious options."
                    : "This helps maintain fair trading on our platform."}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Food Summary Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl shadow-lg border border-amber-200 p-6 sticky top-6">
              <div className="text-center mb-6">
                <img
                  src={food.foodImage}
                  alt={food.foodName}
                  className="w-32 h-32 object-cover rounded-xl mx-auto mb-4 shadow-md"
                />
                <h3 className="text-xl font-bold text-gray-800 mb-2">{food.foodName}</h3>
                <p className="text-gray-600 text-sm mb-4">{food.shortDescription}</p>
                <div className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  ${food.price}
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-semibold">{food.foodCategory}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Available:</span>
                  <span className={`font-semibold ${isOutOfStock ? 'text-red-600' : 'text-green-600'}`}>
                    {food.quantity} items
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Popularity:</span>
                  <span className="font-semibold text-amber-600">{food.purchaseCount || 0} sold</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Purchase Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl shadow-lg border border-amber-200 p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Details</h2>

              <form onSubmit={handlePurchase} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Food Name</label>
                    <input
                      type="text"
                      value={food.foodName}
                      readOnly
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Unit Price</label>
                    <input
                      type="text"
                      value={`$${food.price}`}
                      readOnly
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity {!isOutOfStock && !isOwner && (
                      <span className="text-amber-600 text-xs ml-2">(Max: {maxQuantity})</span>
                    )}
                  </label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                      const value = Math.max(1, Math.min(maxQuantity, Number(e.target.value) || 1));
                      setQuantity(value);
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                    min="1"
                    max={maxQuantity}
                    required
                    disabled={isOutOfStock || isOwner}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-500">
                      {quantity} × ${food.price} = <strong>${totalPrice}</strong>
                    </span>
                    {!isOutOfStock && !isOwner && (
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          disabled={quantity <= 1}
                          className="w-8 h-8 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          -
                        </button>
                        <button
                          type="button"
                          onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                          disabled={quantity >= maxQuantity}
                          className="w-8 h-8 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                    <input
                      type="text"
                      value={user?.displayName || 'User'}
                      readOnly
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Email</label>
                    <input
                      type="email"
                      value={user?.email}
                      readOnly
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-600"
                    />
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                  <h3 className="font-semibold text-gray-800 mb-3">Order Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal ({quantity} items):</span>
                      <span>${totalPrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee:</span>
                      <span className="text-green-600">Free</span>
                    </div>
                    <div className="flex justify-between border-t border-amber-200 pt-2">
                      <span className="font-semibold">Total:</span>
                      <span className="font-bold text-lg text-amber-600">${totalPrice}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <motion.button
                    type="submit"
                    disabled={isOutOfStock || isOwner || purchasing}
                    whileHover={!(isOutOfStock || isOwner || purchasing) ? { scale: 1.02 } : {}}
                    whileTap={!(isOutOfStock || isOwner || purchasing) ? { scale: 0.98 } : {}}
                    className={`flex-1 px-8 py-4 font-semibold rounded-xl shadow-lg transition-all duration-300 ${
                      isOutOfStock || isOwner || purchasing
                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                        : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-amber-500/25'
                    }`}
                  >
                    {purchasing ? (
                      <span className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </span>
                    ) : (
                      `Purchase Now - $${totalPrice}`
                    )}
                  </motion.button>

                  <Link
                    to={`/foods/${id}`}
                    className="px-8 py-4 border-2 border-amber-500 text-amber-600 font-semibold rounded-xl hover:bg-amber-50 text-center transition-all duration-300"
                  >
                    Back to Details
                  </Link>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PurchasePage;