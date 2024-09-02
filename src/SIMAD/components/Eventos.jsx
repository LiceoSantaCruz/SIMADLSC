import Slider from "react-slick";

export const Eventos = () => {
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
    <div>
      <section className="py-16 bg-gray-100" data-aos="fade-up">
        {" "}
        {/* Fondo gris claro como antes */}
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-semibold mb-6 text-red-600">
            Eventos Próximos
          </h3>{" "}
          {/* Azul para el título */}
          
          <Slider {...sliderSettings}>
            <div className="p-6">
              <div
                className="bg-cover bg-center p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
                style={{
                  backgroundImage: "url('/images/Evento1.png')",
                  minHeight: "300px",
                }}
              >
                <div className="bg-white bg-opacity-80 p-6 rounded-lg">
                  {" "}
                  {/* Fondo blanco con opacidad */}
                  <h4 className="text-xl font-bold text-red-600">
                    Semana de la Ciencia
                  </h4>{" "}
                  {/* Rojo para el título */}
                  <p className="text-gray-600">
                    Fecha: 15 de septiembre de 2024
                  </p>
                  <p className="text-gray-700 mt-2">
                    Participa en nuestra semana de la ciencia donde los
                    estudiantes presentan proyectos innovadores y exploraciones
                    científicas.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div
                className="bg-cover bg-center p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
                style={{
                  backgroundImage: "url('/images/Evento2.png')",
                  minHeight: "300px",
                }}
              >
                <div className="bg-white bg-opacity-80 p-6 rounded-lg">
                  {" "}
                  {/* Fondo blanco con opacidad */}
                  <h4 className="text-xl font-bold text-red-600">
                    Campeonato Intercolegial
                  </h4>{" "}
                  {/* Rojo para el título */}
                  <p className="text-gray-600">
                    Fecha: 22 de septiembre de 2024
                  </p>
                  <p className="text-gray-700 mt-2">
                    Únete a nosotros para apoyar a nuestros equipos en el
                    campeonato intercolegial de deportes.
                  </p>
                </div>
              </div>
            </div>
            {/* Puedes añadir más eventos aquí con diferentes imágenes de fondo */}
          </Slider>
        </div>
      </section>
    </div>
  );
};
