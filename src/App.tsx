import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './hooks';
import { onAuthStateChanged } from 'firebase/auth';
import { setUser } from './store/authSlice';
import { setTheme } from './store/themeSlice';
import { auth } from './firebase/firebase';
import { getUserTheme } from './firebase/themeStorage';
import { HelmetProvider } from 'react-helmet-async';
import AppRoutes from './routes/routes';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.theme);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        dispatch(
          setUser({
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
          })
        );

        // Retrieve and apply user's saved theme
        const userTheme = await getUserTheme(user.uid);
        if (userTheme) {
          dispatch(setTheme(userTheme));
        }
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
