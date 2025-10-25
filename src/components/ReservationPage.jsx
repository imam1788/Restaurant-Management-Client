import React, { useState } from "react";
import { motion } from "framer-motion";

const ReservationPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: "2",
    specialRequests: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle reservation submission
    console.log("Reservation submitted:", formData);
    alert("Reservation submitted successfully! We'll confirm shortly.");
  };

  const timeSlots = [
    "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", 
    "1:00 PM", "1:30 PM", "2:00 PM", "5:00 PM", 
    "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM", 
    "7:30 PM", "8:00 PM", "8:30 PM", "9:00 PM"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center px-6 py-2 bg-amber-100 rounded-full border border-amber-200 mb-6">
            <span className="text-amber-700 text-sm font-semibold">📅 Book Your Table</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Make a <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Reservation</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Reserve your table online and enjoy a seamless dining experience with us.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Reservation Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl shadow-lg border border-amber-200 p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Reservation Details</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">Full Name *</label>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">Email *</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">Phone Number *</label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">Number of Guests *</label>
                    <select 
                      name="guests"
                      value={formData.guests}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? 'person' : 'people'}</option>
                      ))}
                      <option value="11+">11+ people (Please call)</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">Date *</label>
                    <input 
                      type="date" 
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">Time *</label>
                    <select 
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    >
                      <option value="">Select a time</option>
                      {timeSlots.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Special Requests</label>
                  <textarea 
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    placeholder="Any special occasions or dietary requirements?"
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  className="w-full px-6 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-amber-500/25 transform hover:-translate-y-1 transition-all duration-300 text-lg"
                >
                  Confirm Reservation
                </button>
              </form>
            </div>
          </motion.div>

          {/* Sidebar Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            {/* Reservation Tips */}
            <div className="bg-white rounded-2xl shadow-lg border border-amber-200 p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Reservation Tips</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start space-x-3">
                  <span className="text-amber-500 mt-1">•</span>
                  <span>Book at least 24 hours in advance</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-amber-500 mt-1">•</span>
                  <span>For groups of 8+, please call us directly</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-amber-500 mt-1">•</span>
                  <span>We hold tables for 15 minutes past reservation time</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-amber-500 mt-1">•</span>
                  <span>Special dietary needs? Let us know in advance</span>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-2xl shadow-lg border border-amber-200 p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Need Help?</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <span className="text-amber-500">📞</span>
                  <span className="text-gray-600">(555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-amber-500">✉️</span>
                  <span className="text-gray-600">reservations@tastehub.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-amber-500">⏰</span>
                  <span className="text-gray-600">Mon-Sun: 9AM-10PM</span>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-amber-50 rounded-2xl border border-amber-200 p-6">
              <h3 className="text-lg font-bold text-amber-800 mb-2">Running Late?</h3>
              <p className="text-amber-700 text-sm mb-3">
                Please call us if you're running more than 15 minutes late.
              </p>
              <button 
                onClick={() => window.open('tel:5551234567')}
                className="w-full px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium"
              >
                Call Now
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ReservationPage;