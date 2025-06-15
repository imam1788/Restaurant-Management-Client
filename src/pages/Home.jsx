import React from 'react';
import Banner from '../components/Banner';
import TopFoods from '../components/TopFoods';
import Testimonials from '../components/Testimonials';

const Home = () => {
  return (
    <div>
      <Banner></Banner>
      <TopFoods></TopFoods>
      <Testimonials></Testimonials>
    </div>
  );
};

export default Home;