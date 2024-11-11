import { Link } from 'react-router-dom';
import { FaSignInAlt } from 'react-icons/fa'; 

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-blue-700 to-blue-900 text-white shadow-lg">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        
        {/* Logo */}
        <div className="text-2xl font-bold">
          <Link to="images/logoliceo.png" className="hover:text-yellow-400 transition duration-300">
            Liceo Santa Cruz
          </Link>
        </div>

        {/* Botón de inicio de sesión, alineado a la derecha */}
        <div className="ml-auto">
          <Link to="/paginainformativa/login">
            <button className="flex items-center bg-yellow-500 text-black font-bold py-2 px-4 rounded-full hover:bg-yellow-400 transition duration-300">
              <FaSignInAlt className="mr-2" /> Iniciar Sesión
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
