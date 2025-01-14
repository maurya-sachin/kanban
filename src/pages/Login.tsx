// src/components/Login.tsx
import React from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { signIn, logOut } from '../store/authSlice';

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const loading = useAppSelector((state) => state.auth.loading);
  const error = useAppSelector((state) => state.auth.error);

  const handleSignIn = async () => {
    await dispatch(signIn());
  };

  const handleLogOut = async () => {
    await dispatch(logOut());
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {user ? (
        <div>
          <p>Welcome, {user.displayName}</p>
          <button onClick={handleLogOut}>Log Out</button>
        </div>
      ) : (
        <button onClick={handleSignIn}>Sign In with Google</button>
      )}
    </div>
  );
};

export default Login;
