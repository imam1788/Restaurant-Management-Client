import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import { toast } from "react-toastify";

const PurchasePage = () => {
  const { id } = useParams();
  const [food, setFood] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { user } = useAuth();

  useEffect(() => {
    fetch(`http://localhost:5000/foods/${id}`)
      .then(res => res.json())
      .then(data => setFood(data))
      .catch(err => console.error("Failed to load food", err));
  }, [id]);

  const handlePurchase = async (e) => {
    e.preventDefault();
    const order = {
      foodId: id,
      foodName: food.foodName,
      price: food.price,
      quantity: parseInt(quantity),
      buyerName: user.displayName,
      buyerEmail: user.email,
    };

    const res = await fetch("http://localhost:5000/purchase", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    });

    if (res.ok) {
      toast.success("Purchase successful!");
    } else {
      toast.error("Something went wrong. Try again.");
    }
  };

  if (!food) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto my-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Purchase Food</h2>
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
            onChange={(e) => setQuantity(e.target.value)}
            className="input input-bordered w-full"
            min="1"
            required
          />
        </div>
        <div>
          <label className="font-semibold">Buyer Name</label>
          <input type="text" value={user.displayName} readOnly className="input input-bordered w-full" />
        </div>
        <div>
          <label className="font-semibold">Buyer Email</label>
          <input type="email" value={user.email} readOnly className="input input-bordered w-full" />
        </div>
        <button type="submit" className="btn bg-green-500 hover:bg-green-600 text-white w-full">
          Purchase
        </button>
      </form>
    </div>
  );
};

export default PurchasePage;
