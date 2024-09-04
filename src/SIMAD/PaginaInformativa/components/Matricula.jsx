import { useEffect } from 'react';
import 'aos/dist/aos.css';
import AOS from 'aos';

export const Matricula = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 }); 
  }, []);

  return (
    <section
      className="py-16 bg-cover bg-center"
      style={{ backgroundImage: "url('Images/LiceoMatricula.jpg')" }} 
      aria-labelledby="matricula-title"
    >
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        <div
          className="bg-white bg-opacity-95 rounded-xl shadow-xl flex flex-col md:flex-row items-center overflow-hidden"
          data-aos="fade-up" 
        >
          {/* Columna Izquierda: Información de Matrícula */}
          <div className="w-full md:w-1/2 p-8" data-aos="fade-right" data-aos-delay="200">
            <h2 id="matricula-title" className="text-3xl font-bold text-blue-900 mb-4">
              ¿Por qué Matricular con Nosotros?
            </h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              En el Liceo Santa Cruz, nos comprometemos a ofrecer una educación de excelencia que prepara a nuestros estudiantes para enfrentar los desafíos del futuro. Nuestros programas académicos están diseñados para desarrollar habilidades críticas y fomentar el crecimiento personal en un entorno seguro y de apoyo.
            </p>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Ofrecemos una amplia variedad de actividades extracurriculares, acceso a tecnología de vanguardia, y un enfoque en el desarrollo de valores cívicos y sociales. Nuestro personal docente, altamente calificado, está dedicado a guiar a cada estudiante en su camino hacia el éxito.
            </p>
            <p className="text-gray-700 leading-relaxed">
              ¡Únete a nuestra comunidad y descubre por qué el Liceo Santa Cruz es la mejor opción para tu educación secundaria!
            </p>
          </div>

          {/* Columna Derecha: Botón de Matrícula y Mensaje Aclaratorio */}
          <div className="w-full md:w-1/2 p-8 bg-blue-50 rounded-r-xl flex flex-col items-center justify-center" data-aos="fade-left" data-aos-delay="400">
            {/* Mensaje Aclaratorio */}
            <p className="text-blue-900 text-center text-sm font-medium mb-4 px-4 py-2 bg-blue-100 rounded-md shadow-sm">
              Nota: El periodo de matrícula será válido únicamente cuando se publique oficialmente en nuestras redes sociales.
            </p>
            <button
              className="bg-blue-900 text-white font-bold py-3 px-6 rounded-full hover:bg-blue-700 transition duration-300 shadow-lg"
              aria-label="Iniciar proceso de matrícula"
            >
              Iniciar Matrícula
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Matricula;
