import { useState, useEffect } from "react";
import "yet-another-react-lightbox/styles.css";
import Lightbox from "yet-another-react-lightbox";
import AOS from "aos";
import "aos/dist/aos.css";

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
    <div className="px-4 pb-10 bg-green-50 min-h-screen">
      <div
        className="mb-8 text-center bg-green-100 py-6 rounded shadow"
        data-aos="fade-down"
      >
        <h1 className="text-4xl font-bold text-green-700">Gallery</h1>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`gallery-${i}`}
            className="rounded-lg cursor-pointer transition-transform hover:scale-105"
            onClick={() => setIndex(i)}
            data-aos="zoom-in"
            data-aos-delay={i * 50}
          />
        ))}
      </div>

      {/* Lightbox */}
      <Lightbox
        open={index >= 0}
        close={() => setIndex(-1)}
        slides={images.map((img) => ({ src: img }))}
        index={index}
      />
    </div>
  );
};

export default Gallery;
