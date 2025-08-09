import React, { useEffect } from 'react';
import AOS from "aos";
import "aos/dist/aos.css";


const testimonials = [
  {
    id: 1,
    name: "John Doe",
    review: "Amazing food and great service!",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: 2,
    name: "Jane Smith",
    review: "Loved the desserts! Will order again.",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    id: 3,
    name: "Mark Lee",
    review: "Fast delivery and fresh ingredients.",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    id: 4,
    name: "Sara Khan",
    review: "Highly recommend the seafood platter!",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    id: 5,
    name: "Alex Johnson",
    review: "Great experience, will definitely come back.",
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    id: 6,
    name: "Emily Davis",
    review: "The ambiance was perfect for our family dinner.",
    avatar: "https://randomuser.me/api/portraits/women/6.jpg",
  },
];

const Testimonials = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: false });
  }, []);

  return (
    <section className="py-10 px-4">
      <h2
        className="text-3xl font-bold mb-8 text-center text-green-800"
        data-aos="fade-up"
      >
        What Our Customers Say
      </h2>
      <div className="max-w-5xl mx-auto grid gap-8 md:grid-cols-3">
        {testimonials.map(({ id, name, avatar, review }) => (
          <div
            key={id}
            className="bg-white p-6 rounded-3xl shadow-md hover:shadow-lg transition-shadow duration-300 text-center"
            data-aos="fade-up"
            data-aos-delay={id * 100}
          >
            <img
              src={avatar}
              alt={name}
              className="w-20 h-20 mx-auto rounded-full mb-4 object-cover border-2 border-yellow-400"
            />
            <p className="italic mb-4 text-gray-700">"{review}"</p>
            <p className="font-semibold text-green-800">{name}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
