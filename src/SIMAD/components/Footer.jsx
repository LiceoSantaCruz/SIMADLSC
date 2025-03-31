import { FaFacebook, FaInstagram } from 'react-icons/fa';
import getCloudinaryUrl from '../PaginaInformativa/utils/cloudinary';

export const Footer = () => {
  return (
    <footer className="bg-[#0A2A4A] text-white py-10">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Columna 1: Logo y descripción */}
        <div className="text-center md:text-left">
          <img
            src={getCloudinaryUrl("364228843_669464341867218_3303264254839208450_n_f2ehi6.jpg", "w_40,h_40,c_fill")}
            alt="Liceo Santa Cruz"
            style={{ width: "40px", height: "40px" }}
            className="w-8 h-8 rounded-full object-cover"
          />
          <p className="text-sm">
            Liceo Santa Cruz Clímaco A. Pérez. <br />
            Somos una huella de éxito en el tiempo, con el futuro en tus manos.
          </p>
        </div>

        {/* Columna 2: Contactos */}
        <div className="text-center md:text-left">
          <h2 className="text-lg font-semibold mb-2">Contactos</h2>
          <p className="text-sm">Teléfono: 2680-0219</p>
          <p className="text-sm">
            Correo electrónico:
            <a
              href="mailto:lic.santacruz@mep.go.cr"
              className="text-blue-400 hover:text-blue-600"
              aria-label="Enviar correo a lic.santacruz@mep.go.cr"
            >
              {" "}lic.santacruz@mep.go.cr
            </a>
          </p>
        </div>

        {/* Columna 3: Ubicación */}
        <div className="text-center md:text-left">
          <h2 className="text-lg font-semibold mb-2">Ubicación</h2>
          <p className="text-sm">
            Santa Cruz, Santa Cruz, Guanacaste del Hotel la Calle de Alcalá 100 mts este.
          </p>
        </div>

        {/* Columna 4: Redes Sociales */}
        <div className="text-center md:text-left">
          <h2 className="text-lg font-semibold mb-2">Redes Sociales</h2>
          <div className="flex justify-center md:justify-start space-x-4">
            <a
              href="https://www.facebook.com/share/mJmkXV7p48J7Zs89/"
              className="text-white hover:text-blue-400"
              aria-label="Visitar la página de Facebook del Liceo Santa Cruz"
            >
              <FaFacebook size="1.5em" />
            </a>
            <a
              href="https://www.instagram.com/liceosantacruz_oficial?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              className="text-white hover:text-blue-400"
              aria-label="Visitar el perfil de Instagram del Liceo Santa Cruz"
            >
              <FaInstagram size="1.5em" />
            </a>
          </div>
        </div>
      </div>

      {/* Línea separadora */}
      <div className="border-t border-gray-600 mt-6"></div>

      {/* Copyright */}
      <div className="text-center mt-4 text-sm">
        © 2024 Liceo Santa Cruz. Todos los derechos reservados
      </div>
    </footer>
  );
};

export default Footer;
