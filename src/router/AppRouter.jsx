import { Route, Routes, Navigate } from "react-router-dom";
import { SimadRoutes } from "../SIMAD/PaginaInformativa/routes/SimadRoutes";
import { AdminPage } from "../SIMAD/PaginaAdministrativa/AdminPage";
import { useState, useEffect } from "react";

export const AppRouter = () => {
  // Estado para el rol del usuario
  const [role, setRole] = useState(localStorage.getItem('role'));

  useEffect(() => {
    // Actualiza el rol cuando se elimine o cambie en localStorage (logout)
    const handleStorageChange = () => {
      setRole(localStorage.getItem('role')); // Actualizar el estado del rol
    };

    // Escucha los cambios en el localStorage
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <Routes>
      {/* Si el rol es 'admin', redirigir a la página de administrador */}

      {role === 'admin' && (
        <Route path="/*" element={<AdminPage />} />
      )}

      {/* Si el rol es 'professor', redirigir a la página de profesor */}
      {role === 'profesor' && (
        <Route path="/*" element={<AdminPage />} />
      )}

      {/* Si el rol es 'student', redirigir a la página de estudiante */}
      {role === 'estudiante' && (
        <Route path="/*" element={<AdminPage />} />
      )}

      {/* Si el rol es 'adminStaff', redirigir a la página de personal administrativo */}
      {role === 'superadmin' && (
        <Route path="/*" element={<AdminPage />} />
      )}

      {/* Si el rol no está definido o no coincide, redirigir a la página informativa */}
      <Route path="/paginainformativa/*" element={<SimadRoutes />} />
      <Route path="*" element={<Navigate to="/paginainformativa" />} />
    </Routes>
  );
};
