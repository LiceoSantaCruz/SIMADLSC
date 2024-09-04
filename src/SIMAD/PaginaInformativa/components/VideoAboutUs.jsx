import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export const VideoAboutUs = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000, 
      easing: 'ease-in-out', 
      once: true, 
    });
  }, []);

  return (
    <section className="py-16 bg-white text-gray-800" data-aos="fade-up">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center lg:items-start">
          {/* Video de presentación del Liceo Santa Cruz */}
          <div className="w-full lg:w-1/2 mb-6 lg:mb-0 lg:pr-8" data-aos="fade-right" data-aos-delay="200">
            <video className="w-full rounded-lg shadow-lg" controls>
              <source src="public\Video\video de presentacion liceo santa cruz.mp4" type="video/mp4" />
              Tu navegador no soporta el elemento de video.
            </video>
          </div>
          {/* Título y Texto descriptivo */}
          <div className="w-full lg:w-1/2 text-left" data-aos="fade-left" data-aos-delay="400">
            <h3 className="text-3xl font-semibold mb-4 text-blue-900">¿Quiénes Somos?</h3>
            <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed">
              El Liceo Santa Cruz es una institución educativa dedicada a brindar una educación de calidad en un ambiente seguro y acogedor. Ofrecemos una variedad de programas académicos y extracurriculares diseñados para el desarrollo integral de nuestros estudiantes, preparando a los jóvenes para los retos del futuro.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoAboutUs;
