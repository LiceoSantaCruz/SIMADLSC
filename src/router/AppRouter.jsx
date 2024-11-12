import { Route, Routes, Navigate } from "react-router-dom";
import { SimadRoutes } from "../SIMAD/PaginaInformativa/routes/SimadRoutes";
import { AdminPage } from "../SIMAD/PaginaAdministrativa/AdminPage"; // Página a la que todos los usuarios tienen acceso
import { AuthRoutes } from "../auth/routes/AuthRoutes";
import { useEffect, useState } from "react";

export const AppRouter = () => {
  // Estado para el rol del usuario (opcional, en caso de que se use en otros contextos)
  const [role, setRole] = useState(localStorage.getItem("role"));

  useEffect(() => {
    // Actualiza el rol cuando se elimine o cambie en localStorage (logout)
    const handleStorageChange = () => {
      setRole(localStorage.getItem("role")); // Actualizar el estado del rol
    };

    // Escucha los cambios en el localStorage
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <Routes>
      {/* Todos los usuarios tienen acceso a AdminPage */}
      <Route path="/*" element={<AdminPage />} />

      {/* Ruta para la página informativa */}
      <Route path="/paginainformativa/*" element={<SimadRoutes />} />

      {/* Ruta de autenticación */}
      <Route path="/auth/*" element={<AuthRoutes />} />

      {/* Redirección a la página informativa para rutas no definidas */}
      <Route path="*" element={<Navigate to="/paginainformativa" />} />
    </Routes>
  );
};
