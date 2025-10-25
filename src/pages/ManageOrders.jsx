import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import moment from "moment";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import Loader from "../components/Loader";
import { motion } from "framer-motion";

const ManageOrders = () => {
  const { user, mongoUser } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.email) return;

    setLoading(true);
    setError(null);
    
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      let response = await fetch(`http://localhost:5000/purchase/all`);
      
      if (response.status === 404) {
        console.log("/all endpoint not found, trying regular endpoint...");
        response = await fetch(`http://localhost:5000/purchase`);
      }
      
      if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Received orders data:", data);
      
      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        console.error("Expected array but got:", data);
        setOrders([]);
        setError("Invalid data format received from server");
        toast.error("Failed to load orders: Invalid data format");
      }
    } catch (err) {
      console.error("Failed to fetch orders", err);
      setError("Failed to load orders. The server endpoint might not be configured yet.");
      toast.error("Failed to load orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = (orderId, newStatus) => {
    Swal.fire({
      title: 'Update Order Status?',
      text: `Change status to ${newStatus}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, update it!',
      background: '#f0f9ff',
      color: '#1f2937'
    }).then((result) => {
      if (result.isConfirmed) {
        setUpdatingId(orderId);
        
        fetch(`http://localhost:5000/purchase/${orderId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: newStatus }),
        })
          .then((res) => {
            if (!res.ok) {
              throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
          })
          .then((data) => {
            console.log("Status update response:", data);
            setOrders((prev) =>
              prev.map((order) =>
                order._id === orderId ? { ...order, status: newStatus } : order
              )
            );
            Swal.fire({
              title: 'Updated!',
              text: `Order status changed to ${newStatus}.`,
              icon: 'success',
              confirmButtonColor: '#3b82f6',
              background: '#f0f9ff'
            });
          })
          .catch((error) => {
            console.error('Update error:', error);
            Swal.fire({
              title: 'Error!',
              text: 'Failed to update order status.',
              icon: 'error',
              confirmButtonColor: '#3b82f6',
              background: '#f0f9ff'
            });
          })
          .finally(() => setUpdatingId(null));
      }
    });
  };

  const handleDelete = (orderId) => {
    Swal.fire({
      title: 'Delete Order?',
      text: "This action cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      background: '#fef2f2',
      color: '#1f2937'
    }).then((result) => {
      if (result.isConfirmed) {
        setUpdatingId(orderId);
        fetch(`http://localhost:5000/purchase/${orderId}`, {
          method: 'DELETE',
        })
          .then((res) => {
            if (!res.ok) {
              throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
          })
          .then((data) => {
            console.log("Delete response:", data);
            setOrders((prev) => prev.filter((order) => order._id !== orderId));
            Swal.fire({
              title: 'Deleted!',
              text: 'The order has been deleted.',
              icon: 'success',
              confirmButtonColor: '#3b82f6',
              background: '#f0f9ff'
            });
          })
          .catch((error) => {
            console.error('Delete error:', error);
            Swal.fire({
              title: 'Error!',
              text: 'Failed to delete the order.',
              icon: 'error',
              confirmButtonColor: '#3b82f6',
              background: '#f0f9ff'
            });
          })
          .finally(() => setUpdatingId(null));
      }
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'preparing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusOptions = (currentStatus) => {
    const allStatuses = ['pending', 'preparing', 'completed', 'cancelled'];
    return allStatuses.filter(status => status !== currentStatus?.toLowerCase());
  };

  if (loading) return <Loader />;

  // Safe calculation functions
  const calculateTotalRevenue = () => {
    if (!Array.isArray(orders)) return 0;
    return orders.reduce((sum, order) => {
      const price = parseFloat(order.price) || 0;
      const quantity = parseInt(order.quantity) || 0;
      return sum + (price * quantity);
    }, 0);
  };

  const countOrdersByStatus = (status) => {
    if (!Array.isArray(orders)) return 0;
    return orders.filter(order => order.status?.toLowerCase() === status.toLowerCase()).length;
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-md mx-4"
        >
          <div className="w-32 h-32 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-6xl">⚠️</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Setup Required
          </h2>
          <p className="text-gray-600 mb-4 leading-relaxed">
            {error}
          </p>
          <p className="text-sm text-gray-500 mb-6">
            The admin orders endpoint needs to be configured on the server. Please add the <code>/purchase/all</code> endpoint to your backend.
          </p>
          <div className="flex flex-col space-y-3">
            <button
              onClick={fetchOrders}
              className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-amber-500/25 transition-all duration-300"
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 border border-amber-500 text-amber-600 font-semibold rounded-lg hover:bg-amber-50 transition-all duration-300"
            >
              Refresh Page
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!Array.isArray(orders) || orders.length === 0) {
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
            {orders.length === 0 
              ? "There are no orders in the system. Orders will appear here when customers make purchases."
              : "No orders found or the orders endpoint is not configured properly."
            }
          </p>
          <button
            onClick={fetchOrders}
            className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-amber-500/25 transition-all duration-300"
          >
            Check Again
          </button>
        </motion.div>
      </div>
    );
  }

  // Calculate statistics safely
  const totalOrders = orders.length;
  const totalRevenue = calculateTotalRevenue();
  const pendingOrders = countOrdersByStatus('pending');
  const completedOrders = countOrdersByStatus('completed');

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
            <span className="text-amber-700 text-sm font-semibold">👑 Admin Dashboard</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Manage <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Orders</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Manage and track all customer orders from one place
          </p>
          <div className="mt-4 text-sm text-amber-600 bg-amber-50 px-4 py-2 rounded-lg inline-block">
            Showing {totalOrders} order{totalOrders !== 1 ? 's' : ''}
          </div>
        </motion.div>

        {/* Order Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-2xl shadow-lg border border-amber-200 p-6 text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-2">
              {totalOrders}
            </div>
            <div className="text-gray-600">Total Orders</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-amber-200 p-6 text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-2">
              ${totalRevenue.toFixed(2)}
            </div>
            <div className="text-gray-600">Total Revenue</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-amber-200 p-6 text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-2">
              {pendingOrders}
            </div>
            <div className="text-gray-600">Pending Orders</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-amber-200 p-6 text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-2">
              {completedOrders}
            </div>
            <div className="text-gray-600">Completed</div>
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
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">Customer</th>
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
                            onError={(e) => {
                              e.target.src = "/default-food.png";
                            }}
                          />
                          <div>
                            <h3 className="font-semibold text-gray-800">{order.foodName}</h3>
                            <p className="text-sm text-gray-600">Order ID: {order._id?.slice(-8) || 'N/A'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-gray-800">{order.buyerName}</p>
                          <p className="text-sm text-gray-600">{order.buyerEmail}</p>
                        </div>
                      </td>
                      <td className="p-4 text-center text-gray-700 font-medium">
                        {order.quantity}
                      </td>
                      <td className="p-4 text-center text-gray-700">
                        ${parseFloat(order.price || 0).toFixed(2)}
                      </td>
                      <td className="p-4 text-center font-semibold text-amber-600">
                        ${((parseFloat(order.price) || 0) * (parseInt(order.quantity) || 0)).toFixed(2)}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                          {order.status || 'Pending'}
                        </span>
                      </td>
                      <td className="p-4 text-center text-sm text-gray-600">
                        {order.date ? moment(order.date).format("MMM Do, YYYY") : "N/A"}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex flex-col space-y-2">
                          {/* Status Update Dropdown */}
                          <select
                            value=""
                            onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                            disabled={updatingId === order._id}
                            className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 disabled:opacity-50"
                          >
                            <option value="">Update Status</option>
                            {getStatusOptions(order.status).map(status => (
                              <option key={status} value={status}>
                                Mark as {status.charAt(0).toUpperCase() + status.slice(1)}
                              </option>
                            ))}
                          </select>
                          
                          {/* Delete Button */}
                          <motion.button
                            onClick={() => handleDelete(order._id)}
                            disabled={updatingId === order._id}
                            whileHover={{ scale: updatingId !== order._id ? 1.05 : 1 }}
                            whileTap={{ scale: updatingId !== order._id ? 0.95 : 1 }}
                            className={`px-3 py-1 text-sm rounded-lg font-medium transition-all duration-300 ${
                              updatingId === order._id
                                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                : 'bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-red-500/25'
                            }`}
                          >
                            {updatingId === order._id ? 'Processing...' : 'Delete'}
                          </motion.button>
                        </div>
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
                  onError={(e) => {
                    e.target.src = "/default-food.png";
                  }}
                />
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 text-lg mb-1">{order.foodName}</h3>
                  <p className="text-gray-600 text-sm mb-1">By {order.buyerName}</p>
                  <p className="text-gray-500 text-xs mb-2">{order.buyerEmail}</p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
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
                  <span className="font-semibold ml-2">${parseFloat(order.price || 0).toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Total:</span>
                  <span className="font-semibold text-amber-600 ml-2">
                    ${((parseFloat(order.price) || 0) * (parseInt(order.quantity) || 0)).toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Date:</span>
                  <span className="font-semibold ml-2">
                    {order.date ? moment(order.date).format("MMM Do") : "N/A"}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <select
                  value=""
                  onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                  disabled={updatingId === order._id}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 disabled:opacity-50"
                >
                  <option value="">Update Order Status</option>
                  {getStatusOptions(order.status).map(status => (
                    <option key={status} value={status}>
                      Mark as {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
                
                <motion.button
                  onClick={() => handleDelete(order._id)}
                  disabled={updatingId === order._id}
                  whileHover={{ scale: updatingId !== order._id ? 1.02 : 1 }}
                  whileTap={{ scale: updatingId !== order._id ? 0.98 : 1 }}
                  className={`w-full py-2 rounded-lg font-medium transition-all duration-300 ${
                    updatingId === order._id
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : 'bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-red-500/25'
                  }`}
                >
                  {updatingId === order._id ? 'Processing...' : 'Delete Order'}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default ManageOrders;