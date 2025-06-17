import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const SingleFood = () => {
  const { id } = useParams();
  const [food, setFood] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`https://restaurant-management-server-liart.vercel.app/foods/${id}`)
      .then(res => res.json())
      .then(data => setFood(data))
      .catch(err => console.error(err));
  }, [id]);

  if (!food) {
    return <div className="text-center mt-10">Loading food details...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto my-10 p-4 bg-white shadow rounded-lg">
      <img src={food.foodImage} alt={food.foodName} className="w-full h-80 object-cover rounded-lg mb-6" />
      <h2 className="text-3xl font-bold mb-2">{food.foodName}</h2>
      <p className="text-gray-600 mb-4">{food.shortDescription}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <strong>Category:</strong> {food.foodCategory}
        </div>
        <div>
          <strong>Origin:</strong> {food.foodOrigin}
        </div>
        <div>
          <strong>Price:</strong> ${food.price}
        </div>
        <div>
          <strong>Quantity:</strong> {food.quantity}
        </div>
        <div>
          <strong>Purchase Count:</strong> {food.purchaseCount || 0}
        </div>
        <div>
          <strong>Added By:</strong> {food.addedBy?.name} ({food.addedBy?.email})
        </div>
      </div>

      <button
        onClick={() => navigate(`/purchase/${food._id}`)}
        className="bg-yellow-400 hover:bg-yellow-600 text-black px-6 py-2 rounded-lg font-bold "
      >
        Purchase Now
      </button>
    </div>
  );
};

export default SingleFood;
