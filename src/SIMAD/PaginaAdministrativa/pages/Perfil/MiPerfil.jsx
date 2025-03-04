import { useEffect, useState } from "react";
import { fetchUserProfile } from "./services/useProfileService";

export const MiPerfil = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const userData = await fetchUserProfile();
        setUser(userData);
      } catch (err) {
        console.error("Error al cargar el perfil del usuario:", err);
        setError("Error al cargar el perfil del usuario");
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  if (error) {
    return <p className="text-center mt-10 text-red-600">{error}</p>;
  }
  if (loading) {
    return <p className="text-center mt-10">Cargando perfil...</p>;
  }
  if (!user) {
    return <p className="text-center mt-10">No se encontraron datos del usuario</p>;
  }

  // Opcional: campos para portada y avatar, si no se proporcionan se usan valores por defecto.
  const coverImage = user.coverImage || "/images/default-cover.jpg";
  const profileImage = user.profileImage || null;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      {/* Portada */}
      <div className="w-full relative">
        <img
          src={coverImage}
          alt="Portada del perfil"
          className="w-full h-48 object-cover"
        />
        {/* Avatar superpuesto */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
          {profileImage ? (
            <img
              src={profileImage}
              alt="Avatar"
              className="w-24 h-24 rounded-full border-4 border-white shadow-md"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center border-4 border-white shadow-md">
              <span className="text-white text-3xl font-bold">
                {user.nombre_Usuario ? user.nombre_Usuario.charAt(0) : ""}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Tarjeta de perfil */}
      <div className="mt-16 bg-white shadow-lg rounded-lg p-6 max-w-lg w-full mx-4">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            {user.nombre_Usuario} {user.apellido1_Usuario} {user.apellido2_Usuario}
          </h2>
          <p className="text-gray-600">{user.email_Usuario}</p>
        </div>

        <div className="mt-6 space-y-3">
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold text-gray-700">Nombre:</span>
            <span className="text-gray-600">{user.nombre_Usuario}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold text-gray-700">Apellidos:</span>
            <span className="text-gray-600">
              {user.apellido1_Usuario} {user.apellido2_Usuario}
            </span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold text-gray-700">Correo:</span>
            <span className="text-gray-600">{user.email_Usuario}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold text-gray-700">Rol:</span>
            <span className="text-gray-600">
              {user.nombre_Rol || "Sin rol asignado"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Contraseña:</span>
            <span className="text-gray-600">********</span>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <a
            href="/auth/forgot-password"
            className="text-blue-600 hover:underline text-sm"
          >
            Cambiar Contraseña
          </a>
        </div>
      </div>
    </div>
  );
};

export default MiPerfil;
