import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import getCloudinaryUrl from '../utils/cloudinary';

// Genera la URL optimizada para la imagen de fondo usando Cloudinary
const heroBg = getCloudinaryUrl("copia_para_banner_f3meci.jpg", "w_1920,q_auto,f_auto");

export const HeroSection = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="relative h-[70vh]">
      {/* Imagen de fondo con carga prioritaria y posicionada en center top */}
      <img
        src={heroBg}
        alt="Fondo hero"
        className="absolute inset-0 w-full h-full object-cover object-top"
        loading="eager"
      />

      {/* Overlay opcional para suavizar el fondo */}
      <div className="absolute inset-0 bg-black opacity-30"></div>

      {/* Card semi-transparente, más alargado */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div
          className="max-w-2xl w-full mx-auto p-8 bg-black bg-opacity-70 rounded-lg shadow-lg text-center"
          data-aos="fade-up"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white">
            Bienvenido al Liceo Santa Cruz
          </h2>
          <p className="mt-2 md:mt-4 text-sm sm:text-base md:text-lg text-white">
            Somos una huella de éxito en el tiempo, con el futuro en tus manos.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
