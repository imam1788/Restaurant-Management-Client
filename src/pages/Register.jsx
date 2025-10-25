import React, { useContext, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const Register = () => {
  const { register, loginWithGoogle } = useContext(AuthContext);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const validatePassword = (password) => {
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const minLength = password.length >= 6;
    return hasUpper && hasLower && minLength;
  };

  // Smart image compression for Firebase compatibility (handles up to 20MB)
  const compressImage = (file, maxWidth = 400, initialQuality = 0.8) => {
    return new Promise((resolve) => {
      // Check file size limit (20MB = 20 * 1024 * 1024 = 20971520 bytes)
      const maxSizeBytes = 20 * 1024 * 1024;
      if (!file || file.size > maxSizeBytes) {
        toast.error("Image is too large. Please select an image under 20MB.");
        resolve("");
        return;
      }

      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file (PNG, JPG, JPEG)');
        resolve("");
        return;
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        try {
          // Calculate new dimensions while maintaining aspect ratio
          let width = img.width;
          let height = img.height;

          // Only resize if image is larger than maxWidth
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          // Draw image on canvas
          ctx.drawImage(img, 0, 0, width, height);

          // Try multiple quality levels to find one that fits Firebase limits
          const tryCompression = (quality) => {
            const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
            console.log(`Compression attempt - Quality: ${quality}, Size: ${compressedDataUrl.length} characters`);

            // Firebase limit is around 2000 characters for photoURL
            if (compressedDataUrl.length <= 1800) {
              console.log("✅ Compression successful with quality:", quality);
              return compressedDataUrl;
            } else if (quality > 0.1) {
              // Try lower quality
              return tryCompression(quality * 0.7); // Reduce quality by 30% each attempt
            } else {
              // If we reach minimum quality and it's still too big, resize smaller
              if (width > 100) {
                console.log("Image still too big, resizing smaller...");
                width = Math.max(width * 0.7, 100); // Reduce size by 30%
                height = (height * width) / img.width;
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);
                return tryCompression(0.6); // Try with medium quality again
              } else {
                console.log("❌ Could not compress image to Firebase limits");
                return "";
              }
            }
          };

          const finalCompressedImage = tryCompression(initialQuality);
          console.log("Final compressed image size:", finalCompressedImage.length, "characters");
          resolve(finalCompressedImage);

        } catch (error) {
          console.error("Image compression error:", error);
          resolve(""); // Fallback to no photo on error
        }
      };

      img.onerror = () => {
        console.error("Image loading error");
        toast.error("Failed to load image. Please try another file.");
        resolve(""); // Fallback to no photo on error
      };

      img.src = URL.createObjectURL(file);
    });
  };

  // Handle file selection and preview
  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (20MB limit)
      const maxSizeBytes = 20 * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        toast.error('Please select an image smaller than 20MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file (PNG, JPG, JPEG)');
        return;
      }

      setSelectedFile(file);

      try {
        // Create a preview with better quality (not the compressed version)
        const reader = new FileReader();
        reader.onload = (e) => {
          setPhotoPreview(e.target.result);
        };
        reader.readAsDataURL(file);

        console.log("File selected for preview:", file.name, "Size:", file.size, "bytes");
      } catch (error) {
        console.error("Preview generation failed:", error);
        // Fallback to file reader for preview
        const reader = new FileReader();
        reader.onload = (e) => {
          setPhotoPreview(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  };
  // Trigger file input click
  const handleCircleClick = () => {
    fileInputRef.current?.click();
  };

  // Clear selected photo
  const clearPhoto = (e) => {
    e.stopPropagation();
    setPhotoPreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword(password)) {
      toast.error(
        "Password must have at least 6 characters, including uppercase and lowercase letters."
      );
      return;
    }

    setLoading(true);

    try {
      let photoURL = "";

      // Only process image if file is selected
      if (selectedFile) {
        console.log("Original file size:", selectedFile.size, "bytes");

        // Show loading message for large files
        if (selectedFile.size > 5 * 1024 * 1024) { // 5MB
          toast.info("Compressing large image... This may take a moment.");
        }

        photoURL = await compressImage(selectedFile, 400, 0.8); // Start with good quality
        console.log("Final compressed image size:", photoURL.length, "characters");

        // If compression failed, notify user but continue without photo
        if (!photoURL || photoURL.length === 0) {
          console.log("Image compression failed, continuing without profile photo");
          toast.warning("Could not process profile photo. Continuing without it.");
        } else {
          console.log("✅ Image compressed successfully");
        }
      }

      // Firebase registration
      const { user: firebaseUser, fullPhotoURL } = await register(email, password, name, photoURL);

      console.log("Registration successful, Firebase user:", firebaseUser);

      toast.success("Registration successful! Welcome to TasteHub!");

      // Navigate to home page
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);

    } catch (err) {
      console.error("Registration error:", err);

      // More user-friendly error messages
      if (err.message.includes('Photo URL too long') || err.message.includes('invalid-profile-attribute')) {
        toast.error("Profile photo is too large. Please try without a photo or use a smaller image.");
      } else {
        toast.error(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Google registration handler
  const handleGoogleRegister = () => {
    setLoading(true);
    loginWithGoogle()
      .then((result) => {
        // Also save Google user to MongoDB with customer role
        const userData = {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName || '',
          photoURL: result.user.photoURL || '',
          role: 'customer'
        };

        return fetch('http://localhost:5000/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });
      })
      .then(async response => {
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create user profile');
        }
        toast.success("Google registration successful!");
        navigate("/");
      })
      .catch((err) => {
        console.error("Google registration error:", err);
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
            <span className="text-amber-700 text-sm font-semibold">👋 Join Us</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Create Your <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">TasteHub</span> Account
          </h1>
          <p className="text-gray-600">
            Join our community of food lovers and start your culinary journey today!
          </p>
        </motion.div>

        {/* Registration Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg border border-amber-200 p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Photo Upload */}
            <div className="flex flex-col items-center">
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Profile Photo <span className="text-gray-500 text-sm">(optional)</span>
              </label>

              {/* Circular Photo Upload Area */}
              <div className="relative">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCircleClick}
                  className={`w-32 h-32 rounded-full border-2 border-dashed cursor-pointer transition-all duration-300 flex items-center justify-center overflow-hidden ${photoPreview
                    ? 'border-amber-400 bg-amber-50'
                    : 'border-gray-300 hover:border-amber-400 hover:bg-amber-50'
                    }`}
                >
                  {photoPreview ? (
                    <div className="relative w-full h-full">
                      <img
                        src={photoPreview}
                        alt="Profile preview"
                        className="w-full h-full object-cover rounded-full"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                        <div className="text-white text-center">
                          <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-1">
                            <span className="text-lg">📷</span>
                          </div>
                          <p className="text-sm font-medium">Change Photo</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-4">
                      <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-xl text-amber-600">📷</span>
                      </div>
                      <p className="text-sm font-medium text-gray-700">
                        Click to upload
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, JPEG supported
                      </p>
                    </div>
                  )}
                </motion.div>

                {photoPreview && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    type="button"
                    onClick={clearPhoto}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-200 shadow-lg border-2 border-white"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <span className="text-sm font-bold">×</span>
                  </motion.button>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              <p className="text-xs text-gray-500 text-center mt-4 max-w-xs">
                Add a profile picture to personalize your account. This will be visible to other users.
              </p>
            </div>

            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300"
                disabled={loading}
              />
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                placeholder="Enter your email address"
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
                Password *
              </label>
              <input
                type="password"
                placeholder="Create a strong password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300"
                disabled={loading}
              />
              <div className="mt-2 space-y-1">
                <div className="flex items-center text-xs text-gray-500">
                  <div className={`w-2 h-2 rounded-full mr-2 ${password.length >= 6 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  At least 6 characters
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <div className={`w-2 h-2 rounded-full mr-2 ${/[A-Z]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  One uppercase letter
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <div className={`w-2 h-2 rounded-full mr-2 ${/[a-z]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  One lowercase letter
                </div>
              </div>
            </div>

            {/* Register Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={!loading ? { scale: 1.02 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
              className={`w-full py-4 font-semibold rounded-xl shadow-lg transition-all duration-300 ${loading
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-amber-500/25'
                }`}
            >
              {loading ? (
                <span className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </span>
              ) : (
                'Join TasteHub'
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-sm text-gray-500">or continue with</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Continue with Google Button */}
          <motion.button
            onClick={handleGoogleRegister}
            disabled={loading}
            whileHover={!loading ? { scale: 1.02 } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
            className={`w-full py-3 border-2 border-gray-300 font-semibold rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 ${loading
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:border-amber-300 hover:bg-amber-50'
              }`}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span>{loading ? "Please wait..." : "Continue with Google"}</span>
          </motion.button>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-amber-600 hover:text-amber-700 underline transition-colors duration-200"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-8"
        >
          <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
            <h3 className="font-semibold text-amber-800 mb-4 text-center">Why Join TasteHub?</h3>
            <div className="space-y-3">
              {[
                { icon: "🍽️", text: "Discover amazing food from top restaurants" },
                { icon: "⭐", text: "Save your favorite dishes and restaurants" },
                { icon: "🚚", text: "Fast and reliable delivery service" },
                { icon: "🎁", text: "Exclusive deals and promotions" },
                { icon: "📱", text: "Easy ordering with real-time tracking" }
              ].map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <span className="text-lg">{benefit.icon}</span>
                  <span className="text-amber-700 text-sm">{benefit.text}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;