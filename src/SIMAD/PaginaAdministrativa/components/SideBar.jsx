import {
    FaBars,
    FaCalendarAlt,
    FaClipboardList,
    FaUsers,
    FaUserGraduate,
    FaBookOpen,
    FaChalkboardTeacher,
    FaUserCircle,
    FaChevronDown,
    FaListOl,
    FaThLarge,
    FaDoorOpen,
    FaMoon,
    FaSun,
    FaSchool
} from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import getCloudinaryUrl from '../../PaginaInformativa/utils/cloudinary';

export const SideBar = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [openSection, setOpenSection] = useState('');
    const [darkMode, setDarkMode] = useState(true);
    const navigate = useNavigate();
    const role = localStorage.getItem('role');

    const toggleSidebar = () => setIsOpen(!isOpen);


    const [showProfileOptions, setShowProfileOptions] = useState(false);

    const toggleSection = (section) => {
        setOpenSection((prev) => (prev === section ? '' : section));
    };


    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/paginainformativa');
    };


    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            setDarkMode(true);
            document.documentElement.classList.add('dark');
        } else {
            setDarkMode(false);
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = !darkMode;
        setDarkMode(newTheme);
        localStorage.setItem('theme', newTheme ? 'dark' : 'light');

        if (newTheme) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    return (
        <div
        className={`h-screen ${isOpen ? 'w-64' : 'w-20'} transition-all duration-300 transition-background ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} flex flex-col shadow-lg`}
      >
      <div className="border-b border-gray-700 px-4 py-4 flex items-center gap-3">
  <Link to="/" className="flex items-center gap-3">
  <img
            src={getCloudinaryUrl("364228843_669464341867218_3303264254839208450_n_f2ehi6.jpg", "w_40,h_40,c_fill")}
            alt="Liceo Santa Cruz"
            style={{ width: "40px", height: "40px" }}
            className="w-8 h-8 rounded-full object-cover"
          />
    {isOpen && (
      <span className="text-lg font-semibold text-blue-400">SIMADLSC</span>
    )}
  </Link>
  
  <button
    className="ml-auto text-white hover:text-blue-400"
    onClick={toggleSidebar}
    aria-label="Abrir o cerrar menú"
  >
    <FaBars />
  </button>
</div>

      
        {/* Contenido del sidebar */}
        <nav className="flex-1 px-2 space-y-1">
  {/* Asistencia */}
  {role === 'estudiante' ? (
    <div>
      <Link
        to="/mi-asistencia"
        className="flex items-center px-2 py-2 rounded-md hover:bg-blue-500/10 transition"
      >
        <FaUserGraduate className="text-blue-400" />
        {isOpen && <span className="ml-3">Mis asistencias</span>}
      </Link>
    </div>
  ) : (
    <>
      {/* Admin & Superadmin: todas las opciones */}
      {(role === 'admin' || role === 'superadmin') && (
        <div>
          <button
            onClick={() => toggleSection('asistencia')}
            className="flex items-center w-full px-2 py-2 rounded-md hover:bg-blue-500/10 transition group"
          >
            <FaUserGraduate className="text-blue-400" />
            {isOpen && <span className="ml-3">Asistencia</span>}
            {isOpen && (
              <FaChevronDown
                className={`ml-auto transform transition-transform ${
                  openSection === 'asistencia' ? 'rotate-180' : ''
                }`}
                size={12}
              />
            )}
          </button>
          {isOpen && openSection === 'asistencia' && (
            <div className="ml-8 text-sm text-black dark:text-white space-y-1">
              <Link to="/gestion-asistencia" className="block hover:text-blue-400">
                Gestión asistencia
              </Link>
              <Link to="/justificacion-ausencias" className="block hover:text-blue-400">
                Justificación ausencias
              </Link>
              <Link to="/reporte-asistencia" className="block hover:text-blue-400">
                Reporte asistencia
              </Link>
              <Link
                to="/reporte-asistencia-seccion"
                className="block hover:text-blue-400"
              >
                Reporte asistencia sección
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Profesor: solo 3 rutas */}
      {role === 'profesor' && (
        <div>
          <button
            onClick={() => toggleSection('asistencia')}
            className="flex items-center w-full px-2 py-2 rounded-md hover:bg-blue-500/10 transition group"
          >
            <FaUserGraduate className="text-blue-400" />
            {isOpen && <span className="ml-3">Asistencia</span>}
            {isOpen && (
              <FaChevronDown
                className={`ml-auto transform transition-transform ${
                  openSection === 'asistencia' ? 'rotate-180' : ''
                }`}
                size={12}
              />
            )}
          </button>
       {isOpen && openSection === 'asistencia' && (
  <div className="ml-8 text-sm text-black dark:text-white space-y-1">
    <Link
      to="/asistencia-estudiantes"
      className="block hover:text-blue-400"
    >
      Asistencia estudiantes
    </Link>

    {/* Nuevo enlace debajo */}
    <Link
      to="/GestionAsistenciaFiltrada"
      className="block hover:text-blue-400"
    >
      Gestión asistencias
    </Link>

    <Link
      to="/reporte-asistencia"
      className="block hover:text-blue-400"
    >
      Reporte asistencia
    </Link>
    <Link
      to="/reporte-asistencia-seccion"
      className="block hover:text-blue-400"
    >
      Reporte asistencia sección
    </Link>
  </div>
)}
        </div>
      )}
      {/* Resto de secciones */}
    
            {/* Resto de secciones (Eventos, Horarios, Matrícula, etc.) se mantienen */}
            {/* ... */}
          </>
        )}
      
          {/* Eventos */}
          <div>
            <button
              onClick={() => toggleSection('eventos')}
              className="flex items-center w-full px-2 py-2 rounded-md hover:bg-pink-500/10 transition group"
            >
              <FaCalendarAlt className="text-pink-400" />
              {isOpen && <span className="ml-3">Eventos</span>}
              {isOpen && (
                <FaChevronDown
                  className={`ml-auto transform transition-transform ${openSection === 'eventos' ? 'rotate-180' : ''}`}
                  size={12}
                />
              )}
            </button>
            {isOpen && openSection === 'eventos' && (
              <div className="ml-8 text-sm text-black dark:text-white space-y-1">
                <Link to="/eventos" className="block hover:text-pink-400">Eventos</Link>
                {(role === 'admin' || role === 'superadmin' || role === 'profesor') && (
                  <>
                    <Link to="/crear-eventos" className="block hover:text-pink-400">Crear eventos</Link>
                    <Link to="/user-eventos" className="block hover:text-pink-400">Solicitudes de eventos</Link>
                  </>
                )}
                {role === 'superadmin' && (
                  <Link to="/gestion-eventos" className="block hover:text-pink-400">Gestión eventos</Link>
                )}
              </div>
            )}
          </div>
      
          {/* Horarios */}
          {(role === 'admin' || role === 'superadmin' || role === 'profesor' || role === 'estudiante') && (
            <div>
              <button
                onClick={() => toggleSection('horarios')}
                className="flex items-center w-full px-2 py-2 rounded-md hover:bg-green-500/10 transition group"
              >
                <FaChalkboardTeacher className="text-green-400" />
                {isOpen && <span className="ml-3">Horarios</span>}
                {isOpen && (
                  <FaChevronDown
                    className={`ml-auto transform transition-transform ${openSection === 'horarios' ? 'rotate-180' : ''}`}
                    size={12}
                  />
                )}
              </button>
              {isOpen && openSection === 'horarios' && (
                <div className="ml-8 text-sm text-black dark:text-white space-y-1">
                  {(role === 'admin' || role === 'superadmin' || role === 'profesor') && (
                    <Link to="/horario-profesores" className="block hover:text-green-400">Horario de profesores</Link>
                  )}
                  {(role === 'admin' || role === 'superadmin' || role === 'estudiante') && (
                    <Link to="/horario-estudiantes" className="block hover:text-green-400">Horario de estudiantes</Link>
                  )}
                  { (role === 'superadmin') && (
                    <Link to="/gestion-horario" className="block hover:text-green-400">Gestión horario</Link>
                  )}
                </div>
              )}
            </div>
          )}
      
          {/* Matrícula */}
          {(role === 'admin' || role === 'superadmin' || role === 'estudiante') && (
            <div>
              <button
                onClick={() => toggleSection('matricula')}
                className="flex items-center w-full px-2 py-2 rounded-md hover:bg-purple-500/10 transition group"
              >
                <FaClipboardList className="text-purple-400" />
                {isOpen && <span className="ml-3">Matrícula</span>}
                {isOpen && (
                  <FaChevronDown
                    className={`ml-auto transform transition-transform ${openSection === 'matricula' ? 'rotate-180' : ''}`}
                    size={12}
                  />
                )}
              </button>
              {isOpen && openSection === 'matricula' && (
                <div className="ml-8 text-sm text-black dark:text-white space-y-1">
                  <Link to="/formulario-matricula" className="block hover:text-purple-400">Formulario</Link>
                  {(role === 'admin' || role === 'superadmin') && (
                    <>
                      <Link to="/matricula-ordinaria-extraordinaria" className="block hover:text-purple-400">Matricula ordinaria - extraordinaria</Link>
                      <Link to="/asignar-seccion" className="block hover:text-purple-400">Asignar sección</Link>
                      <Link to="/gestion-matricula" className="block hover:text-purple-400">Gestión matricula</Link>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
      
          {/* Usuarios */}
          {role === 'superadmin' && (
            <div>
              <button
                onClick={() => toggleSection('usuarios')}
                className="flex items-center w-full px-2 py-2 rounded-md hover:bg-red-500/10 transition group"
              >
                <FaUsers className="text-red-400" />
                {isOpen && <span className="ml-3">Usuarios</span>}
                {isOpen && (
                  <FaChevronDown
                    className={`ml-auto transform transition-transform ${openSection === 'usuarios' ? 'rotate-180' : ''}`}
                    size={12}
                  />
                )}
              </button>
              {isOpen && openSection === 'usuarios' && (
                <div className="ml-8 text-sm text-black dark:text-white space-y-1">
                  <Link to="/gestion-usuarios" className="block hover:text-red-400">Gestión usuarios</Link>
                </div>
              )}
            </div>
          )}
      
          {/* Gestión Académica */}
          {(role === 'admin' || role === 'profesor' || role === 'superadmin') && (
    <div>
        <button
            onClick={() => toggleSection('gestionAcademica')}
            className="flex items-center w-full px-2 py-2 rounded-md hover:bg-cyan-500/10 transition group"
            aria-label="Abrir menú de gestión académica"
            aria-expanded={openSection === 'gestionAcademica'}
            aria-controls="submenu-gestionAcademica"
        >
            <FaSchool className="text-cyan-400" aria-hidden="true" />
            {isOpen && <span className="ml-3" id="gestionAcademica-label">Gestión académica</span>}
            {isOpen && (
                <FaChevronDown
                    className={`ml-auto transform transition-transform ${openSection === 'gestionAcademica' ? 'rotate-180' : ''}`}
                    size={12}
                />
            )}
        </button>
        {isOpen && openSection === 'gestionAcademica' && (
          <div
          id="submenu-gestionAcademica"
          role="region"
          aria-labelledby="gestionAcademica-label"
          className="ml-8 text-sm text-black dark:text-white space-y-1"
        >
          {/* Superadmin: todo */}
          {role === 'superadmin' && (
            <>
              <Link
                to="/Gestion-grados"
                className="flex items-center gap-2 hover:text-cyan-400 transition"
              >
                <FaListOl className="text-cyan-400" /> Grados
              </Link>
              <Link
                to="/secciones"
                className="flex items-center gap-2 hover:text-cyan-400 transition"
              >
                <FaThLarge className="text-cyan-400" /> Secciones
              </Link>
              <Link
                to="/Gestion-aulas"
                className="flex items-center gap-2 hover:text-cyan-400 transition"
              >
                <FaDoorOpen className="text-cyan-400" /> Aulas
              </Link>
              <Link
                to="/Gestion-materias"
                className="flex items-center gap-2 hover:text-cyan-400 transition"
              >
                <FaBookOpen className="text-cyan-400" /> Materias
              </Link>
              <Link
                to="/busqueda-estudiantes"
                className="flex items-center gap-2 hover:text-cyan-400 transition"
              >
                <FaUserGraduate className="text-cyan-400" /> Estudiantes
              </Link>
            </>
          )}
        
          {/* Admin: sólo Secciones y Búsqueda de Estudiantes */}
          {role === 'admin' && (
            <>
              <Link
                to="/secciones"
                className="flex items-center gap-2 hover:text-cyan-400 transition"
              >
                <FaThLarge className="text-cyan-400" /> Secciones
              </Link>
              <Link
                to="/busqueda-estudiantes"
                className="flex items-center gap-2 hover:text-cyan-400 transition"
              >
                <FaUserGraduate className="text-cyan-400" /> Estudiantes
              </Link>
            </>
          )}
        
          {/* Profesor: sólo Búsqueda de Estudiantes */}
          {role === 'profesor' && (
            <Link
              to="/busqueda-estudiantes"
              className="flex items-center gap-2 hover:text-cyan-400 transition"
            >
              <FaUserGraduate className="text-cyan-400" /> Estudiantes
            </Link>
          )}
        </div>
        )}
    </div>
)}
        </nav>
      
        {/* Footer */}
        <div className="border-t border-gray-700 px-4 py-4 space-y-4">
          <div className="flex items-center justify-between">
            {isOpen && (
              <span className="text-sm flex items-center gap-1">
                {darkMode ? <FaMoon className="text-yellow-400" /> : <FaSun className="text-yellow-300" />} Modo {darkMode ? 'Oscuro' : 'Claro'}
              </span>
            )}
      
            <div
              onClick={toggleTheme}
              className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition duration-300 ${darkMode ? 'bg-gray-600 justify-start' : 'bg-yellow-400 justify-end'}`}
            >
              <div className="bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300" />
            </div>
          </div>
      
          <div className="relative">
            <button
              onClick={() => setShowProfileOptions(!showProfileOptions)}
              className="flex items-center gap-2 text-sm hover:text-blue-400 transition w-full"
            >
              <FaUserCircle className="text-black dark:text-white" size={18} />
              {isOpen && <span>Mi perfil</span>}
            </button>
      
            {showProfileOptions && isOpen && (
             <div className="absolute bottom-12 left-0 w-full flex flex-col bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-md z-50">
             <Link
               to="/mi-perfil"
               className="px-4 py-2 text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition"
               onClick={() => setShowProfileOptions(false)}
             >
               Ver perfil
             </Link>
             <button
               onClick={() => {
                 handleLogout();
                 setShowProfileOptions(false);
               }}
               className="px-4 py-2 text-sm text-left text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
             >
               Cerrar sesión
             </button>
           </div>
           
            )}
          </div>
        </div>
      </div>
    );
};

