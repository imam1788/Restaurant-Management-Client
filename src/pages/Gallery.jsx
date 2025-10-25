import { useState, useEffect } from "react";
import "yet-another-react-lightbox/styles.css";
import Lightbox from "yet-another-react-lightbox";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion } from "framer-motion";

import gallery1 from "../assets/gallery/gallery1.jpg";
import gallery2 from "../assets/gallery/gallery2.jpg";
import gallery3 from "../assets/gallery/gallery3.jpg";
import gallery4 from "../assets/gallery/gallery4.jpg";
import gallery5 from "../assets/gallery/gallery5.jpg";
import gallery6 from "../assets/gallery/gallery6.jpg";
import gallery7 from "../assets/gallery/gallery7.jpg";
import gallery8 from "../assets/gallery/gallery8.jpg";
import gallery9 from "../assets/gallery/gallery9.jpg";
import gallery10 from "../assets/gallery/gallery10.jpg";

const images = [
  gallery1,
  gallery2,
  gallery3,
  gallery4,
  gallery5,
  gallery6,
  gallery7,
  gallery8,
  gallery9,
  gallery10,
];

const Gallery = () => {
  const [index, setIndex] = useState(-1);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: "ease-in-out",
    });
  }, []);

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
            <span className="text-amber-700 text-sm font-semibold">📸 Photo Gallery</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Our <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Gallery</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Explore the visual journey of our culinary creations and restaurant ambiance
          </p>
        </motion.div>

        {/* Gallery Grid - KEEPING YOUR ORIGINAL CODE */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((src, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="relative overflow-hidden rounded-2xl shadow-lg border border-amber-200 bg-white"
              data-aos="zoom-in"
              data-aos-delay={i * 50}
            >
              <img
                src={src}
                alt={`gallery-${i}`}
                className="w-full h-48 object-cover transition-transform duration-500 hover:scale-110 cursor-pointer"
                onClick={() => setIndex(i)}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                <div className="transform translate-y-4 hover:translate-y-0 opacity-0 hover:opacity-100 transition-all duration-300">
                  <div className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3-3H7" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="absolute top-3 left-3 w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                {i + 1}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Gallery Description */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-12"
        >
          <div className="bg-white rounded-2xl shadow-lg border border-amber-200 p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-amber-800 mb-4">
              Culinary Excellence Captured
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Each photograph tells a story of passion, quality, and the vibrant atmosphere 
              that defines our restaurant. From meticulously plated dishes to the warm, 
              inviting ambiance, our gallery showcases the essence of the dining experience 
              we create for our valued guests.
            </p>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-8"
        >
          <p className="text-amber-700 font-medium">
            Click on any image to view in full size
          </p>
        </motion.div>
      </div>

      {/* Lightbox - KEEPING YOUR ORIGINAL CODE */}
      <Lightbox
        open={index >= 0}
        close={() => setIndex(-1)}
        slides={images.map((img) => ({ src: img }))}
        index={index}
        controller={{ closeOnBackdropClick: true }}
      />
    </div>
  );
};

export default Gallery;