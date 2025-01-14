// src/App.tsx
import { HelmetProvider } from 'react-helmet-async';
import AppRoutes from './routes/routes';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './hooks';
import { onAuthStateChanged } from 'firebase/auth';
import { setUser } from './store/authSlice';
import { auth } from './firebase';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.theme);
  useEffect(() => {
    const html = document.documentElement;
    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(
          setUser({
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
          })
        );
      } else {
        dispatch(setUser(null));
      }
    });
    return () => unsubscribe();
  }, [dispatch]);

  return (
    <HelmetProvider>
      <AppRoutes />
    </HelmetProvider>
  );
};

export default App;
