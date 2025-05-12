// src/Pages/MiPerfil.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { fetchUserProfile } from "./services/useProfileService";

export const MiPerfil = () => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const navigate              = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchUserProfile();
        setUser(data);
        if (data?.email_Usuario) {
          localStorage.setItem("email_Usuario", data.email_Usuario);
        }
      } catch (err) {
        console.error(err);
        setError("Error al cargar el perfil del usuario");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleLogoutAndRedirect = () => {
    Swal.fire({
      title: "¿Está seguro?",
      text: "Esto cerrará su sesión y lo redirigirá para cambiar su contraseña.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, continuar",
      cancelButtonText: "Cancelar",
    }).then((res) => {
      if (!res.isConfirmed) return;
      const email = localStorage.getItem("email_Usuario");
      if (email) localStorage.setItem("tempEmail", email);
      ["token","role","id_Usuario","id_Estudiante","id_Profesor","userData"]
        .forEach(k => localStorage.removeItem(k));
      navigate("/auth/forgot-password");
    });
  };

  if (error)   return <p className="mt-10 text-center text-red-600">{error}</p>;
  if (loading) return <p className="mt-10 text-center">Cargando perfil...</p>;
  if (!user)   return <p className="mt-10 text-center">No hay datos del usuario.</p>;

  const profileImage = user.profileImage;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center pt-32 pb-12">
      {/* Avatar con ring limpio, más abajo */}
      <div className="relative -mt-8 z-10">
        {profileImage ? (
          <img
            src={profileImage}
            alt="Avatar"
            className="w-24 h-24 rounded-full ring-4 ring-white dark:ring-gray-900 object-cover"
            onError={e => { e.currentTarget.style.display = "none"; }}
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-blue-500 ring-4 ring-white dark:ring-gray-900 flex items-center justify-center">
            <span className="text-white text-3xl font-bold">
              {user.nombre_Usuario?.charAt(0) || ""}
            </span>
          </div>
        )}
      </div>

      {/* Tarjeta de perfil */}
      <div className="mt-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 max-w-lg w-full mx-4 relative z-10 text-gray-900 dark:text-gray-100">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold">
            {user.nombre_Usuario} {user.apellido1_Usuario} {user.apellido2_Usuario}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">{user.email_Usuario}</p>
        </div>

        <div className="mt-6 space-y-3">
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Nombre:</span>
            <span>{user.nombre_Usuario}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Apellidos:</span>
            <span>{user.apellido1_Usuario} {user.apellido2_Usuario}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Correo:</span>
            <span>{user.email_Usuario}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Rol:</span>
            <span>{user.nombre_Rol || "Sin rol asignado"}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Contraseña:</span>
            <span>********</span>
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
