import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export const Eventos = () => {
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    centerMode: true,
    centerPadding: "0",
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div>
      <section className="py-16 bg-gradient-to-b from-gray-100 to-blue-50" data-aos="fade-up">
        {/* Fondo degradado claro para un toque moderno */}
        <div className="container mx-auto text-center">
          <h3 className="text-4xl font-bold mb-8 text-blue-900">
            Eventos anuales
          </h3>
          <Slider {...sliderSettings}>
            {/* Card 1 */}
            <div className="p-4">
              <div className="event-card rounded-xl shadow-lg hover:shadow-2xl transition-transform duration-500 transform hover:scale-105 overflow-hidden">
                <div
                  style={{
                    backgroundImage: "url('/images/IMG_6505.JPG')",
                    height: "180px", 
                  }}
                  className="bg-center bg-cover rounded-t-lg relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black opacity-50 rounded-t-lg"></div>
                </div>
                <div className="bg-white p-6 h-56 flex flex-col justify-between rounded-b-lg relative">
                  <div>
                    <h4 className="text-xl font-bold text-red-600">
                      Semana de la guanacastequidad
                    </h4>
                    <p className="text-gray-700 mt-2">
Únete a nosotros en esta tradicional semana para honrar la rica cultura y herencia de Guanacasteca. Disfruta de actividades llenas de historia, música y gastronomía que reflejan el espíritu único de nuestra región.
¡No te lo pierdas!                     </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Card 2 */}
            <div className="p-4">
              <div className="event-card rounded-xl shadow-lg hover:shadow-2xl transition-transform duration-500 transform hover:scale-105 overflow-hidden">
                <div
                  style={{
                    backgroundImage: "url('/images/IMG_0675.JPG')",
                    height: "180px",
                  }}
                  className="bg-center bg-cover rounded-t-lg relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black opacity-50 rounded-t-lg"></div>
                </div>
                <div className="bg-white p-6 h-56 flex flex-col justify-between rounded-b-lg relative">
                  <div>
                    <h4 className="text-xl font-bold text-red-600">
                    Gran bingo millonario Liceo Santa Cruz
                    </h4>
                    <p className="text-gray-700 mt-2">
                    
¡No te pierdas el Gran bingo millonario anual del Liceo Santa Cruz!

Únete a nosotros para una dia de diversión y grandes premios. Este evento anual une a nuestra comunidad para apoyar a nuestros estudiantes. ¡No faltes a esta querida tradición!                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Card 3 */}
            <div className="p-4">
              <div className="event-card rounded-xl shadow-lg hover:shadow-2xl transition-transform duration-500 transform hover:scale-105 overflow-hidden">
                <div
                  style={{
                    backgroundImage: "url('/images/IMG_8001.JPG')",
                    height: "180px",
                  }}
                  className="bg-center bg-cover rounded-t-lg relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black opacity-50 rounded-t-lg"></div>
                </div>
                <div className="bg-white p-6 h-56 flex flex-col justify-between rounded-b-lg relative">
                  <div>
                    <h4 className="text-xl font-bold text-red-600">
                     Festival estudiantil de las artes (FEA)
                    </h4>
                    <p className="text-gray-700 mt-2">
                    Cada año, celebramos el increíble talento de nuestros estudiantes en este evento. Disfruta de una semana repleta de arte, música, danza y muchas otras expresiones creativas.
¡Únete y sé testigo del talento artístico que florece en nuestros estudiantes!                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Card 4 */}
            <div className="p-4">
              <div className="event-card rounded-xl shadow-lg hover:shadow-2xl transition-transform duration-500 transform hover:scale-105 overflow-hidden">
                <div
                  style={{
                    backgroundImage: "url('/images/IMG_9317.JPG')",
                    height: "180px",
                  }}
                  className="bg-center bg-cover rounded-t-lg relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black opacity-50 rounded-t-lg"></div>
                </div>
                <div className="bg-white p-6 h-56 flex flex-col justify-between rounded-b-lg relative">
                  <div>
                    <h4 className="text-xl font-bold text-red-600">
                      Torneos deportivos regionales y nacionales
                    </h4>
                    <p className="text-gray-700 mt-2">
                    Cada año, los talentosos estudiantes del Liceo Santa Cruz participan con entusiasmo en diversas disciplinas deportivas como volleyball, baloncesto, fútbol 11 y futsala, entre otras. Estos torneos no solo destacan el espíritu competitivo de nuestros estudiantes, sino también su compañerismo y dedicación.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Card 5 */}
            <div className="p-4">
              <div className="event-card rounded-xl shadow-lg hover:shadow-2xl transition-transform duration-500 transform hover:scale-105 overflow-hidden">
                <div
                  style={{
                    backgroundImage: "url('/images/IMG_1767.JPG')",
                    height: "180px",
                  }}
                  className="bg-center bg-cover rounded-t-lg relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black opacity-50 rounded-t-lg"></div>
                </div>
                <div className="bg-white p-6 h-56 flex flex-col justify-between rounded-b-lg relative">
                  <div>
                    <h4 className="text-xl font-bold text-red-600">
                      Talleres y ferias
                    </h4>
                    <p className="text-gray-700 mt-2">
                    Cada año, nuestros estudiantes se sumergen en diversas actividades como talleres robótica, feria de emprendedurismo, olimpiadas de biología ferias científicas, entre otras. Estos eventos proporcionan oportunidades únicas para el aprendizaje y el desarrollo de habilidades, fomentando la creatividad y el espíritu innovador en nuestros jóvenes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Slider>
        </div>
      </section>
    </div>
  );
};
