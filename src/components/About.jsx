import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 800, once: true, easing: "ease-in-out" });
  }, []);

  const handleViewMenu = () => {
    navigate("/all-foods");
  };

  const handleMakeReservation = () => {
    navigate("/reservation");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center px-6 py-2 bg-amber-100 rounded-full border border-amber-200 mb-6">
            <span className="text-amber-700 text-sm font-semibold">🍽️ Our Story</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            About <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">TasteHub</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover the passion and tradition behind every dish we serve
          </p>
        </motion.div>

        {/* Main Content */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border border-amber-200 p-8 md:p-12"
          data-aos="fade-up"
        >
          <div className="space-y-6">
            <p className="text-gray-700 text-lg leading-relaxed">
              Welcome to <span className="font-bold text-amber-600">TasteHub</span>, your ultimate destination for delicious, high-quality food crafted with passion and precision. Since our inception, we've been dedicated to bringing a diverse selection of exquisite dishes, made with fresh ingredients and authentic flavors, to food lovers everywhere.
            </p>

            <p className="text-gray-700 text-lg leading-relaxed">
              At TasteHub, we believe that every meal should be a memorable experience. That's why we work closely with top chefs and local suppliers to ensure our menu offers both classic favorites and innovative creations. Whether you're craving comfort food or something adventurous, we have something to satisfy every palate.
            </p>

            <p className="text-gray-700 text-lg leading-relaxed">
              Our commitment to excellence doesn't stop at food. We prioritize fast and reliable service, exceptional customer care, and a seamless dining experience. With TasteHub, enjoying your favorite meals has never been more delightful or convenient.
            </p>

            <p className="text-gray-700 text-lg leading-relaxed">
              Thank you for choosing TasteHub. We look forward to serving you and making every meal an occasion to remember!
            </p>
          </div>

          {/* Mission & Vision */}
          <div className="mt-12 grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-amber-600">🎯</span>
                </div>
                <h2 className="text-2xl font-bold text-amber-800 mb-4">Our Mission</h2>
                <p className="text-gray-600 leading-relaxed">
                  Delivering exceptional culinary experiences with quality, creativity, and care—bringing joy to every table we serve.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border border-amber-200"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-orange-600">🌟</span>
                </div>
                <h2 className="text-2xl font-bold text-orange-800 mb-4">Our Vision</h2>
                <p className="text-gray-600 leading-relaxed">
                  To become the most beloved culinary destination, where every meal tells a story and every guest feels like family.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Values */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-12"
          >
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: "🌱", title: "Fresh Ingredients", desc: "We source only the finest, freshest ingredients for every dish." },
                { icon: "👨‍🍳", title: "Culinary Excellence", desc: "Our chefs bring creativity and expertise to every plate." },
                { icon: "💝", title: "Guest First", desc: "Your satisfaction is our top priority in everything we do." }
              ].map((value, index) => (
                <div key={index} className="text-center p-6 bg-white rounded-xl border border-amber-200 hover:shadow-lg transition-shadow duration-300">
                  <div className="text-3xl mb-4">{value.icon}</div>
                  <h3 className="text-xl font-semibold text-amber-800 mb-3">{value.title}</h3>
                  <p className="text-gray-600 text-sm">{value.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-12 text-center"
          >
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Ready to Experience TasteHub?</h3>
              <p className="text-amber-100 mb-6 max-w-2xl mx-auto">
                Join us for an unforgettable culinary journey. Reserve your table or order online today!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={handleViewMenu}
                  className="px-8 py-3 bg-white text-amber-600 font-semibold rounded-xl hover:bg-amber-50 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  View Our Menu
                </button>
                <button 
                  onClick={handleMakeReservation}
                  className="px-8 py-3 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-amber-600 transition-all duration-300"
                >
                  Make Reservation
                </button>
              </div>
            </div>
          </motion.div>
        </motion.section>
      </div>
    </div>
  );
};

export default About;