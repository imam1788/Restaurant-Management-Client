import React from "react";

const Loader = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-white">
      <div className="relative flex justify-center items-center">
        <div className="absolute -top-10 flex space-x-2">
          <span className="w-2 h-6 bg-yellow-400 rounded-full animate-bounce delay-100"></span>
          <span className="w-2 h-8 bg-yellow-300 rounded-full animate-bounce delay-200"></span>
          <span className="w-2 h-6 bg-yellow-400 rounded-full animate-bounce delay-300"></span>
        </div>

        <div className="w-20 h-20 border-4 border-yellow-500 rounded-full animate-spin"></div>

        <div className="absolute w-10 h-10 bg-green-400 rounded-full shadow-lg"></div>
      </div>

      <p className="mt-6 text-lg font-semibold text-yellow-600 animate-pulse">
        "Just a moment, your food is on the way!"
      </p>
    </div>
  );
};

export default Loader;
