import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import getCloudinaryUrl from "../PaginaInformativa/utils/cloudinary";// Ajusta la ruta según tu estructura

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
      <section
        className="py-12 md:py-16 bg-gradient-to-b from-gray-100 to-blue-50"
        data-aos="fade-up"
      >
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-8 text-blue-900">
            Eventos anuales
          </h3>
          <Slider {...sliderSettings}>
            {/* Card 1 */}
            <div className="p-4">
              <div className="event-card rounded-xl shadow-lg hover:shadow-2xl transition-transform duration-500 transform hover:scale-105 overflow-hidden">
                <div
                  style={{
                    backgroundImage: `url(${getCloudinaryUrl("IMG_6505_qlxkrp.jpg", "w_800,c_scale")})`,
                  }}
                  className="bg-center bg-cover rounded-t-lg relative h-40 md:h-44 lg:h-48"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black opacity-50 rounded-t-lg"></div>
                </div>
                <div className="bg-white p-4 md:p-6 h-48 flex flex-col justify-between rounded-b-lg">
                  <div>
                    <h4 className="text-lg md:text-xl font-bold text-red-600">
                      Semana de la guanacastequidad
                    </h4>
                    <p className="text-gray-700 mt-2 text-sm md:text-base">
                      Únete a nosotros en esta tradicional semana para honrar la rica cultura y herencia de Guanacasteca. Disfruta de actividades llenas de historia, música y gastronomía que reflejan el espíritu único de nuestra región. ¡No te lo pierdas!
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Card 2 */}
            <div className="p-4">
              <div className="event-card rounded-xl shadow-lg hover:shadow-2xl transition-transform duration-500 transform hover:scale-105 overflow-hidden">
                <div
                  style={{
                    backgroundImage: `url(${getCloudinaryUrl("IMG_0675_s2joui.jpg", "w_800,c_scale")})`,
                  }}
                  className="bg-center bg-cover rounded-t-lg relative h-40 md:h-44 lg:h-48"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black opacity-50 rounded-t-lg"></div>
                </div>
                <div className="bg-white p-4 md:p-6 h-48 flex flex-col justify-between rounded-b-lg">
                  <div>
                    <h4 className="text-lg md:text-xl font-bold text-red-600">
                      Gran bingo millonario Liceo Santa Cruz
                    </h4>
                    <p className="text-gray-700 mt-2 text-sm md:text-base">
                      ¡No te pierdas el Gran bingo millonario anual del Liceo Santa Cruz! Únete a nosotros para una jornada de diversión y grandes premios. Este evento une a nuestra comunidad para apoyar a nuestros estudiantes. ¡No faltes!
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Card 3 */}
            <div className="p-4">
              <div className="event-card rounded-xl shadow-lg hover:shadow-2xl transition-transform duration-500 transform hover:scale-105 overflow-hidden">
                <div
                  style={{
                    backgroundImage: `url(${getCloudinaryUrl("IMG_8001_qmbaum.jpg", "w_800,c_scale")})`,
                  }}
                  className="bg-center bg-cover rounded-t-lg relative h-40 md:h-44 lg:h-48"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black opacity-50 rounded-t-lg"></div>
                </div>
                <div className="bg-white p-4 md:p-6 h-48 flex flex-col justify-between rounded-b-lg">
                  <div>
                    <h4 className="text-lg md:text-xl font-bold text-red-600">
                      Festival estudiantil de las artes (FEA)
                    </h4>
                    <p className="text-gray-700 mt-2 text-sm md:text-base">
                      Cada año, celebramos el increíble talento de nuestros estudiantes en este evento. Disfruta de una semana repleta de arte, música, danza y otras expresiones creativas. ¡Sé testigo del talento artístico que florece en ellos!
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Card 4 */}
            <div className="p-4">
              <div className="event-card rounded-xl shadow-lg hover:shadow-2xl transition-transform duration-500 transform hover:scale-105 overflow-hidden">
                <div
                  style={{
                    backgroundImage: `url(${getCloudinaryUrl("IMG_9317_bipf5k.jpg", "w_800,c_scale")})`,
                  }}
                  className="bg-center bg-cover rounded-t-lg relative h-40 md:h-44 lg:h-48"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black opacity-50 rounded-t-lg"></div>
                </div>
                <div className="bg-white p-4 md:p-6 h-48 flex flex-col justify-between rounded-b-lg">
                  <div>
                    <h4 className="text-lg md:text-xl font-bold text-red-600">
                      Torneos deportivos regionales y nacionales
                    </h4>
                    <p className="text-gray-700 mt-2 text-sm md:text-base">
                      Cada año, nuestros talentosos estudiantes participan en diversas disciplinas deportivas como volleyball, baloncesto, fútbol 11 y futsala. Estos torneos destacan tanto su espíritu competitivo como su compañerismo y dedicación.
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
                    backgroundImage: `url(${getCloudinaryUrl("IMG_1767_pdvxyc.jpg", "w_800,c_scale")})`,
                  }}
                  className="bg-center bg-cover rounded-t-lg relative h-40 md:h-44 lg:h-48"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black opacity-50 rounded-t-lg"></div>
                </div>
                <div className="bg-white p-4 md:p-6 h-48 flex flex-col justify-between rounded-b-lg">
                  <div>
                    <h4 className="text-lg md:text-xl font-bold text-red-600">
                      Talleres y ferias
                    </h4>
                    <p className="text-gray-700 mt-2 text-sm md:text-base">
                      Nuestros estudiantes participan en talleres de robótica, ferias de emprendedurismo, olimpiadas de biología y ferias científicas, entre otros. Estos eventos fomentan el aprendizaje, la creatividad y el espíritu innovador.
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
