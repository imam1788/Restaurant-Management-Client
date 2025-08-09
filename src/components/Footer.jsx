import React, { useEffect } from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

const Footer = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: false });
  }, []);

  return (
    <footer className="bg-gradient-to-r from-green-800 via-green-700 to-green-600 text-green-100 py-12 shadow-lg">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Brand Info */}
        <div data-aos="fade-up" data-aos-delay="100">
          <h2 className="text-4xl font-extrabold mb-4 tracking-wide drop-shadow-lg">
            Re<span className="text-yellow-400">sto</span>
          </h2>
          <p className="text-green-300 max-w-md leading-relaxed">
            Savor the taste of exquisite dishes delivered fast to your doorstep.
            Quality & flavor, our promise to you.
          </p>
        </div>

        {/* Quick Links */}
        <div data-aos="fade-up" data-aos-delay="200">
          <h3 className="text-2xl font-semibold mb-5 border-b border-green-600 pb-2 uppercase tracking-wide">
            Quick Links
          </h3>
          <ul className="space-y-3">
            {["Home", "All Foods", "Contact", "About"].map((item) => (
              <li key={item}>
                <a
                  href={item === "Home" ? "/" : `/${item.toLowerCase().replace(" ", "")}`}
                  className="text-green-200 hover:text-yellow-400 transition-colors duration-300 ease-in-out font-medium"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div data-aos="fade-up" data-aos-delay="300">
          <h3 className="text-2xl font-semibold mb-5 border-b border-green-600 pb-2 uppercase tracking-wide">
            Contact Us
          </h3>
          <p className="mb-2">
            Email:{" "}
            <a
              href="mailto:info@restauranthub.com"
              className="text-yellow-400 hover:text-yellow-300 transition-colors duration-300"
            >
              info@restauranthub.com
            </a>
          </p>
          <p className="mb-4">
            Phone:{" "}
            <a
              href="tel:+1234567890"
              className="text-yellow-400 hover:text-yellow-300 transition-colors duration-300"
            >
              +1 234 567 890
            </a>
          </p>

          <div className="flex space-x-6">
            {[
              {
                icon: <FaFacebookF size={22} />,
                link: "https://facebook.com",
              },
              {
                icon: <FaTwitter size={22} />,
                link: "https://twitter.com",
              },
              {
                icon: <FaInstagram size={22} />,
                link: "https://instagram.com",
              },
              {
                icon: <FaLinkedinIn size={22} />,
                link: "https://linkedin.com",
              },
            ].map(({ icon, link }, idx) => (
              <a
                key={idx}
                href={link}
                target="_blank"
                rel="noreferrer"
                className="text-green-300 hover:text-yellow-400 transition-colors duration-300 transform hover:scale-110"
                aria-label="social media link"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div
        data-aos="fade-up"
        data-aos-delay="400"
        className="mt-12 text-center text-white text-sm font-mono tracking-wide font-bold"
      >
        &copy; {new Date().getFullYear()} Resto. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
