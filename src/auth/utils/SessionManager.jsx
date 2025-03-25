import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // ✅ Import correcto
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

// Función para limpiar sesión y redirigir con alerta
const logoutUser = (navigate) => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("id_Usuario");
  localStorage.removeItem("id_Estudiante");
  localStorage.removeItem("id_Profesor");
  localStorage.removeItem("userData");
  localStorage.removeItem("materia");

  MySwal.fire({
    icon: "info",
    title: "Sesión finalizada",
    text: "Tu sesión ha finalizado por seguridad. Por favor, inicia sesión nuevamente.",
    confirmButtonText: "Aceptar",
  }).then(() => {
    navigate("/paginainformativa");
  });
};

export const SessionManager = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token); // ✅ Uso correcto
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
          console.warn("Token ya expirado. Cerrando sesión.");
          logoutUser(navigate);
        } else {
          const timeUntilExpire = decoded.exp * 1000 - Date.now();

          setTimeout(() => {
            console.warn("Token expirado automáticamente.");
            logoutUser(navigate);
          }, timeUntilExpire);
        }
      } catch (error) {
        console.error("Token inválido o error al verificar expiración:", error);
        logoutUser(navigate);
      }
    }
  }, [navigate]);

  return null; // No renderiza nada
};

export default SessionManager;
