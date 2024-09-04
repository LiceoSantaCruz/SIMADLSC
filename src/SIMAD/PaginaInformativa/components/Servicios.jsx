import { useEffect } from 'react';
import 'aos/dist/aos'
import AOS from 'aos';

export const Servicios = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 }); 
  }, []);

  return (
    <div className="bg-gray-100 font-roboto">
      
      {/* Sección de Servicios */}
      <section className="py-16 bg-white text-gray-800">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-semibold mb-4 text-blue-900">Nuestros Servicios Educativos</h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            En nuestro centro educativo, ofrecemos una gama de servicios diseñados para apoyar el desarrollo integral de nuestros estudiantes, tanto académica como personalmente.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div data-aos="fade-up" className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 border-t-4 border-[#9F0808] transform hover:scale-105">
              <h4 className="text-2xl font-bold text-blue-900 mb-4">Orientación Académica</h4>
              <p className="text-gray-700">
                Brindamos orientación académica para ayudar a nuestros estudiantes a elegir las mejores opciones para su futuro académico y profesional.
              </p>
            </div>
            <div data-aos="fade-up" className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 border-t-4 border-[#9F0808] transform hover:scale-105">
              <h4 className="text-2xl font-bold text-blue-900 mb-4">Actividades Extracurriculares</h4>
              <p className="text-gray-700">
                Ofrecemos una variedad de actividades extracurriculares, incluyendo deportes, música y arte, para complementar la educación de nuestros estudiantes.
              </p>
            </div>
            <div data-aos="fade-up" className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 border-t-4 border-[#9F0808] transform hover:scale-105">
              <h4 className="text-2xl font-bold text-blue-900 mb-4">Asesoría Psicológica</h4>
              <p className="text-gray-700">
                Contamos con un equipo de profesionales para brindar apoyo psicológico y emocional a nuestros estudiantes en cualquier momento.
              </p>
            </div>
            {/* Nuevas tarjetas de servicios */}
            <div data-aos="fade-up" className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 border-t-4 border-[#9F0808] transform hover:scale-105">
              <h4 className="text-2xl font-bold text-blue-900 mb-4">Biblioteca</h4>
              <p className="text-gray-700">
                Nuestra biblioteca está equipada con una extensa colección de libros y recursos para apoyar el aprendizaje y la investigación de los estudiantes.
              </p>
            </div>
            <div data-aos="fade-up" className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 border-t-4 border-[#9F0808] transform hover:scale-105">
              <h4 className="text-2xl font-bold text-blue-900 mb-4">Comedor</h4>
              <p className="text-gray-700">
                Ofrecemos un comedor con comidas saludables y equilibradas, diseñadas para satisfacer las necesidades nutricionales de nuestros estudiantes.
              </p>
            </div>
            <div data-aos="fade-up" className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 border-t-4 border-[#9F0808] transform hover:scale-105">
              <h4 className="text-2xl font-bold text-blue-900 mb-4">Laboratorio de Ciencias</h4>
              <p className="text-gray-700">
                Contamos con un laboratorio de ciencias bien equipado para facilitar el aprendizaje práctico en biología, química y física.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Servicios;
