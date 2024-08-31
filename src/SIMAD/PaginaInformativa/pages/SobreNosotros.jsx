 import Navbar from '../../components/Navbar';
 import 'aos/dist/aos.css'

const SobreNosotros = () => {
  return (
<div className="bg-gray-300 min-h-screen font-roboto"> {/* Usar Roboto como fuente principal */}
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="h-96 flex items-center justify-center relative bg-hero">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="relative p-10 text-center text-white">
          <h2 className="text-5xl font-bold">Sobre Nosotros</h2>
          <p className="mt-4 text-lg">Conoce nuestra misión y visión.</p>
        </div>
      </section>

      {/* Sección de Misión y Visión */}
      <section className="py-16 bg-white text-gray-800">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-semibold mb-6 text-blue-900">Nuestra Misión y Visión</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8">
              <h4 className="text-2xl font-bold text-blue-900 mb-4">Misión</h4>
              <p className="text-gray-700">
                El Liceo de Santa Cruz es una institución de enseñanza secundaria que procura preparar integralmente al estudiante en la modalidad académica, enriquecida por las diversas especialidades en los campos: científicos, musical, deportivos, artísticos y técnicos; lo que permite caracterizar a la institución en un ambiente formativo, agradable; que involucre el esfuerzo y dedicación de sus docentes, mejorando la eficacia y eficiencia educativa, procurando así resaltar los valores cívicos, morales, espirituales y sociales para que en un futuro el joven obtenga de esta formación sus propios beneficios.
              </p>
            </div>
            <div className="p-8">
              <h4 className="text-2xl font-bold text-blue-900 mb-4">Visión</h4>
              <p className="text-gray-700">
                El Liceo de Santa Cruz, como institución educativa, pretende mejorar la calidad de vida del estudiantado y la comunidad, promoviendo la formación teórico-práctica para la adquisición de los conocimientos de los educandos en un ambiente apropiado, con una planta física remodelada que cumpla con las exigencias de la comunidad de Santa Cruz.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-4">
        <div className="container mx-auto flex justify-between items-center">
          <p>© 2024 Liceo Santa Cruz. Todos los derechos reservados.</p>
          <div className="flex space-x-4">
            <a href="https://facebook.com" className="hover:text-red-600">Facebook</a>
            <a href="https://twitter.com" className="hover:text-red-600">Twitter</a>
            <a href="https://instagram.com" className="hover:text-red-600">Instagram</a>
          </div>
        </div>
      </footer>
    </div>
  );
};


export default SobreNosotros;