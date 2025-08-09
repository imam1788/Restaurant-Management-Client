import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

const TopFoods = () => {
  const [topFoods, setTopFoods] = useState([]);

  useEffect(() => {
    AOS.init({ duration: 800, once: false });
    
    fetch("https://restaurant-management-server-liart.vercel.app/foods")
      .then((res) => res.json())
      .then((data) => {
        const sorted = data.sort((a, b) => b.purchaseCount - a.purchaseCount);
        setTopFoods(sorted.slice(0, 6));
      })
      .catch((err) => console.error("Failed to load top foods:", err));
  }, []);

  return (
    <div className="container mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-6 text-center text-green-700">
        Top Selling Foods
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {topFoods.map((food) => (
          <div
            key={food._id}
            className="bg-white shadow rounded-lg p-4 flex flex-col"
            data-aos="fade-up"
          >
            <img
              src={food.foodImage}
              alt={food.foodName}
              className="h-40 w-full object-cover rounded mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">{food.foodName}</h3>
            <p className="text-gray-600 mb-1">
              <strong>Price:</strong> ${food.price}
            </p>
            <p className="text-gray-600 mb-4">
              <strong>Sold:</strong> {food.purchaseCount} times
            </p>
            <Link
              to={`/foods/${food._id}`}
              className="btn bg-yellow-400 hover:bg-yellow-500 text-black mt-auto rounded"
              aria-label={`View details about ${food.foodName}`}
            >
              Details
            </Link>
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <Link
          to="/all-foods"
          className="btn bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded"
          aria-label="See all foods"
        >
          See All Foods
        </Link>
      </div>
    </div>
  );
};

export default TopFoods;
