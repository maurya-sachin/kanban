// src/pages/Home.tsx
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Filter from '../components/Filter';

const Home: React.FC = () => {
  return (
    <div>
      <Helmet>
        <title>Home - Task Scheduler</title>
        <meta
          name="description"
          content="Welcome to Task Scheduler! Organize your tasks effectively."
        />
      </Helmet>
      <Filter />
      <h1>Welcome to Task Scheduler</h1>
    </div>
  );
};

export default Home;
