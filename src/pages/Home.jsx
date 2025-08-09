import React from 'react';
import Banner from '../components/Banner';
import TopFoods from '../components/TopFoods';
import Testimonials from '../components/Testimonials';
import WhyChooseUs from '../components/WhyChooseUs';
import OurStory from '../components/OurStory';

const Home = () => {
  return (
    <div>
      <Banner></Banner>
      <TopFoods></TopFoods>
      <WhyChooseUs></WhyChooseUs>
      <OurStory></OurStory>
      <Testimonials></Testimonials>
    </div>
  );
};

export default Home;