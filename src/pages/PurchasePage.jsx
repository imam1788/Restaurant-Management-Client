import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import { toast } from "react-toastify";

const PurchasePage = () => {
  const { id } = useParams();
  const [food, setFood] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`https://restaurant-management-server-liart.vercel.app/foods/${id}`)
      .then(res => res.json())
      .then(data => setFood(data))
      .catch(err => console.error("Failed to load food", err));
  }, [id]);

  if (!food) return <div className="text-center mt-10">Loading...</div>;

  const isOutOfStock = food.quantity === 0;
  const isOwner = user.email === food?.addedBy?.email;

  const handlePurchase = async (e) => {
    e.preventDefault();

    if (quantity > food.quantity) {
      toast.error(`You cannot order more than ${food.quantity}`);
      return;
    }

    const order = {
      foodId: id,
      foodName: food.foodName,
      foodImage: food.foodImage,
      price: food.price,
      quantity: parseInt(quantity),
      buyerName: user.displayName,
      buyerEmail: user.email,
      date: new Date(),
    };

    const res = await fetch("https://restaurant-management-server-liart.vercel.app/purchase", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    });

    if (res.ok) {
      toast.success("Purchase successful!");
      navigate('/my-orders');
    } else {
      toast.error("Something went wrong. Try again.");
    }
  };

  return (
    <div className="max-w-xl mx-auto my-10 p-6 bg-white rounded shadow">
      <div className="mb-8 text-center bg-green-100 py-6 rounded shadow">
        <h1 className="text-4xl font-bold text-green-700">Purchase Now</h1>
      </div>

      {(isOutOfStock || isOwner) && (
        <p className="text-red-600 text-center font-semibold mb-4">
          {isOutOfStock
            ? "This item is currently out of stock."
            : "You cannot purchase your own food item."}
        </p>
      )}

      <form onSubmit={handlePurchase} className="space-y-4">
        <div>
          <label className="font-semibold">Food Name</label>
          <input type="text" value={food.foodName} readOnly className="input input-bordered w-full" />
        </div>
        <div>
          <label className="font-semibold">Price</label>
          <input type="text" value={`$${food.price}`} readOnly className="input input-bordered w-full" />
        </div>
        <div>
          <label className="font-semibold">Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) =>
              setQuantity(Math.min(food.quantity, Math.max(1, Number(e.target.value))))
            }
            className="input input-bordered w-full"
            min="1"
            max={food.quantity}
            required
            disabled={isOutOfStock || isOwner}
          />
          <p className="text-sm mt-1 text-gray-500">Max: {food.quantity}</p>
        </div>
        <div>
          <label className="font-semibold">Buyer Name</label>
          <input type="text" value={user.displayName} readOnly className="input input-bordered w-full" />
        </div>
        <div>
          <label className="font-semibold">Buyer Email</label>
          <input type="email" value={user.email} readOnly className="input input-bordered w-full" />
        </div>
        <button
          type="submit"
          className="btn bg-yellow-400 hover:bg-yellow-500 w-full"
          disabled={isOutOfStock || isOwner}
        >
          Purchase
        </button>
      </form>
    </div>
  );
};

export default PurchasePage;
