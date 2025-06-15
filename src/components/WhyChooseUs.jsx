import React from 'react';
import freshIcon from '../assets/fresh.png'
import deliveryIcon from '../assets/delivery-bike.png'
import priceIcon from '../assets/best-price.png'
import chefIcon from '../assets/cooking.png'
import contactIcon from '../assets/telephone.png'
import earthIcon from '../assets/earth.png'

const reasons = [
  {
    id: 1,
    title: "Fresh Ingredients",
    description: "We use only the freshest and highest quality ingredients in all our dishes.",
    icon: freshIcon,
  },
  {
    id: 2,
    title: "Fast Delivery",
    description: "Enjoy quick and reliable delivery straight to your doorstep.",
    icon: deliveryIcon,
  },
  {
    id: 3,
    title: "Affordable Prices",
    description: "Delicious meals at prices that won't break your budget.",
    icon: priceIcon,
  },
  {
    id: 4,
    title: "Expert Chefs",
    description: "Our experienced chefs craft every dish with passion and skill.",
    icon: chefIcon,
  },
  {
    id: 5,
    title: "Customer Support",
    description: "We are here 24/7 to assist you with any questions or concerns.",
    icon: contactIcon,
  },
  {
    id: 6,
    title: "Variety of Cuisines",
    description: "Explore a wide range of cuisines from around the world.",
    icon: earthIcon,
  },
];

const WhyChooseUs = () => {
  return (
    <section className="container mx-auto py-12 px-4 bg-green-50 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-8 text-center text-green-800">
        Why Choose Us
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {reasons.map(({ id, title, description, icon }) => (
          <div
            key={id}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <img src={icon} alt={title} className="w-20 h-20 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-gray-700">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseUs;
