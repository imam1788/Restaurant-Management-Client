import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const Login = () => {
  const { login, loginWithGoogle, resetPassword } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showReset, setShowReset] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    login(email, password)
      .then(() => {
        toast.success("Login successful!");
        navigate(from, { replace: true });
      })
      .catch((err) => {
        toast.error(err.message);
        // Show reset password option if user doesn't exist
        if (err.message.includes("No account found") || err.message.includes("Invalid email or password")) {
          setShowReset(true);
        }
      })
      .finally(() => setLoading(false));
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    loginWithGoogle()
      .then(() => {
        toast.success("Google login successful!");
        navigate(from, { replace: true });
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  };

  const handleResetPassword = () => {
    if (!email) {
      toast.error("Please enter your email address first");
      return;
    }

    setLoading(true);
    resetPassword(email)
      .then(() => {
        toast.success("Password reset email sent! Check your inbox.");
        setShowReset(false);
      })
      .catch((err) => {
        toast.error(err.message);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-8 flex items-center justify-center px-4">
      <div className="container max-w-md mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center px-6 py-2 bg-amber-100 rounded-full border border-amber-200 mb-6">
            <span className="text-amber-700 text-sm font-semibold">🔐 Welcome Back</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Sign In to <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">TasteHub</span>
          </h1>
          <p className="text-gray-600">
            Welcome back! Please enter your details to continue your culinary journey.
          </p>
        </motion.div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg border border-amber-200 p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300"
                disabled={loading}
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300"
                disabled={loading}
              />
            </div>

            {/* Reset Password Prompt */}
            {showReset && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-red-50 border border-red-200 rounded-xl p-4"
              >
                <p className="text-red-700 text-sm mb-3">
                  Cannot sign in? You might need to register first or reset your password.
                </p>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={handleResetPassword}
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors disabled:bg-red-300"
                  >
                    Reset Password
                  </button>
                  <Link
                    to="/register"
                    className="flex-1 px-4 py-2 border border-amber-500 text-amber-600 text-sm font-medium rounded-lg hover:bg-amber-50 text-center transition-colors"
                  >
                    Register
                  </Link>
                </div>
              </motion.div>
            )}

            {/* Login Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={!loading ? { scale: 1.02 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
              className={`w-full py-4 font-semibold rounded-xl shadow-lg transition-all duration-300 ${
                loading
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-amber-500/25'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </span>
              ) : (
                'Sign In to TasteHub'
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-sm text-gray-500">or continue with</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Google Login Button */}
          <motion.button
            onClick={handleGoogleLogin}
            disabled={loading}
            whileHover={!loading ? { scale: 1.02 } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
            className={`w-full py-3 border-2 border-gray-300 font-semibold rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 ${
              loading
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:border-amber-300 hover:bg-amber-50'
            }`}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>{loading ? "Please wait..." : "Continue with Google"}</span>
          </motion.button>

          {/* Register Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link 
                to="/register" 
                className="font-semibold text-amber-600 hover:text-amber-700 underline transition-colors duration-200"
              >
                Create account here
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-8 text-center"
        >
          <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
            <h3 className="font-semibold text-amber-800 mb-2">New to TasteHub?</h3>
            <p className="text-amber-700 text-sm">
              Join our community of food lovers and discover amazing culinary experiences!
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;