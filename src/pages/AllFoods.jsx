import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import Loader from "../components/Loader";

const AllFoods = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    AOS.init({ duration: 800, once: false });
  }, []);

  useEffect(() => {
    fetch("https://restaurant-management-server-liart.vercel.app/foods")
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

  const sortedFoods = filteredFoods.sort((a, b) => {
    if (sortOrder === "asc") return a.price - b.price;
    else return b.price - a.price;
  });

  if (loading) {
    return <Loader></Loader> ;
  }

  return (
    <div className="container mx-auto px-4 pb-8">
      <div
        className="mb-8 text-center bg-green-100 py-6 rounded shadow"
        data-aos="fade-down"
      >
        <h1 className="text-4xl font-bold text-green-700">All Foods</h1>
      </div>

      {/* Search and Sort Controls */}
      <div
        className="mb-6 flex flex-col md:flex-row justify-center items-center gap-4"
        data-aos="fade-up"
      >
        <input
          type="text"
          placeholder="Search foods..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input input-bordered w-full max-w-md focus:outline-none 
    focus:ring-2 
    focus:ring-yellow-400 
    focus:border-yellow-400"
        />

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="
    bg-white 
    border 
    border-gray-300 
    rounded-md 
    px-4 
    py-2 
    shadow-sm 
    focus:outline-none 
    focus:ring-2 
    focus:ring-yellow-400 
    focus:border-yellow-400
    cursor-pointer
    transition
    duration-200
    max-w-xs
  "
          aria-label="Sort foods by price"
        >
          <option value="asc">Sort by price: Low to High</option>
          <option value="desc">Sort by price: High to Low</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {sortedFoods.length === 0 ? (
          <p>No foods found.</p>
        ) : (
          sortedFoods.map((food) => (
            <div
              key={food._id}
              className="rounded-lg shadow-md p-4 flex flex-col"
              style={{ minHeight: "380px" }} // uniform card height
              data-aos="zoom-in"
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
              <Link
                to={`/foods/${food._id}`}
                className="btn bg-yellow-400 mt-auto hover:bg-yellow-500 text-black"
              >
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
