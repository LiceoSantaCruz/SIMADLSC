import { Route, Routes, Navigate } from "react-router-dom";
import { SimadRoutes } from "../SIMAD/PaginaInformativa/routes/SimadRoutes";
import { AdminPage } from "../SIMAD/PaginaAdministrativa/AdminPage";
import { AuthRoutes } from "../auth/routes/AuthRoutes";
import { useEffect, useState } from "react";
import { SessionManager } from "../auth/utils/SessionManager";

export const AppRouter = () => {
  const [role, setRole] = useState(localStorage.getItem("role"));

  useEffect(() => {
    const handleStorageChange = () => {
      setRole(localStorage.getItem("role"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <> 

<SessionManager />

      <Routes>
        <Route path="/*" element={<AdminPage />} />
        <Route path="/paginainformativa/*" element={<SimadRoutes />} />
        <Route path="/auth/*" element={<AuthRoutes />} />
        <Route path="*" element={<Navigate to="/paginainformativa" />} />
      </Routes>

    </>
  );
};
