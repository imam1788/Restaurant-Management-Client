import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import moment from "moment";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const MyOrders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:5000/purchase/${orderId}`, {
          method: 'DELETE',
        })
          .then((res) => {
            if (res.ok) {
              setOrders((prev) => prev.filter((order) => order._id !== orderId));
              Swal.fire('Deleted!', 'The order has been deleted.', 'success');
            } else {
              Swal.fire('Error!', 'Failed to delete the order.', 'error');
            }
          })
          .catch(() => Swal.fire('Error!', 'Failed to delete the order.', 'error'));
      }
    });
  };

  if (loading) return <p>Loading orders...</p>;
  if (orders.length === 0) return <p>No orders found.</p>;

  return (
    <div className="container mx-auto px-4 pb-10">
      <div className="mb-8 text-center bg-green-100 py-6 rounded shadow">
        <h1 className="text-4xl font-bold text-green-700">My Orders</h1>
      </div>

      {/* Desktop Table with horizontal scroll */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">Food Image</th>
              <th className="p-2 border">Food Name</th>
              <th className="p-2 border">Quantity</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border">Buyer Name</th>
              <th className="p-2 border">Buying Date</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="text-center">
                <td className="p-2 border">
                  <img
                    src={order.foodImage}
                    alt={order.foodName}
                    className="w-20 h-20 object-cover mx-auto rounded"
                  />
                </td>
                <td className="p-2 border">{order.foodName}</td>
                <td className="p-2 border">{order.quantity}</td>
                <td className="p-2 border">
                  ${order.price} * {order.quantity} ={" "}
                  {(order.price * order.quantity).toFixed(2)}
                </td>
                <td className="p-2 border">{order.buyerName}</td>
                <td className="p-2 border">
                  {order.date
                    ? moment(order.date).format("MMMM Do YYYY, h:mm a")
                    : "N/A"}
                </td>
                <td className="p-2 border">
                  <button
                    onClick={() => handleDelete(order._id)}
                    className="btn btn-sm btn-error"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List */}
      <div className="md:hidden space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="border rounded shadow p-4 flex flex-col gap-3 bg-white"
          >
            <div className="flex items-center gap-4">
              <img
                src={order.foodImage}
                alt={order.foodName}
                className="w-20 h-20 object-cover rounded"
              />
              <div>
                <h2 className="font-bold text-lg">{order.foodName}</h2>
                <p>
                  Quantity: <span className="font-semibold">{order.quantity}</span>
                </p>
                <p>
                  Price:{" "}
                  <span className="font-semibold">
                    ${order.price} × {order.quantity} ={" "}
                    {(order.price * order.quantity).toFixed(2)}
                  </span>
                </p>
              </div>
            </div>
            <p>
              Buyer: <span className="font-semibold">{order.buyerName}</span>
            </p>
            <p>
              Date:{" "}
              <span className="font-semibold">
                {order.date
                  ? moment(order.date).format("MMMM Do YYYY, h:mm a")
                  : "N/A"}
              </span>
            </p>
            <button
              onClick={() => handleDelete(order._id)}
              className="btn btn-error w-full"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
