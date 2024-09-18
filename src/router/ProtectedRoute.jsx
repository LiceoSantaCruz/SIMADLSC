import { Navigate, Outlet } from 'react-router-dom';
import PropTypes from 'prop-types'; // Importar PropTypes para validación
import {jwtDecode} from 'jwt-decode'; // Importar jwt-decode para decodificar el token

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem('token'); // Obtener el token del localStorage

  if (!token) {
    // Si no hay token, redirigir a la página de login
    return <Navigate to="/login" />;
  }

  try {
    const decodedToken = jwtDecode(token); // Decodificar el token
    const userRole = decodedToken.rol; // Asumimos que el rol está almacenado como "rol"

    if (!allowedRoles.includes(userRole)) {
      // Si el rol no está permitido, redirigir a la página de acceso denegado
      return <Navigate to="/access-denied" />;
    }

    // Si el rol es válido, renderizar el contenido de la ruta protegida
    return <Outlet />;
  } catch (error) {
    // Si el token es inválido o hay algún error, redirigir a la página de login
    return <Navigate to="/login" />;
  }
};

// Validación de PropTypes
ProtectedRoute.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired, // allowedRoles debe ser un array de strings
};

export default ProtectedRoute;
