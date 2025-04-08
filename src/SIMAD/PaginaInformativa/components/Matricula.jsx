import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import getCloudinaryUrl from "../utils/cloudinary";
import Swal from "sweetalert2";
import "@sweetalert2/theme-bulma/bulma.css";

// Genera URLs optimizadas para distintos anchos usando Cloudinary
const bg_768 = getCloudinaryUrl("IMG_2947_khx3v1.jpg", "w_768,c_scale");
const bg_1024 = getCloudinaryUrl("IMG_2947_khx3v1.jpg", "w_1024,c_scale");
const bg_1920 = getCloudinaryUrl("IMG_2947_khx3v1.jpg", "w_1920,c_scale");

export const Matricula = () => {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  // Función para mostrar el modal de Términos y Condiciones
  const handleIniciarMatricula = () => {
    Swal.fire({
      title: "Términos y Condiciones",
      html: `
        <div class="p-4 text-left">
          <p class="mb-4 font-semibold text-lg text-gray-800">
            Bienvenido al proceso de matrícula en línea
          </p>
          <p class="mb-4 text-sm text-gray-700">
            Las matrículas en línea solo pueden ser realizadas por estudiantes que ya tengan una cuenta en el sistema, ya que el proceso es exclusivo para los niveles de octavo a undécimo.
          </p>
          <p class="mb-4 text-sm text-gray-700">
            Por favor, lee cuidadosamente los siguientes términos y condiciones antes de continuar. Al aceptar, confirmas que has leído y estás de acuerdo con ellos.
          </p>
          <p class="mb-4 text-sm text-gray-700">
            Para completar el proceso de matrícula, deberás subir los siguientes documentos:
          </p>
          <ul class="list-disc list-inside mb-4 text-sm text-gray-700">
            <li>Copia de las notas.</li>
            <li>Copia de la cédula del padre, madre o encargado legal.</li>
            <li>Copia de la cédula del estudiante.</li>
          </ul>
          <p class="mb-4 text-sm text-gray-700">
            Los documentos deben ser subidos en formato PDF y ser lo suficientemente claros y legibles. Recuerda que este formulario se llena en una única ocasión.
          </p>
          <div class="flex items-center mt-4">
            <input type="checkbox" id="termsCheckbox" class="mr-2" />
            <label for="termsCheckbox" class="text-sm text-gray-700">
              Acepto los Términos y Condiciones.
            </label>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#2563EB",
      preConfirm: () => {
        const isChecked = document.getElementById("termsCheckbox")?.checked;
        if (!isChecked) {
          Swal.showValidationMessage("Debes aceptar los Términos y Condiciones");
        }
        return isChecked;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/paginainformativa/login");
      }
    });
  };

  return (
    <section className="relative py-12 md:py-16 text-gray-800" data-aos="fade-up">
      {/* Imagen de fondo responsiva con lazy loading */}
      <img
        src={bg_1024}
        srcSet={`${bg_768} 768w, ${bg_1024} 1024w, ${bg_1920} 1920w`}
        sizes="(max-width: 768px) 768px, (max-width: 1024px) 1024px, 1920px"
        alt="Fondo de matrícula"
        className="absolute inset-0 w-full h-full object-cover object-center"
        loading="lazy"
      />

      {/* Overlay opcional para suavizar el fondo */}
      <div className="absolute inset-0 bg-black opacity-20"></div>

      {/* Contenedor de contenido */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 md:px-12 lg:px-24">
          <div
            className="bg-white bg-opacity-95 rounded-xl shadow-xl flex flex-col md:flex-row items-center overflow-hidden"
            data-aos="fade-up"
          >
            {/* Columna Izquierda: Información de Matrícula */}
            <div
              className="w-full md:w-1/2 p-4 md:p-8"
              data-aos="fade-right"
              data-aos-delay="200"
            >
              <h2
                id="matricula-title"
                className="text-2xl md:text-3xl font-bold text-blue-900 mb-4"
              >
                ¿Por qué matricular con nosotros?
              </h2>
              <p className="text-gray-700 mb-4 leading-relaxed text-sm md:text-base">
                En el Liceo Santa Cruz, nos comprometemos a ofrecer una educación de excelencia que prepara a nuestros estudiantes para enfrentar los desafíos del futuro. Nuestros programas académicos están diseñados para desarrollar habilidades críticas y fomentar el crecimiento personal en un entorno seguro y de apoyo.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed text-sm md:text-base">
                Ofrecemos una amplia variedad de actividades extracurriculares, acceso a tecnología de vanguardia, y un enfoque en el desarrollo de valores cívicos y sociales. Nuestro personal docente, altamente calificado, está dedicado a guiar a cada estudiante en su camino hacia el éxito.
              </p>
              <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                ¡Únete a nuestra comunidad y descubre por qué el Liceo Santa Cruz es la mejor opción para tu educación secundaria!
              </p>
            </div>

            {/* Columna Derecha: Botón de Matrícula y Mensaje Aclaratorio */}
            <div
              className="w-full md:w-1/2 p-4 md:p-8 bg-blue-50 rounded-t-xl md:rounded-r-xl md:rounded-t-none flex flex-col items-center justify-center"
              data-aos="fade-left"
              data-aos-delay="400"
            >
              <p className="text-blue-900 text-center text-xs sm:text-sm font-medium mb-4 px-4 py-2 bg-blue-100 rounded-md shadow-sm">
                Nota: El periodo de matrícula será válido únicamente cuando se publique oficialmente en nuestras redes sociales.
              </p>
              <button
                onClick={handleIniciarMatricula}
                className="bg-blue-900 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-full hover:bg-blue-700 transition duration-300 shadow-lg"
                aria-label="Iniciar proceso de matrícula"
              >
                Iniciar matrícula
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Matricula;
