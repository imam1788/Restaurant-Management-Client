import React, { useEffect } from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaMapMarkerAlt, FaPhone, FaEnvelope, FaUtensils } from "react-icons/fa";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

const Footer = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true }); // Changed to once: true to prevent re-animation
  }, []);

  return (
    <footer className="bg-white border-t border-gray-200 pt-16 pb-8 shadow-sm">
      <div className="container mx-auto px-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Info */}
          <div data-aos="fade-up" data-aos-delay="100" className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <FaUtensils className="text-white text-lg" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  TasteHub
                </h2>
                <p className="text-gray-600 text-sm">Premium Dining Experience</p>
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed mb-6">
              Crafting memorable dining experiences with fresh ingredients, expert chefs, and warm hospitality since 2010.
            </p>
            <div className="flex space-x-3">
              {[
                { icon: <FaFacebookF size={16} />, link: "https://facebook.com" },
                { icon: <FaTwitter size={16} />, link: "https://twitter.com" },
                { icon: <FaInstagram size={16} />, link: "https://instagram.com" },
                { icon: <FaLinkedinIn size={16} />, link: "https://linkedin.com" },
              ].map(({ icon, link }, idx) => (
                <a
                  key={idx}
                  href={link}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 bg-gray-100 hover:bg-amber-500 rounded-lg flex items-center justify-center text-gray-600 hover:text-white transition-all duration-300 transform hover:scale-110"
                  aria-label="social media link"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div data-aos="fade-up" data-aos-delay="150">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { name: "Home", path: "/" },
                { name: "All Foods", path: "/all-foods" },
                { name: "Gallery", path: "/gallery" },
                { name: "About Us", path: "/about" },
                { name: "Contact", path: "/contact" },
                { name: "Reservation", path: "/reservation" }
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-gray-600 hover:text-amber-600 transition-all duration-300 hover:translate-x-1 inline-block"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div data-aos="fade-up" data-aos-delay="200">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Contact Info</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <FaMapMarkerAlt className="text-amber-600" size={14} />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">123 Restaurant Street<br />Food City, FC 12345</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <FaPhone className="text-amber-600" size={14} />
                </div>
                <div>
                  <a href="tel:+1234567890" className="text-gray-600 hover:text-amber-600 text-sm transition-colors">
                    (555) 123-4567
                  </a>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <FaEnvelope className="text-amber-600" size={14} />
                </div>
                <div>
                  <a href="mailto:info@tastehub.com" className="text-gray-600 hover:text-amber-600 text-sm transition-colors">
                    info@tastehub.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Opening Hours */}
          <div data-aos="fade-up" data-aos-delay="250">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Opening Hours</h3>
            <div className="space-y-3">
              {[
                { day: "Mon - Fri", time: "11:00 AM - 10:00 PM" },
                { day: "Saturday", time: "10:00 AM - 11:00 PM" },
                { day: "Sunday", time: "10:00 AM - 9:00 PM" },
                { day: "Holidays", time: "10:00 AM - 8:00 PM" }
              ].map((schedule, index) => (
                <div key={index} className="flex justify-between items-center py-1">
                  <span className="text-gray-600 text-sm font-medium">{schedule.day}</span>
                  <span className="text-amber-600 text-sm font-semibold">{schedule.time}</span>
                </div>
              ))}
            </div>
            
            {/* Newsletter Signup */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-gray-800 mb-3">Stay Updated</h4>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                />
                <button className="px-4 py-2 bg-amber-500 text-white text-sm font-medium rounded-r-lg hover:bg-amber-600 transition-colors">
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Without AOS to prevent animation issues */}
        <div className="pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} <span className="text-amber-600 font-medium">TasteHub Restaurant</span>. All rights reserved.
            </div>
            
            <div className="flex space-x-6 text-sm">
              <a href="/privacy" className="text-gray-500 hover:text-amber-600 transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="/terms" className="text-gray-500 hover:text-amber-600 transition-colors duration-300">
                Terms of Service
              </a>
              <a href="/sitemap" className="text-gray-500 hover:text-amber-600 transition-colors duration-300">
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;