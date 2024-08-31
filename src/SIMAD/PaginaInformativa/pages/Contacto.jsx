import { Footer } from '../../components/Footer';
import Navbar from '../../components/Navbar';
import 'aos/dist/aos.css'

const Contacto = () => {
  return (
    <div className="bg-gray-300 min-h-screen font-roboto"> {/* Usar Roboto como fuente principal */}
    {/* Navbar */}
    <Navbar />

      {/* Hero Section */}
      <section className="h-96 flex items-center justify-center relative bg-hero">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="relative p-10 text-center text-white">
          <h2 className="text-5xl font-bold">Contacto</h2>
          <p className="mt-4 text-lg">Ponte en contacto con nosotros</p>
        </div>
      </section>

      {/* Sección de Formulario de Contacto */}
      <section className="py-16 bg-white text-gray-800">
        <div className="container mx-auto">
          <h3 className="text-3xl font-semibold mb-6 text-blue-900 text-center">Envíanos un mensaje</h3>
          <form className="max-w-2xl mx-auto bg-gray-100 p-8 rounded-lg shadow-lg">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                Nombre Completo
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                type="text"
                placeholder="Tu nombre"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Correo Electrónico
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                placeholder="Tu correo electrónico"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="subject">
                Asunto
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="subject"
                type="text"
                placeholder="Asunto de tu mensaje"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">
                Mensaje
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="message"
                rows="5"
                placeholder="Escribe tu mensaje aquí..."
              ></textarea>
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
              >
                Enviar Mensaje
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Footer */}
     <Footer/>
    </div>
  );
};

export default Contacto;
