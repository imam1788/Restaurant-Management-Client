import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../providers/AuthProvider';
import Swal from 'sweetalert2';

const MyFoods = () => {
  const { user } = useContext(AuthContext);
  const [myFoods, setMyFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingFood, setEditingFood] = useState(null); // food being edited
  const [showModal, setShowModal] = useState(false);    // modal visibility

  useEffect(() => {
    if (!user) return;

    fetch(`http://localhost:5000/my-foods?email=${user.email}`)
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
    console.log("Selected food for editing:", food);
    setEditingFood(food);
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingFood({ ...editingFood, [name]: value });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    const { _id, ...updateData } = editingFood; // ✅ remove _id from the update payload

    try {
      const response = await fetch(`http://localhost:5000/foods/${_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();
      console.log('✅ Update result:', data);

      if (data.modifiedCount > 0) {
        Swal.fire('Success!', 'Food updated successfully.', 'success');

        const updatedFoods = myFoods.map(food =>
          food._id === _id ? { ...food, ...updateData } : food
        );
        setMyFoods(updatedFoods);

        setShowModal(false);
      }
    } catch (error) {
      console.error('🔥 Update error:', error);
    }
  };

  if (loading) return <p>Loading your foods...</p>;
  if (!myFoods.length) return <p>No foods added yet.</p>;

  return (
    <div className='pb-10 px-4'>
      <div className="mb-8 text-center bg-green-100 py-6 rounded shadow">
        <h1 className="text-4xl font-bold text-green-700">My Foods</h1>
      </div>

      {/* Cards */}
      <div className='flex flex-wrap gap-6'>
        {myFoods.map(food => (
          <div key={food._id} className='border rounded-md p-4 w-72 shadow'>
            <img src={food.foodImage} alt={food.foodName} className='w-full h-40 object-cover rounded' />
            <h3 className='font-bold mt-2'>{food.foodName}</h3>
            <p>Category: {food.foodCategory}</p>
            <p className='font-bold text-green-700'>${food.price}</p>
            <p>Quantity: {food.quantity}</p>
            <button onClick={() => handleUpdateClick(food)} className='btn btn-success mt-3.5 font-semibold'>Update</button>


          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && editingFood && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-xl shadow-lg relative">
            <button onClick={() => setShowModal(false)} className="absolute top-2 right-2 text-lg font-bold">✖</button>
            <div className="mb-8 text-center bg-green-100 py-6 px-5 rounded shadow">
              <h1 className="text-2xl font-bold text-green-700">Update Food</h1>
            </div>
            <form onSubmit={handleUpdateSubmit} className="space-y-3">
              <input type="text" name="foodName" value={editingFood.foodName} onChange={handleInputChange} className="w-full p-2 border rounded" placeholder="Food Name" required />
              <input type="text" name="foodImage" value={editingFood.foodImage} onChange={handleInputChange} className="w-full p-2 border rounded" placeholder="Image URL" required />
              <input type="text" name="foodCategory" value={editingFood.foodCategory} onChange={handleInputChange} className="w-full p-2 border rounded" placeholder="Category" required />
              <input type="number" name="quantity" value={editingFood.quantity} onChange={handleInputChange} className="w-full p-2 border rounded" placeholder="Quantity" required />
              <input type="number" name="price" value={editingFood.price} onChange={handleInputChange} className="w-full p-2 border rounded" placeholder="Price" required />
              <textarea name="shortDescription" value={editingFood.shortDescription} onChange={handleInputChange} className="w-full p-2 border rounded" placeholder="Short Description" rows={3} required />
              <button type="submit" className="btn bg-yellow-500 hover:bg-yellow-600 text-white w-full">Update Food</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyFoods;
