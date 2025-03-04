import 'aos/dist/aos.css';
import { useEffect } from 'react';
import AOS from 'aos';
import { FaBullseye, FaLightbulb } from 'react-icons/fa';

export const SobreNosotros = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="bg-gradient-to-b from-blue-100 to-white font-roboto">
      {/* Sección de Misión y Visión */}
      <section className="py-8 sm:py-10 text-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-6 text-blue-900">
            Nuestra misión y visión
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tarjeta de Misión */}
            <div
              data-aos="fade-up"
              className="p-4 md:p-6 bg-white rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105"
            >
              <div className="text-[#9F0808] mb-4">
                <FaBullseye className="w-10 h-10 mx-auto mb-2" />
                <h4 className="text-xl md:text-2xl font-bold">Misión</h4>
              </div>
              <p className="text-gray-700 text-sm md:text-base">
                El Liceo de Santa Cruz es una institución de enseñanza secundaria que procura preparar integralmente al estudiante en la modalidad académica, enriquecida por las diversas especialidades en los campos: científicos, musical, deportivos, artísticos y técnicos; lo que permite caracterizar a la institución en un ambiente formativo, agradable; que involucre el esfuerzo y dedicación de sus docentes, mejorando la eficacia y eficiencia educativa, procurando así resaltar los valores cívicos, morales, espirituales y sociales para que en un futuro el joven obtenga de esta formación sus propios beneficios.
              </p>
            </div>
            {/* Tarjeta de Visión */}
            <div
              data-aos="fade-up"
              className="p-4 md:p-6 bg-white rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105"
            >
              <div className="text-[#9F0808] mb-4">
                <FaLightbulb className="w-10 h-10 mx-auto mb-2" />
                <h4 className="text-xl md:text-2xl font-bold">Visión</h4>
              </div>
              <p className="text-gray-700 text-sm md:text-base">
                El Liceo de Santa Cruz, como institución educativa, pretende mejorar la calidad de vida del estudiantado y la comunidad, promoviendo la formación teórico-práctica para la adquisición de los conocimientos de los educandos en un ambiente apropiado, con una planta física remodelada que cumpla con las exigencias de la comunidad de Santa Cruz.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SobreNosotros;
