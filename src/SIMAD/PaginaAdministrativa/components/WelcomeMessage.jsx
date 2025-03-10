import { useEffect, useState } from "react";
import { fetchUserProfile } from "./../pages/Perfil/services/useProfileService";

const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const WelcomeMessage = () => {
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await fetchUserProfile();
        setUserProfile(profile);
      } catch (error) {
        console.error("Error al obtener el perfil del usuario:", error);
      }
    };
    loadProfile();
  }, []);

  if (!userProfile) {
    return <p className="text-center">Cargando perfil...</p>;
  }

  const { nombre_Usuario, apellido1_Usuario } = userProfile;

  return (
    <div className="p-4 bg-white shadow rounded-md text-center">
      <h1 className="text-2xl font-bold">
        ¡Bienvenido, {capitalize(nombre_Usuario)} {capitalize(apellido1_Usuario)}!
      </h1>
    </div>
  );
};
