import React, { useState } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    Swal.fire({
      title: "Message Sent!",
      text: "Thank you for contacting us. We'll get back to you soon!",
      icon: "success",
      confirmButtonColor: "#f59e0b",
      confirmButtonText: "Great!",
      background: "#fffbeb",
      color: "#1f2937"
    });

    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  const contactInfo = [
    {
      icon: "📍",
      title: "Our Address",
      details: ["123 Restaurant Street", "Food City, FC 12345"],
      action: () => window.open('https://www.google.com/maps/search/?api=1&query=123+Restaurant+Street+Food+City+FC+12345', '_blank')
    },
    {
      icon: "📞",
      title: "Phone Number",
      details: ["(555) 123-4567", "Mon-Sun: 9AM-10PM"],
      action: () => window.open('tel:5551234567')
    },
    {
      icon: "✉️",
      title: "Email Address",
      details: ["info@tastehub.com", "reservations@tastehub.com"],
      action: () => window.open('mailto:info@tastehub.com')
    },
    {
      icon: "⏰",
      title: "Opening Hours",
      details: ["Mon-Fri: 11AM-10PM", "Sat-Sun: 10AM-11PM"],
      action: null
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-6 py-2 bg-amber-100 rounded-full border border-amber-200 mb-6">
            <span className="text-amber-700 text-sm font-semibold">💬 Get In Touch</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Contact <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Us</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Have questions or feedback? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            {contactInfo.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02, y: -5 }}
                className={`bg-white rounded-2xl shadow-lg border border-amber-200 p-6 cursor-pointer ${item.action ? 'hover:shadow-xl transition-all duration-300' : ''}`}
                onClick={item.action}
              >
                <div className="flex items-start space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl">{item.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 mb-2">{item.title}</h3>
                    {item.details.map((detail, idx) => (
                      <p key={idx} className="text-gray-600 text-sm mb-1 last:mb-0">
                        {detail}
                      </p>
                    ))}
                  </div>
                  {item.action && (
                    <div className="text-amber-500 transform group-hover:translate-x-1 transition-transform">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {/* Quick Actions */}
            <div className="bg-amber-50 rounded-2xl border border-amber-200 p-6">
              <h3 className="font-bold text-amber-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => window.open('https://www.google.com/maps/search/?api=1&query=123+Restaurant+Street+Food+City+FC+12345', '_blank')}
                  className="w-full flex items-center justify-between p-3 bg-white rounded-lg border border-amber-200 hover:border-amber-300 transition-colors group"
                >
                  <span className="text-gray-700 group-hover:text-amber-700">Get Directions</span>
                  <span className="text-amber-500">🗺️</span>
                </button>
                <button 
                  onClick={() => window.open('tel:5551234567')}
                  className="w-full flex items-center justify-between p-3 bg-white rounded-lg border border-amber-200 hover:border-amber-300 transition-colors group"
                >
                  <span className="text-gray-700 group-hover:text-amber-700">Call Now</span>
                  <span className="text-amber-500">📞</span>
                </button>
                <button 
                  onClick={() => window.open('mailto:info@tastehub.com')}
                  className="w-full flex items-center justify-between p-3 bg-white rounded-lg border border-amber-200 hover:border-amber-300 transition-colors group"
                >
                  <span className="text-gray-700 group-hover:text-amber-700">Send Email</span>
                  <span className="text-amber-500">✉️</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl shadow-lg border border-amber-200 p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Send us a Message</h2>
              <p className="text-gray-600 mb-6">Fill out the form below and we'll get back to you within 24 hours.</p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-gray-700 mb-2 font-medium">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-gray-700 mb-2 font-medium">Email Address *</label>
                    <input
                      type="email"
                      id="email"
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
                    <label htmlFor="phone" className="block text-gray-700 mb-2 font-medium">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-gray-700 mb-2 font-medium">Subject *</label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="reservation">Reservation</option>
                      <option value="feedback">Feedback</option>
                      <option value="complaint">Complaint</option>
                      <option value="partnership">Partnership</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-gray-700 mb-2 font-medium">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    placeholder="Tell us how we can help you..."
                  ></textarea>
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-6 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-amber-500/25 transition-all duration-300 text-lg"
                >
                  Send Message
                </motion.button>

                <p className="text-center text-gray-500 text-sm">
                  We typically respond within 2-4 hours during business hours.
                </p>
              </form>
            </div>

            {/* FAQ Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-8 bg-white rounded-2xl shadow-lg border border-amber-200 p-6"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h3>
              <div className="space-y-4">
                {[
                  {
                    question: "How do I make a reservation?",
                    answer: "You can make reservations through our website, by calling us directly, or using the reservation form."
                  },
                  {
                    question: "Do you offer catering services?",
                    answer: "Yes! We offer full catering services for events. Contact us for custom menus and pricing."
                  },
                  {
                    question: "What are your COVID-19 safety measures?",
                    answer: "We follow all local health guidelines, with enhanced cleaning and optional contactless dining."
                  }
                ].map((faq, index) => (
                  <div key={index} className="border-b border-amber-100 last:border-b-0 pb-4 last:pb-0">
                    <h4 className="font-semibold text-gray-800 mb-2">{faq.question}</h4>
                    <p className="text-gray-600 text-sm">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;