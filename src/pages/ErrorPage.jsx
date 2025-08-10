import React from "react";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 px-6">
      <div className="bg-white rounded-xl shadow-lg p-10 max-w-md w-full text-center">
        <h1 className="text-9xl font-extrabold text-green-800 mb-6 drop-shadow-md">
          404
        </h1>
        <h2 className="text-3xl font-bold mb-4 text-green-700">
          Oops! Page Not Found
        </h2>
        <p className="text-green-600 mb-8">
          The page you are looking for might have been removed or is temporarily unavailable.
        </p>
        <Link
          to="/"
          className="inline-block bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-8 rounded-lg shadow-lg transition"
          aria-label="Go back to home page"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
