import React from 'react';
import Slider from 'react-slick';
import Navbar from '../../Components/Navbar';
import AOS from 'aos';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'aos/dist/aos.css';
import '../../App.css';



const SimadPage = () => {

  React.useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true,
    });
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
  };

  return (
    <div className="bg-gray-300 min-h-screen font-roboto"> {/* Usar Roboto como fuente principal */}
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="h-96 flex items-center justify-center relative bg-hero">
      <div className="absolute inset-0 bg-black opacity-30"></div>
      <div className="relative p-10 text-center text-white" data-aos="fade-up">
        <h2 className="text-5xl font-bold">Bienvenido al Liceo Santa Cruz</h2>
        <p className="mt-4 text-lg">Donde la educación secundaria es una aventura.</p>
      </div>
    </section>

   

      {/* Sección de Educación Secundaria */}
      <section className="py-16 bg-blue-800 text-white" data-aos="fade-up"> {/* Azul oscuro para fondo de sección */}
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-semibold mb-6">Nuestra Educación Secundaria</h3>
          <p className="mb-10 max-w-2xl mx-auto text-gray-300">En el Liceo Santa Cruz, nos especializamos en brindar una educación secundaria de calidad que prepara a nuestros estudiantes para los retos del futuro.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-blue-700 p-8 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <h4 className="text-2xl font-bold text-white mb-4">Currículo Académico</h4>
              <p className="text-gray-300">Nuestro currículo está diseñado para proporcionar una educación integral, enfocada en el desarrollo de habilidades críticas y conocimiento profundo en diversas disciplinas.</p>
            </div>
            <div className="bg-blue-700 p-8 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <h4 className="text-2xl font-bold text-white mb-4">Actividades Extracurriculares</h4>
              <p className="text-gray-300">Ofrecemos una variedad de actividades extracurriculares que complementan la educación académica y fomentan habilidades sociales y de liderazgo.</p>
            </div>
          </div>
        </div>
      </section>

      

      <section className="py-16 bg-gray-100" data-aos="fade-up"> {/* Fondo gris claro como antes */}
      <div className="container mx-auto text-center">
        <h3 className="text-3xl font-semibold mb-6 text-blue-900">Eventos Próximos</h3> {/* Azul para el título */}
        <Slider {...sliderSettings}>
          <div className="p-6">
            <div
              className="bg-cover bg-center p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
              style={{
                backgroundImage: "url('/images/Evento1.png')",
                minHeight: '300px',
              }}
            >
              <div className="bg-white bg-opacity-80 p-6 rounded-lg"> {/* Fondo blanco con opacidad */}
                <h4 className="text-xl font-bold text-red-600">Semana de la Ciencia</h4> {/* Rojo para el título */}
                <p className="text-gray-600">Fecha: 15 de septiembre de 2024</p>
                <p className="text-gray-700 mt-2">
                  Participa en nuestra semana de la ciencia donde los estudiantes presentan proyectos innovadores y exploraciones científicas.
                </p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div
              className="bg-cover bg-center p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
              style={{
                backgroundImage: "url('/images/Evento2.png')",
                minHeight: '300px',
              }}
            >
              <div className="bg-white bg-opacity-80 p-6 rounded-lg"> {/* Fondo blanco con opacidad */}
                <h4 className="text-xl font-bold text-red-600">Campeonato Intercolegial</h4> {/* Rojo para el título */}
                <p className="text-gray-600">Fecha: 22 de septiembre de 2024</p>
                <p className="text-gray-700 mt-2">
                  Únete a nosotros para apoyar a nuestros equipos en el campeonato intercolegial de deportes.
                </p>
              </div>
            </div>
          </div>
          {/* Puedes añadir más eventos aquí con diferentes imágenes de fondo */}
        </Slider>
      </div>
    </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-4">
        <div className="container mx-auto flex justify-between items-center">
          <p>© 2024 Liceo Santa Cruz. Todos los derechos reservados.</p>
          <div className="flex space-x-4">
            <a href="https://facebook.com" className="hover:text-red-600">Facebook</a> {/* Rojo para enlaces hover */}
            <a href="https://twitter.com" className="hover:text-red-600">Twitter</a>
            <a href="https://instagram.com" className="hover:text-red-600">Instagram</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SimadPage;
