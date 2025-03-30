import { Helmet } from 'react-helmet';
import getCloudinaryUrl from '../utils/cloudinary';

// Versión para móviles (600px de ancho)
const heroBg_mobile = getCloudinaryUrl("copia_para_banner_f3meci.jpg", "w_600,q_auto,f_auto");
// Versión para pantallas pequeñas (768px)
const heroBg_768 = getCloudinaryUrl("copia_para_banner_f3meci.jpg", "w_768,q_auto,f_auto");
// Versión para pantallas medianas (1024px)
const heroBg_1024 = getCloudinaryUrl("copia_para_banner_f3meci.jpg", "w_1024,q_auto,f_auto");
// Versión para pantallas grandes (1600px)
const heroBg_1600 = getCloudinaryUrl("copia_para_banner_f3meci.jpg", "w_1600,q_auto,f_auto");

export const HeroSection = () => {
  return (
    <>
      <Helmet>
        <link
          rel="preload"
          as="image"
          href={heroBg_1024}
        />
      </Helmet>

      <div className="relative h-[70vh]">
        {/* Imagen de fondo responsiva con srcSet y sizes */}
        <img
          src={heroBg_1024}
          srcSet={`
            ${heroBg_mobile} 600w,
            ${heroBg_768} 768w,
            ${heroBg_1024} 1024w,
            ${heroBg_1600} 1600w
          `}
          sizes="(max-width: 768px) 600px,
                 (max-width: 1280px) 1024px,
                 1600px"
          alt="Fondo hero"
          className="absolute inset-0 w-full h-full object-cover object-top"
          loading="eager"
        />

        {/* Overlay para suavizar el fondo */}
        <div className="absolute inset-0 bg-black opacity-30"></div>

        {/* Card semi-transparente */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="max-w-4xl w-full mx-auto p-8 bg-black bg-opacity-70 rounded-lg shadow-lg text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white">
              Bienvenido al Liceo Santa Cruz
            </h2>
            <p className="mt-2 md:mt-4 text-sm sm:text-base md:text-lg text-white">
              Somos una huella de éxito en el tiempo, con el futuro en tus manos.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroSection;
