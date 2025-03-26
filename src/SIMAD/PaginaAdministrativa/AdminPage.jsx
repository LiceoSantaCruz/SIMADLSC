import { SideBar } from './components/SideBar';
import { AdminRoutes } from './routes/AdminRoutes';
import { Navigate, Route, Routes } from 'react-router-dom';
import {InfoAdminPage} from './pages/InfoAdminPage';
import {InfoProfesorPage} from './pages/InfoProfesorPage';
import {InfoEstudiantePage} from './pages/InfoEstudiantePage';

export const AdminPage = () => {
  // Obtener el rol del usuario desde el localStorage
  const role = localStorage.getItem('role');


  // Si no hay rol o el rol no es válido, redirigir al inicio de sesión
  if (!role || !['admin', 'superadmin', 'profesor', 'estudiante'].includes(role)) {
    return <Navigate to="/paginainformativa" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar (posición fija a la izquierda) */}
      <SideBar />

      {/* Contenido principal */}
      <main className="flex-grow w-full overflow-y-auto overflow-x-hidden bg-gray-100 dark:bg-gray-950 p-4 md:p-6">
        <Routes>
          {/* Redirección inicial */}
          <Route path="/" element={<Navigate to="/Usuario" replace />} />
          
          {/* Rutas de inicio personalizadas según el rol */}
          {role === 'admin' || role === 'superadmin' ? (
            <Route path="/Usuario" element={<InfoAdminPage />} />
          ) : role === 'profesor' ? (
            <Route path="/Usuario" element={<InfoProfesorPage />} />
          ) : (
            <Route path="/Usuario" element={<InfoEstudiantePage />} />
          )}
          
          {/* Rutas administrativas */}
          <Route path="/*" element={<AdminRoutes />} />
        </Routes>
      </main>
    </div>
  );
};
