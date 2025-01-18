// src/pages/Home.tsx
import React from 'react';
import { Helmet } from 'react-helmet-async';
import TaskWrapper from '../components/TaskWrapper';

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
      <TaskWrapper />
    </div>
  );
};

export default Home;
