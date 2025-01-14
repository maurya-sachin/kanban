import React from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { toggleTheme } from '../store/themeSlice';
import { saveUserTheme } from '../firebase/themeStorage';
import { FaSun, FaMoon } from 'react-icons/fa';
import { motion } from 'motion/react';

const ThemeToggle: React.FC = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.theme);
  const user = useAppSelector((state) => state.auth.user);

  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    dispatch(toggleTheme());
    if (user) {
      saveUserTheme(user.uid, newTheme);
    }
  };

  return (
    <motion.button
      onClick={handleThemeToggle}
      className="relative p-2 rounded-full bg-gray-200 dark:bg-gray-700 transition-colors duration-300"
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'light' ? 180 : 0 }}
        transition={{ duration: 0.3 }}
        className="text-yellow-500 dark:text-blue-300"
      >
        {theme === 'light' ? <FaSun size={20} /> : <FaMoon size={20} />}
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
