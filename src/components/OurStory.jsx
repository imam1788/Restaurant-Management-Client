import React from "react";
import { motion } from "framer-motion";

const OurStory = () => (
  <section className="py-16">
    <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
      {/* Text Section */}
      <div className="md:w-1/2 text-yellow-900">
        <h2 className="text-4xl font-bold mb-6">Our Story</h2>
        <p className="mb-6 text-lg leading-relaxed">
          Established in 2010, <span className="font-semibold">ReSto</span> has been dedicated to serving exceptional cuisine made with fresh, locally sourced ingredients. Our mission is to create a memorable dining experience by combining flavorful dishes, warm hospitality, and a welcoming atmosphere.
        </p>
        <p className="mb-6 text-lg leading-relaxed">
          At ReSto, we believe food is an art that brings people together. Our talented chefs craft each dish with passion, blending traditional recipes with modern culinary techniques. From classic comfort foods to innovative specialties, there’s something for every palate.
        </p>
        <p className="mb-6 text-lg leading-relaxed">
          Our commitment goes beyond just great food — we strive to create an environment where friends and families can relax, celebrate, and enjoy quality time. From our cozy interiors to attentive service, every detail is thoughtfully designed to make you feel right at home.
        </p>
      </div>

      {/* Images Grid */}
      <div className="md:w-1/2">
        <div>
          <motion.img
            src="https://i.ibb.co.com/nMBN7QKL/restaurant-interior-1.jpg"
            alt="Restaurant interior with cozy seating"
            className="rounded-3xl object-cover w-96 h-full"
            animate={{ y: [0, 50, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </div>
        <div>
          <motion.img
            src="https://i.ibb.co.com/j93BCTYL/chef-cooking-kitchen-while-wearing-professional-attire.jpg"
            alt="Chef preparing fresh food"
            className="rounded-3xl w-96 h-full"
            animate={{ x: [50, 100, 50] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </div>
      </div>
    </div>
  </section>
);

export default OurStory;
