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
      buttonText: "Explore Menu"
    },
    {
      id: 2,
      image: "https://i.ibb.co/9kSQ0bZ8/guacamole-concept-with-copyspace.jpg",
      title: "Fresh Ingredients",
      description: "We serve fresh, organic, and local ingredients every day.",
      buttonText: "Our Story"
    },
    {
      id: 3,
      image: "https://i.ibb.co/KpRH5Hk8/top-view-food-frame-with-copy-space.jpg",
      title: "Cozy Ambience",
      description: "Experience fine dining with a warm and cozy atmosphere.",
      buttonText: "Book a Table"
    },
  ];

  return (
    <div className="relative rounded-b-3xl overflow-hidden">
      <Carousel
        showThumbs={false}
        autoPlay
        infiniteLoop
        interval={4000}
        showStatus={false}
        swipeable
        emulateTouch
        showArrows={true}
        stopOnHover={false}
        transitionTime={800}
        className="rounded-b-3xl"
        renderArrowPrev={(onClickHandler, hasPrev, label) =>
          hasPrev && (
            <button
              type="button"
              onClick={onClickHandler}
              title={label}
              className="absolute left-4 top-1/2 z-10 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full w-12 h-12 flex items-center justify-center transition-all duration-300 hover:scale-110"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )
        }
        renderArrowNext={(onClickHandler, hasNext, label) =>
          hasNext && (
            <button
              type="button"
              onClick={onClickHandler}
              title={label}
              className="absolute right-4 top-1/2 z-10 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full w-12 h-12 flex items-center justify-center transition-all duration-300 hover:scale-110"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )
        }
        renderIndicator={(onClickHandler, isSelected, index, label) => {
          if (isSelected) {
            return (
              <li
                className="inline-block w-4 h-4 mx-1 rounded-full bg-amber-500 cursor-pointer transition-all duration-300 shadow-lg"
                aria-label={`Selected: ${label} ${index + 1}`}
                title={`Selected: ${label} ${index + 1}`}
              />
            );
          }
          return (
            <li
              className="inline-block w-3 h-3 mx-1 rounded-full bg-white/60 cursor-pointer hover:bg-white transition-all duration-300"
              onClick={onClickHandler}
              onKeyDown={onClickHandler}
              value={index}
              key={index}
              role="button"
              tabIndex={0}
              title={`${label} ${index + 1}`}
              aria-label={`${label} ${index + 1}`}
            />
          );
        }}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="relative h-[85vh] w-full">
            {/* Background Image with Overlay */}
            <div 
              className="absolute inset-0 bg-cover bg-center transform transition-transform duration-10000 ease-linear"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
            
            {/* Additional Warm Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 to-orange-900/10 mix-blend-overlay"></div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-center items-start px-6 md:px-20 lg:px-32">
              <div className="max-w-2xl space-y-6 transform transition-all duration-700 ease-out">
                {/* Badge */}
                <div className="inline-flex items-center px-4 py-2 bg-amber-500/20 backdrop-blur-sm rounded-full border border-amber-400/30">
                  <span className="text-amber-300 text-sm font-semibold">✨ Premium Dining Experience</span>
                </div>

                {/* Title */}
                <h1 className="text-white text-5xl md:text-7xl lg:text-8xl font-bold leading-tight drop-shadow-2xl">
                  {slide.title.split(' ').map((word, index) => (
                    <span key={index} className="block">
                      {word}
                    </span>
                  ))}
                </h1>

                {/* Description */}
                <p className="text-amber-100 text-xl md:text-2xl leading-relaxed max-w-xl drop-shadow-lg">
                  {slide.description}
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link to="/all-foods">
                    <button className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl shadow-lg hover:shadow-amber-500/25 transform hover:-translate-y-1 transition-all duration-300 hover:scale-105 group">
                      <span className="flex items-center space-x-2">
                        <span>{slide.buttonText}</span>
                        <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </span>
                    </button>
                  </Link>
                  
                  <Link to="/gallery">
                    <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-xl border border-white/20 hover:bg-white/20 hover:border-white/40 transform hover:-translate-y-1 transition-all duration-300">
                      View Gallery
                    </button>
                  </Link>
                </div>

                {/* Additional Info */}
                <div className="flex items-center space-x-6 pt-6">
                  <div className="flex items-center space-x-2 text-amber-200">
                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                    <span className="text-sm">Fresh Daily</span>
                  </div>
                  <div className="flex items-center space-x-2 text-amber-200">
                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                    <span className="text-sm">100% Organic</span>
                  </div>
                  <div className="flex items-center space-x-2 text-amber-200">
                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                    <span className="text-sm">Expert Chefs</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute bottom-10 right-10 opacity-10">
              <div className="text-9xl">🍽️</div>
            </div>
          </div>
        ))}
      </Carousel>

      {/* Scroll Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex flex-col items-center space-y-2">
          <span className="text-amber-200 text-sm font-medium">Scroll Down</span>
          <div className="w-6 h-10 border-2 border-amber-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-amber-400 rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;