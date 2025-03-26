import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { fetchUserProfile } from "./services/useProfileService";

export const MiPerfil = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const userData = await fetchUserProfile();
        setUser(userData);

        // Guardar el correo en localStorage
        if (userData && userData.email_Usuario) {
          localStorage.setItem("email_Usuario", userData.email_Usuario);
        } else {
          console.log("No se encontró el correo en los datos del usuario."); // Depuración
        }
      } catch (err) {
        console.error("Error al cargar el perfil del usuario:", err);
        setError("Error al cargar el perfil del usuario");
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  const handleLogoutAndRedirect = () => {
    Swal.fire({
      title: "¿Está seguro?",
      text: "Esto cerrará su sesión y lo redirigirá para cambiar su contraseña.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, continuar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        const email = localStorage.getItem("email_Usuario");
        if (email) {
          localStorage.setItem("tempEmail", email); // Guardar temporalmente
        } else {
          console.log("No se encontró el correo en localStorage."); // Depuración
        }

        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("id_Usuario");
        localStorage.removeItem("id_Estudiante");
        localStorage.removeItem("id_Profesor");
        localStorage.removeItem("userData");


        navigate("/auth/forgot-password");
      }
    });
  };

  if (error) {
    return <p className="text-center mt-10 text-red-600">{error}</p>;
  }

  if (loading) {
    return <p className="text-center mt-10">Cargando perfil...</p>;
  }

  if (!user) {
    return <p className="text-center mt-10">No se encontraron datos del usuario</p>;
  }

  const coverImage = user.coverImage || "/images/default-cover.jpg";
  const profileImage = user.profileImage || null;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center">
      {/* Portada */}
      <div className="w-full relative">
        <img
          src={coverImage}
          alt="Portada del perfil"
          className="w-full h-48 object-cover"
        />
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
          {profileImage ? (
            <img
              src={profileImage}
              alt="Avatar"
              className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-900 shadow-md"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center border-4 border-white dark:border-gray-900 shadow-md">
              <span className="text-white text-3xl font-bold">
                {user.nombre_Usuario ? user.nombre_Usuario.charAt(0) : ""}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Tarjeta de perfil */}
      <div className="mt-16 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 max-w-lg w-full mx-4">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
            {user.nombre_Usuario} {user.apellido1_Usuario} {user.apellido2_Usuario}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">{user.email_Usuario}</p>
        </div>

        <div className="mt-6 space-y-3">
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold text-gray-700 dark:text-gray-300">Nombre:</span>
            <span className="text-gray-600 dark:text-gray-200">{user.nombre_Usuario}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold text-gray-700 dark:text-gray-300">Apellidos:</span>
            <span className="text-gray-600 dark:text-gray-200">
              {user.apellido1_Usuario} {user.apellido2_Usuario}
            </span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold text-gray-700 dark:text-gray-300">Correo:</span>
            <span className="text-gray-600 dark:text-gray-200">{user.email_Usuario}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold text-gray-700 dark:text-gray-300">Rol:</span>
            <span className="text-gray-600 dark:text-gray-200">
              {user.nombre_Rol || "Sin rol asignado"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700 dark:text-gray-300">Contraseña:</span>
            <span className="text-gray-600 dark:text-gray-200">********</span>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={handleLogoutAndRedirect}
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
          >
            Cambiar Contraseña
          </button>
        </div>
      </div>
    </div>
  );
};

export default MiPerfil;
