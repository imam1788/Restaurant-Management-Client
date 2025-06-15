import "yet-another-react-lightbox/styles.css";
import Lightbox from "yet-another-react-lightbox";
import { useState } from "react";

const images = [
  "/src/assets/gallery/gallery1.jpg",
  "/src/assets/gallery/gallery2.jpg",
  "/src/assets/gallery/gallery3.jpg",
  "/src/assets/gallery/gallery4.jpg",
  "/src/assets/gallery/gallery5.jpg",
  "/src/assets/gallery/gallery6.jpg",
  "/src/assets/gallery/gallery7.jpg",
  "/src/assets/gallery/gallery8.jpg",
  "/src/assets/gallery/gallery9.jpg",
  "/src/assets/gallery/gallery10.jpg",
];

const Gallery = () => {
  const [index, setIndex] = useState(-1);

  return (
    <div className="px-4 py-10 bg-green-50 min-h-screen">
      <div className="text-center bg-green-200 py-10 rounded shadow mb-10">
        <h1 className="text-5xl font-bold text-green-800">Gallery</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`gallery-${i}`}
            className="rounded-lg cursor-pointer transition-transform hover:scale-105"
            onClick={() => setIndex(i)}
          />
        ))}
      </div>

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
