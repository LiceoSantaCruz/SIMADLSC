import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import getCloudinaryUrl from '../utils/cloudinary';

// Genera la URL optimizada para el video usando Cloudinary
// Asegúrate de que "video-de-presentacion-liceo-santa-cruz.mp4" sea el publicId del video en Cloudinary
const videoUrl = getCloudinaryUrl("Liceo_Santa_Cruz_bxs0ix.mp4", "w_1920,q_auto,f_auto", "video");

export const VideoAboutUs = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
    });
  }, []);

  return (
    <section className="py-12 lg:py-16 bg-white text-gray-800" data-aos="fade-up">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center lg:items-start">
          {/* Video de presentación del Liceo Santa Cruz */}
          <div
            className="w-full lg:w-1/2 mb-6 lg:mb-0 lg:pr-8"
            data-aos="fade-right"
            data-aos-delay="200"
          >
            <div className="relative pb-[56.25%] overflow-hidden rounded-lg shadow-lg">
              <video className="absolute inset-0 w-full h-full object-cover" controls>
                <source src={videoUrl} type="video/mp4" />
                Tu navegador no soporta el elemento de video.
              </video>
            </div>
          </div>
          {/* Título y Texto descriptivo */}
          <div
            className="w-full lg:w-1/2 text-left"
            data-aos="fade-left"
            data-aos-delay="400"
          >
            <h3 className="text-2xl sm:text-3xl font-semibold mb-4 text-blue-900">
              ¿Quiénes somos?
            </h3>
            <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed">
              El Liceo Santa Cruz es una institución educativa dedicada a brindar una
              educación de calidad en un ambiente seguro y acogedor. Ofrecemos una variedad
              de programas académicos y extracurriculares diseñados para el desarrollo de
              nuestros estudiantes, preparando a los jóvenes para los retos del futuro.
              <br className="block md:hidden" />
              Contamos con talleres de robótica, ferias científicas, grupos deportivos y
              grupos de baile cultural, comprometiéndonos a proporcionar experiencias
              enriquecedoras que fomenten el aprendizaje y la creatividad. Cada año, nuestros
              estudiantes participan en eventos como el festival estudiantil de las artísticas,
              torneos deportivos regionales y nacionales, y presentaciones artísticas que
              celebran el talento y la dedicación de nuestros jóvenes.
              <br className="block md:hidden" />
              En el Liceo Santa Cruz, nos enorgullece ser un espacio donde los estudiantes
              pueden crecer académica, personal y socialmente, preparados para enfrentar
              los desafíos del mundo con confianza y habilidades sólidas.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoAboutUs;
