import React from "react";
import { motion } from "framer-motion";

const Loader = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex flex-col justify-center items-center px-4">
      {/* Animated Food Icons */}
      <div className="relative flex justify-center items-center my-8">
        {/* Rotating Plate */}
        <motion.div
          className="w-24 h-24 border-4 border-amber-200 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Floating Food Items */}
        <motion.div
          className="absolute w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full shadow-lg"
          animate={{
            scale: [1, 1.2, 1],
            y: [0, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Secondary Floating Item */}
        <motion.div
          className="absolute w-6 h-6 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full shadow-lg -left-4"
          animate={{
            scale: [1, 1.3, 1],
            y: [0, -15, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        />
        
        {/* Tertiary Floating Item */}
        <motion.div
          className="absolute w-5 h-5 bg-gradient-to-r from-amber-300 to-orange-300 rounded-full shadow-lg -right-2 -top-2"
          animate={{
            scale: [1, 1.4, 1],
            y: [0, -12, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>

      {/* Loading Text with Typing Animation */}
      <div className="text-center mb-12">
        <motion.h2
          className="text-2xl md:text-3xl font-bold text-gray-800 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Preparing Your{" "}
          <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            TasteHub
          </span>{" "}
          Experience
        </motion.h2>
        
        <motion.p
          className="text-gray-600 text-lg max-w-md mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Just a moment while we prepare something delicious for you...
        </motion.p>
      </div>

      {/* Animated Progress Bar */}
      <div className="w-64 md:w-80 bg-amber-100 rounded-full h-2 mb-8 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Floating Food Icons Around */}
      <div className="flex justify-center items-center space-x-6 mb-8">
        {["🍕", "🍔", "🍣", "🍦", "☕"].map((icon, index) => (
          <motion.div
            key={index}
            className="text-2xl"
            animate={{
              y: [0, -15, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.3
            }}
          >
            {icon}
          </motion.div>
        ))}
      </div>

      {/* Chef Quote */}
      <motion.div
        className="bg-white rounded-2xl shadow-lg border border-amber-200 p-6 max-w-sm text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <span className="text-xl">👨‍🍳</span>
        </div>
        <p className="text-amber-700 italic font-medium">
          "Good food takes time, but it's worth the wait!"
        </p>
      </motion.div>

      {/* Loading Dots */}
      <motion.div
        className="flex space-x-2 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="w-3 h-3 bg-amber-500 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.2
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default Loader;