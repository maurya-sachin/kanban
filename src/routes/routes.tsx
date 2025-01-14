// src/routes/routes.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home.tsx';
import Login from '../pages/Login.tsx';
// import { useAppSelector } from '../hooks.ts';

const AppRoutes: React.FC = () => {
  // const user = useAppSelector((state) => state.auth.user);
  return (
    <Router>
      <Routes>
        {/* Default route with MainLayout */}
        <Route
          path="/"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} /> */}
      </Routes>
    </Router>
  );
};

export default AppRoutes;
