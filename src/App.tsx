import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from './hooks/useAuth';
import { useTheme } from './hooks/useTheme';
import { HelmetProvider } from 'react-helmet-async';
import AppRoutes from './routes/routes';
import { useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <DndProvider backend={HTML5Backend}>
        <AppContent />
      </DndProvider>
    </QueryClientProvider>
  );
};

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme(user?.uid);

  // This effect listens for theme changes and applies it to the document root
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <HelmetProvider>
      <AppRoutes />
    </HelmetProvider>
  );
};

export default App;
