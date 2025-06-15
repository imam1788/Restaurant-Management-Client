import { Link } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const Banner = () => {
  const slides = [
    {
      id: 1,
      image: "https://i.ibb.co/vvCsVQKP/flat-lay-potatoes-pan-with-spices-copy-space.jpg",
      title: "Delicious Cuisine",
      description: "Enjoy world-class meals crafted by our top chefs.",
    },
    {
      id: 2,
      image: "https://i.ibb.co/9kSQ0bZ8/guacamole-concept-with-copyspace.jpg",
      title: "Fresh Ingredients",
      description: "We serve fresh, organic, and local ingredients every day.",
    },
    {
      id: 3,
      image: "https://i.ibb.co/KpRH5Hk8/top-view-food-frame-with-copy-space.jpg",
      title: "Cozy Ambience",
      description: "Experience fine dining with a warm and cozy atmosphere.",
    },
  ];

  return (
    <div className="relative">
      <Carousel
        showThumbs={false}
        autoPlay
        infiniteLoop
        interval={3000}
        showStatus={false}
        swipeable
        emulateTouch
      >
        {slides.map((slide) => (
          <div key={slide.id} className="relative h-[80vh] w-full">
            <img
              src={slide.image}
              alt={slide.title}
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-start px-6 md:px-20">
              <h2 className="text-white text-4xl md:text-6xl font-bold drop-shadow-lg mb-4">
                {slide.title}
              </h2>
              <p className="text-white text-lg md:text-xl mb-6 max-w-xl">
                {slide.description}
              </p>
              <Link to="/all-foods">
                <button className="btn bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-2 rounded-full shadow-lg transition duration-300">
                  Explore All Foods
                </button>
              </Link>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default Banner;
