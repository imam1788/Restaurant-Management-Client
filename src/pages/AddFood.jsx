import React, { useContext, useState } from 'react';
import { AuthContext } from '../providers/AuthProvider';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router';

const AddFood = () => {
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleAddFood = async (e) => {
    e.preventDefault();
    const form = e.target;

    const foodName = form.foodName.value;
    const foodImage = form.foodImage.value;
    const foodCategory = form.foodCategory.value;
    const quantity = parseInt(form.quantity.value);
    const price = parseFloat(form.price.value);
    const foodOrigin = form.foodOrigin.value;
    const shortDescription = form.shortDescription.value;

    const newFood = {
      foodName,
      foodImage,
      foodCategory,
      quantity,
      price,
      foodOrigin,
      shortDescription,
      purchaseCount: 0,
      addedBy: {
        name: user?.displayName || 'Unknown User',
        email: user?.email
      }
    };

    try {
      setLoading(true);
      const res = await fetch('https://restaurant-management-server-liart.vercel.app/foods', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newFood)
      });

      const data = await res.json();

      if (data.insertedId || data.acknowledged) {
        toast.success('Food added successfully!');
        form.reset();
        navigate('/my-orders')
      } else {
        toast.error('Failed to add food item.');
      }
    } catch (error) {
      toast.error('Error adding food item.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-center text-green-700">Add New Food</h2>

      <form onSubmit={handleAddFood} className="space-y-4">
        <input className="input input-bordered w-full" type="text" name="foodName" placeholder="Food Name" required />

        <input className="input input-bordered w-full" type="text" name="foodImage" placeholder="Food Image URL" required />

        <input className="input input-bordered w-full" type="text" name="foodCategory" placeholder="Food Category" required />

        <input className="input input-bordered w-full" type="number" name="quantity" placeholder="Quantity" required />

        <input className="input input-bordered w-full" type="number" step="0.01" name="price" placeholder="Price ($)" required />

        <input className="input input-bordered w-full" type="text" name="foodOrigin" placeholder="Food Origin (Country)" required />

        <textarea className="textarea textarea-bordered w-full" name="shortDescription" placeholder="Short Description (ingredients, procedure, etc)" required></textarea>

        <button type="submit" className="btn bg-yellow-400 hover:bg-yellow-500 w-full" disabled={loading}>
          {loading ? 'Adding Food ...' : 'Add Food'}
        </button>
      </form>
    </div>
  );
};

export default AddFood;
