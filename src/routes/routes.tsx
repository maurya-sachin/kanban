// src/routes/routes.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home.tsx';
import Login from '../pages/Login.tsx';
import { useAppSelector } from '../hooks.ts';

// ProtectedRoute Wrapper Component
const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const user = useAppSelector((state) => state.auth.user);

  return user ? children : <Navigate to="/login" replace />;
};

const AppRoutes: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <Router>
      <Routes>
        {/* Home Page with ProtectedRoute */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Home />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Login Page */}
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
