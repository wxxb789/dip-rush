import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { Suspense } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import IndexPage from './pages/index';
import ScreenerPage from './pages/screener';
import StockDetailPage from './pages/stock-detail';
// Import i18n configuration
import './i18n';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <IndexPage />,
      },
      {
        path: 'screener',
        element: <ScreenerPage />,
      },
      {
        path: 'stock-detail',
        children: [
          {
            index: true,
            element: <StockDetailPage />,
          },
          {
            path: ':symbol',
            element: <StockDetailPage />,
          },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <RouterProvider router={router} />
      </LanguageProvider>
    </ThemeProvider>
  );
}

// Initialize React
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}
createRoot(rootElement).render(
  <StrictMode>
    <Suspense fallback={<div>Loading translations...</div>}>
      <App />
    </Suspense>
  </StrictMode>
);
