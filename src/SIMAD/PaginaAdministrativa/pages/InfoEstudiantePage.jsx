import { EventList } from "../components/EventList";
import "@sweetalert2/theme-bulma/bulma.css";
import getCloudinaryUrl from "../../PaginaInformativa/utils/cloudinary";

export const InfoEstudiantePage = () => {
  // Generamos la URL de la imagen a través de Cloudinary.
  // Asegúrate de que el public ID sea el correcto (sin extensión, si se subió sin ella).
  const heroImage = getCloudinaryUrl("istockphoto-1168910967-612x612_w7oz98", "w_800,w_1920,c_scale", "image");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-200 via-gray-100 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 flex flex-col items-center justify-center p-8">
      <div className="max-w-5xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center space-y-10">
        <h1 className="text-6xl md:text-7xl font-extrabold text-gray-900 dark:text-white">
          ¡Bienvenido, estudiante!
        </h1>
        <p className="text-2xl md:text-3xl text-gray-700 dark:text-gray-300">
          Recuerda que cada día es una nueva oportunidad para aprender, crecer y descubrir lo que te apasiona.
        </p>
        <img
          src={heroImage}
          alt="Imagen representativa"
          className="w-full max-w-md mx-auto rounded-2xl shadow-lg border-4 border-white dark:border-gray-700"
        />
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400">
          Explora tus cursos, participa en eventos y construye tu futuro con cada paso. ¡Tu camino al éxito comienza ahora!
        </p>
      </div>
  
      {/* Sección adicional para mostrar eventos */}
      <div className="max-w-5xl w-full mt-12">
        <EventList />
      </div>
    </div>
  );
};

export default InfoEstudiantePage;
