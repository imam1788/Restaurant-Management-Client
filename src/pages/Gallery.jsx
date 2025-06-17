import "yet-another-react-lightbox/styles.css";
import Lightbox from "yet-another-react-lightbox";
import { useState } from "react";

import gallery1 from '../assets/gallery/gallery1.jpg'
import gallery2 from '../assets/gallery/gallery2.jpg'
import gallery3 from '../assets/gallery/gallery3.jpg'
import gallery4 from '../assets/gallery/gallery4.jpg'
import gallery5 from '../assets/gallery/gallery5.jpg'
import gallery6 from '../assets/gallery/gallery6.jpg'
import gallery7 from '../assets/gallery/gallery7.jpg'
import gallery8 from '../assets/gallery/gallery8.jpg'
import gallery9 from '../assets/gallery/gallery9.jpg'
import gallery10 from '../assets/gallery/gallery10.jpg'

const images = [
  gallery1,
  gallery2,
  gallery3,
  gallery4,
  gallery5,gallery6,gallery7, gallery8, gallery9,gallery10
];

const Gallery = () => {
  const [index, setIndex] = useState(-1);

  return (
    <div className="px-4 pb-10 bg-green-50 min-h-screen">
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
