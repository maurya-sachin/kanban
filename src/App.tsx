import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './hooks';
import { onAuthStateChanged } from 'firebase/auth';
import { setUser } from './store/authSlice';
import { auth } from './firebase/firebase';
import { saveUserTheme } from './firebase/themeStorage'; // Import the saveUserTheme function
import { HelmetProvider } from 'react-helmet-async';
import AppRoutes from './routes/routes';

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

        // Save user theme when signed in
        saveUserTheme(user.uid, theme);
      } else {
        dispatch(setUser(null));
      }
    });

    return () => unsubscribe();
  }, [dispatch, theme]);

  return (
    <HelmetProvider>
      <AppRoutes />
    </HelmetProvider>
  );
};

export default App;
