import Navbar from './Navbar';
import 'aos/dist/aos.css'

const Servicios = () => {
  return (
    <div className="bg-gray-300 min-h-screen font-roboto"> {/* Usar Roboto como fuente principal */}
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="h-96 flex items-center justify-center relative bg-hero">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="relative p-10 text-center text-white">
          <h2 className="text-5xl font-bold">Nuestros Servicios</h2>
          <p className="mt-4 text-lg">Descubre los servicios que ofrecemos a nuestros estudiantes.</p>
        </div>
      </section>

      {/* Sección de Servicios */}
      <section className="py-16 bg-white text-gray-800">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-semibold mb-6 text-blue-900">Servicios Educativos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-100 p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h4 className="text-2xl font-bold text-blue-900 mb-4">Orientación Académica</h4>
              <p className="text-gray-700">
                Brindamos orientación académica para ayudar a nuestros estudiantes a elegir las mejores opciones para su futuro académico y profesional.
              </p>
            </div>
            <div className="bg-gray-100 p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h4 className="text-2xl font-bold text-blue-900 mb-4">Actividades Extracurriculares</h4>
              <p className="text-gray-700">
                Ofrecemos una variedad de actividades extracurriculares, incluyendo deportes, música y arte, para complementar la educación de nuestros estudiantes.
              </p>
            </div>
            <div className="bg-gray-100 p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h4 className="text-2xl font-bold text-blue-900 mb-4">Asesoría Psicológica</h4>
              <p className="text-gray-700">
                Contamos con un equipo de profesionales para brindar apoyo psicológico y emocional a nuestros estudiantes en cualquier momento.
              </p>
            </div>
            {/* Agregar más servicios si es necesario */}
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

export default Servicios;
