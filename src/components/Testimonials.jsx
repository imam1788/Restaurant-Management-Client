import React from 'react';

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
  return (
    <div className="bg-green-50 py-10 px-4">
      <h2 className="text-3xl font-bold mb-8 text-center text-green-800">What Our Customers Say</h2>
      <div className="max-w-5xl mx-auto grid gap-8 md:grid-cols-3">
        {testimonials.map(({ id, name, avatar, review }) => (
          <div key={id} className="bg-white p-6 rounded-lg shadow text-center">
            <img
              src={avatar}
              alt={name}
              className="w-20 h-20 mx-auto rounded-full mb-4 object-cover"
            />
            <p className="italic mb-4">"{review}"</p>
            <p className="font-semibold text-green-800">{name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
