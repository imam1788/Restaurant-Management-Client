import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const About = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <div className="container mx-auto px-4 py-16 bg-gray-50 min-h-screen">
      <h1
        className="text-5xl font-extrabold text-green-800 mb-10 text-center"
        data-aos="fade-down"
      >
        About Resto
      </h1>

      <section
        className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-10"
        data-aos="fade-up"
      >
        <p className="text-gray-700 text-lg leading-relaxed mb-6">
          Welcome to <span className="font-bold text-yellow-400">Resto</span>, your ultimate destination for delicious, high-quality food delivered right to your doorstep. Since our inception, we've been passionate about bringing a diverse selection of exquisite dishes, crafted with fresh ingredients and authentic flavors, straight to food lovers everywhere.
        </p>

        <p className="text-gray-700 text-lg leading-relaxed mb-6">
          At Resto, we believe that every meal should be a memorable experience. That's why we work closely with top chefs and local suppliers to ensure our menu offers both classic favorites and innovative creations. Whether you're craving comfort food or something adventurous, we have something to satisfy every palate.
        </p>

        <p className="text-gray-700 text-lg leading-relaxed mb-6">
          Our commitment to excellence doesn't stop at food. We prioritize fast and reliable delivery, excellent customer service, and a seamless online ordering experience. With Resto, enjoying your favorite meals has never been easier or more enjoyable.
        </p>

        <p className="text-gray-700 text-lg leading-relaxed mb-6">
          Thank you for choosing Resto. We look forward to serving you and making every meal an occasion to remember!
        </p>

        <div className="mt-10 text-center">
          <h2 className="text-2xl font-semibold text-green-700 mb-4">Our Mission</h2>
          <p className="text-gray-600 italic max-w-xl mx-auto">
            Delivering delicious food with quality, speed, and care—bringing joy to every table.
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;
