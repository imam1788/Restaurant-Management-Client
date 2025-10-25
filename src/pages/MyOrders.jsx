import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import moment from "moment";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const MyOrders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (!user?.email) return;

    setLoading(true);
    fetch(`http://localhost:5000/purchase?buyerEmail=${user.email}`)
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch orders", err);
        toast.error("Failed to load orders");
        setLoading(false);
      });
  }, [user]);

  const handleDelete = (orderId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      background: '#fffbeb',
      color: '#1f2937'
    }).then((result) => {
      if (result.isConfirmed) {
        setDeletingId(orderId);
        fetch(`http://localhost:5000/purchase/${orderId}`, {
          method: 'DELETE',
        })
          .then((res) => {
            if (res.ok) {
              setOrders((prev) => prev.filter((order) => order._id !== orderId));
              Swal.fire({
                title: 'Deleted!',
                text: 'The order has been deleted.',
                icon: 'success',
                confirmButtonColor: '#f59e0b',
                background: '#fffbeb'
              });
            } else {
              Swal.fire({
                title: 'Error!',
                text: 'Failed to delete the order.',
                icon: 'error',
                confirmButtonColor: '#f59e0b',
                background: '#fffbeb'
              });
            }
          })
          .catch(() => Swal.fire({
            title: 'Error!',
            text: 'Failed to delete the order.',
            icon: 'error',
            confirmButtonColor: '#f59e0b',
            background: '#fffbeb'
          }))
          .finally(() => setDeletingId(null));
      }
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-amber-100 text-amber-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <Loader />;

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-md mx-4"
        >
          <div className="w-32 h-32 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-6xl">📦</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            No Orders Yet
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            You haven't placed any orders yet. Explore our delicious menu and place your first order!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/all-foods"
              className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-amber-500/25 transition-all duration-300"
            >
              Browse Foods
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

  const totalSpent = orders.reduce((sum, order) => sum + (order.price * order.quantity), 0);
  const totalItems = orders.reduce((sum, order) => sum + order.quantity, 0);

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
            <span className="text-amber-700 text-sm font-semibold">📦 Order History</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            My <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Orders</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Track and manage all your food orders in one place
          </p>
        </motion.div>

        {/* Order Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white rounded-2xl shadow-lg border border-amber-200 p-6 text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-2">
              {orders.length}
            </div>
            <div className="text-gray-600">Total Orders</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-amber-200 p-6 text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-2">
              {totalItems}
            </div>
            <div className="text-gray-600">Items Ordered</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-amber-200 p-6 text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-2">
              ${totalSpent.toFixed(2)}
            </div>
            <div className="text-gray-600">Total Spent</div>
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
                    <th className="p-4 text-center text-sm font-semibold text-gray-700">Quantity</th>
                    <th className="p-4 text-center text-sm font-semibold text-gray-700">Price</th>
                    <th className="p-4 text-center text-sm font-semibold text-gray-700">Total</th>
                    <th className="p-4 text-center text-sm font-semibold text-gray-700">Status</th>
                    <th className="p-4 text-center text-sm font-semibold text-gray-700">Order Date</th>
                    <th className="p-4 text-center text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-100">
                  {orders.map((order, index) => (
                    <motion.tr
                      key={order._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="hover:bg-amber-50 transition-colors duration-200"
                    >
                      <td className="p-4">
                        <div className="flex items-center space-x-4">
                          <img
                            src={order.foodImage}
                            alt={order.foodName}
                            className="w-16 h-16 object-cover rounded-xl shadow-sm"
                          />
                          <div>
                            <h3 className="font-semibold text-gray-800">{order.foodName}</h3>
                            <p className="text-sm text-gray-600">{order.buyerName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-center text-gray-700 font-medium">
                        {order.quantity}
                      </td>
                      <td className="p-4 text-center text-gray-700">
                        ${order.price}
                      </td>
                      <td className="p-4 text-center font-semibold text-amber-600">
                        ${(order.price * order.quantity).toFixed(2)}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status || 'Pending'}
                        </span>
                      </td>
                      <td className="p-4 text-center text-sm text-gray-600">
                        {order.date ? moment(order.date).format("MMM Do, YYYY") : "N/A"}
                      </td>
                      <td className="p-4 text-center">
                        <motion.button
                          onClick={() => handleDelete(order._id)}
                          disabled={deletingId === order._id}
                          whileHover={{ scale: deletingId !== order._id ? 1.05 : 1 }}
                          whileTap={{ scale: deletingId !== order._id ? 0.95 : 1 }}
                          className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${deletingId === order._id
                              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                              : 'bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-red-500/25'
                            }`}
                        >
                          {deletingId === order._id ? (
                            <span className="flex items-center space-x-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>Deleting...</span>
                            </span>
                          ) : (
                            'Delete'
                          )}
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
          {orders.map((order, index) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg border border-amber-200 p-6"
            >
              <div className="flex items-start space-x-4 mb-4">
                <img
                  src={order.foodImage}
                  alt={order.foodName}
                  className="w-20 h-20 object-cover rounded-xl shadow-sm flex-shrink-0"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 text-lg mb-1">{order.foodName}</h3>
                  <p className="text-gray-600 text-sm mb-2">By {order.buyerName}</p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status || 'Pending'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <span className="text-gray-600">Quantity:</span>
                  <span className="font-semibold ml-2">{order.quantity}</span>
                </div>
                <div>
                  <span className="text-gray-600">Price:</span>
                  <span className="font-semibold ml-2">${order.price}</span>
                </div>
                <div>
                  <span className="text-gray-600">Total:</span>
                  <span className="font-semibold text-amber-600 ml-2">
                    ${(order.price * order.quantity).toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Date:</span>
                  <span className="font-semibold ml-2">
                    {order.date ? moment(order.date).format("MMM Do") : "N/A"}
                  </span>
                </div>
              </div>

              <motion.button
                onClick={() => handleDelete(order._id)}
                disabled={deletingId === order._id}
                whileHover={{ scale: deletingId !== order._id ? 1.02 : 1 }}
                whileTap={{ scale: deletingId !== order._id ? 0.98 : 1 }}
                className={`w-full py-3 rounded-xl font-medium transition-all duration-300 ${deletingId === order._id
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-red-500/25'
                  }`}
              >
                {deletingId === order._id ? (
                  <span className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Deleting Order...</span>
                  </span>
                ) : (
                  'Delete Order'
                )}
              </motion.button>
            </motion.div>
          ))}
        </motion.div>

        {/* Continue Shopping CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Link
            to="/all-foods"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-gray-800 font-semibold rounded-2xl shadow-lg hover:shadow-xl border border-amber-200 hover:border-amber-300 transition-all duration-300"
          >
            <span>Continue Shopping</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default MyOrders;