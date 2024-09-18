import { Route, Routes, Navigate } from "react-router-dom";
import { SimadRoutes } from "../SIMAD/PaginaInformativa/routes/SimadRoutes";
import { AdminPage } from "../SIMAD/PaginaAdministrativa/AdminPage";
import { useState, useEffect } from "react";

export const AppRouter = () => {
  // Estado para el rol del usuario
  const [rol, setRol] = useState(localStorage.getItem('rol'));

  useEffect(() => {
    // Actualiza el rol cuando se elimine del localStorage (logout)
    const handleStorageChange = () => {
      setRol(localStorage.getItem('rol')); // Actualizar el estado del rol
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
      {rol === 'admin' ? (
        <Route path="/*" element={<AdminPage />} />
      ) : (
        <Route path="/paginainformativa/*" element={<SimadRoutes />} />
      )}

      {/* Si el rol no está definido, redirigir a la página informativa */}
      <Route path="*" element={<Navigate to="/paginainformativa" />} />
    </Routes>
  );
};
