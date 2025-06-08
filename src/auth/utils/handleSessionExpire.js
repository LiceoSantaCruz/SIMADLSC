import jwt_decode from "jwt-decode";
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate(); // Mueve useNavigate aquí

const handleGoBack = () => {
    navigate("/paginainformativa");
    
  };
export function logoutUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("id_Usuario");
  localStorage.removeItem("id_Estudiante");
  localStorage.removeItem("id_Profesor");
  localStorage.removeItem("userData");
  localStorage.removeItem("materia");
 handleGoBack();
}

/**
 * Verifica si el token está expirado y ejecuta logout si es así.
 */
export function checkTokenExpiration() {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const decoded = jwt_decode(token);
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      console.warn("Token expirado. Cerrando sesión automáticamente.");
      logoutUser();
    }
  } catch (error) {
    console.error("Error al verificar la expiración del token:", error);
    console.error("Token inválido. Cerrando sesión por seguridad.");
    logoutUser();
  }
}

/**
 * Establece logout automático basado en el tiempo de expiración del token.
 */
export function setAutoLogout() {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const decoded = jwt_decode(token);
    const timeUntilExpire = decoded.exp * 1000 - Date.now();

    if (timeUntilExpire > 0) {
      setTimeout(() => {
        console.warn("Token expirado automáticamente.");
        logoutUser();
      }, timeUntilExpire);
    } else {
      logoutUser();
    }
  } catch (error) {
    console.error("Error al establecer auto-logout:", error

    );
    console.error("Token inválido. Cerrando sesión por seguridad. ");
    logoutUser();
  }
}
