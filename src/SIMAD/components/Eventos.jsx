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
            Eventos Anuales
          </h3>
          <Slider {...sliderSettings}>
            {/* Card 1 */}
            <div className="p-4">
              <div className="event-card rounded-xl shadow-lg hover:shadow-2xl transition-transform duration-500 transform hover:scale-105 overflow-hidden">
                <div
                  style={{
                    backgroundImage: "url('/images/Evento1.png')",
                    height: "180px", 
                  }}
                  className="bg-center bg-cover rounded-t-lg relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black opacity-50 rounded-t-lg"></div>
                </div>
                <div className="bg-white p-6 h-56 flex flex-col justify-between rounded-b-lg relative">
                  <div>
                    <h4 className="text-xl font-bold text-red-600">
                      Semana de la Guanacastequidad
                    </h4>
                    <p className="text-gray-700 mt-2">
                      Participa en nuestra semana de la guanacastequidad donde podrás disfrutar de comidas típicas y eventos culturales propios de nuestra provincia.
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
                    backgroundImage: "url('/images/Evento2.png')",
                    height: "180px",
                  }}
                  className="bg-center bg-cover rounded-t-lg relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black opacity-50 rounded-t-lg"></div>
                </div>
                <div className="bg-white p-6 h-56 flex flex-col justify-between rounded-b-lg relative">
                  <div>
                    <h4 className="text-xl font-bold text-red-600">
                      Campeonato Intercolegial
                    </h4>
                    <p className="text-gray-700 mt-2">
                      Únete a nosotros para apoyar a nuestros equipos en el campeonato intercolegial de deportes.
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
                    backgroundImage: "url('/images/Evento3.png')",
                    height: "180px",
                  }}
                  className="bg-center bg-cover rounded-t-lg relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black opacity-50 rounded-t-lg"></div>
                </div>
                <div className="bg-white p-6 h-56 flex flex-col justify-between rounded-b-lg relative">
                  <div>
                    <h4 className="text-xl font-bold text-red-600">
                      Feria del Libro
                    </h4>
                    <p className="text-gray-700 mt-2">
                      Descubre nuevos autores y géneros en nuestra feria del libro anual.
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
                    backgroundImage: "url('/images/Evento4.png')",
                    height: "180px",
                  }}
                  className="bg-center bg-cover rounded-t-lg relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black opacity-50 rounded-t-lg"></div>
                </div>
                <div className="bg-white p-6 h-56 flex flex-col justify-between rounded-b-lg relative">
                  <div>
                    <h4 className="text-xl font-bold text-red-600">
                      Festival de Música
                    </h4>
                    <p className="text-gray-700 mt-2">
                      Disfruta de una noche de música y talento local en nuestro festival anual.
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
                    backgroundImage: "url('/images/Evento5.png')",
                    height: "180px",
                  }}
                  className="bg-center bg-cover rounded-t-lg relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black opacity-50 rounded-t-lg"></div>
                </div>
                <div className="bg-white p-6 h-56 flex flex-col justify-between rounded-b-lg relative">
                  <div>
                    <h4 className="text-xl font-bold text-red-600">
                      Taller de Robótica
                    </h4>
                    <p className="text-gray-700 mt-2">
                      Aprende a construir y programar robots en nuestro taller especial para jóvenes.
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
