import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { routeConfig } from './routeConfig';

export const AdminRoutes = () => {
  const [role, setRole] = useState(localStorage.getItem('role'));

  useEffect(() => {
    const handleStorageChange = () => {
      setRole(localStorage.getItem('role'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <div className="flex-grow w-full p-4 md:p-6 min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100 overflow-y-auto overflow-x-hidden transition-colors duration-300">
      <Routes>
        <Route path="/" element={<Navigate to="/paginainformativa" replace />} />
        {routeConfig.map(({ path, element: Element, roles }, index) =>
          (!roles || roles.includes(role)) && <Route key={index} path={path} element={<Element />} />
        )}
      </Routes>
    </div>
  );
};
