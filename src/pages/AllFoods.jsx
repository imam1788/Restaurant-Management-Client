import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const AllFoods = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/foods")
      .then((res) => res.json())
      .then((data) => {
        setFoods(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch foods:", err);
        setLoading(false);
      });
  }, []);

  const filteredFoods = foods.filter((food) =>
    (food.foodName ?? "").toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="text-center mt-10">Loading foods...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center bg-green-100 py-6 rounded shadow">
        <h1 className="text-4xl font-bold text-green-700">All Foods</h1>
      </div>

      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search foods..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input input-bordered w-full max-w-md"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredFoods.length === 0 ? (
          <p>No foods found.</p>
        ) : (
          filteredFoods.map((food) => (
            <div
              key={food._id}
              className=" rounded-lg shadow-md p-4 flex flex-col"
            >
              <img
                src={food.foodImage}
                alt={food.foodName}
                className="h-40 object-cover rounded mb-4"
              />
              <h2 className="text-xl font-semibold mb-2">{food.foodName}</h2>
              <p className="text-gray-600 mb-2">{food.shortDescription}</p>
              <p className="font-semibold mb-2">Price: ${food.price}</p>
              <p className="mb-4">Quantity: {food.quantity}</p>
              <Link to={`/foods/${food._id}`} className="btn bg-yellow-400 mt-auto">
                Details
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AllFoods;
