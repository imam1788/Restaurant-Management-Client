import React, { useEffect } from "react";
import freshIcon from '../assets/fresh.png';
import deliveryIcon from '../assets/delivery-bike.png';
import priceIcon from '../assets/best-price.png';
import chefIcon from '../assets/cooking.png';
import contactIcon from '../assets/telephone.png';
import earthIcon from '../assets/earth.png';
import AOS from "aos";
import "aos/dist/aos.css";

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
  useEffect(() => {
    AOS.init({ duration: 800, once: false });
  }, []);

  return (
    <section className="container mx-auto py-12 px-4">
      <h2 className="text-3xl font-bold mb-8 text-center text-green-800">
        Why Choose Us
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {reasons.map(({ id, title, description, icon }) => (
          <div
            key={id}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow flex flex-col items-center text-center"
            data-aos="fade-up"
          >
            <div className="bg-yellow-400 p-4 rounded-full mb-4 hover:scale-105 transform transition-transform duration-300">
              <img src={icon} alt={title} className="w-16 h-16" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-gray-700">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseUs;
