// src/components/Login.tsx
import React from 'react';
import { useAuth } from '../hooks/useAuth';

const Login: React.FC = () => {
  const { user, signIn, isLoading, error, isSigningIn } = useAuth();

  return (
    <div>
      {isLoading || isSigningIn ? <p>Loading...</p> : null}
      {error && <p>Error: {error.message}</p>}
      {user ? (
        <div>
          <p>Welcome, {user.displayName}</p>
        </div>
      ) : (
        <button onClick={signIn}>Sign In with Google</button>
      )}
    </div>
  );
};

export default Login;
