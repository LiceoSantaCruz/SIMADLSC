import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-primary text-black shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <div className="text-2xl font-bold">
          <Link to="/">Liceo Santa Cruz</Link>
        </div>

        {/* Links de navegación */}
        <div className="flex items-center space-x-4">
          <Link to="/about" className="hover:text-secondary">Sobre Nosotros</Link>
          <Link to="/services" className="hover:text-secondary">Servicios</Link>
          <Link to="/contact" className="hover:text-secondary">Contacto</Link>
        </div>

        {/* Botones de acción */}
        <div className="flex space-x-4">
          <Link to="/login">
            <button className="bg-gray-300 text-primary font-bold py-2 px-4 rounded hover:bg-red-500">
              Iniciar Sesión
            </button>
          </Link>
          <Link to="/register">
            <button className="bg-gray-300 text-black font-bold py-2 px-4 rounded hover:bg-red-500">
              Registrarse
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
