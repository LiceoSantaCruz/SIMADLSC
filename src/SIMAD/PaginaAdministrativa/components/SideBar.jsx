import { Link, useNavigate } from 'react-router-dom';
import { 
    FaChalkboardTeacher, 
    FaUserGraduate, 
    FaCalendarAlt, 
    FaClipboardList, 
    FaUsers, 
    FaUserCircle, 
    FaSignOutAlt, 
    FaBars, 
    FaSearch,
    FaListAlt
} from 'react-icons/fa';
import { useState, useEffect } from 'react';

export const SideBar = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
    const [role, setRole] = useState(localStorage.getItem('role'));
    const [openSections, setOpenSections] = useState({
        asistencia: false,
        eventos: false,
        horarios: false,
        matricula: false,
        usuarios: false,
    });

    const navigate = useNavigate();

    const toggleSection = (section) => {
        setOpenSections(prevState => ({
            ...prevState,
            [section]: !prevState[section]
        }));
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setIsAuthenticated(false);
        window.location.href = '/paginainformativa';
    };

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/paginainformativa');
        }
    }, [isAuthenticated, navigate]);

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    return (
        <>
            {/* Botón de menú hamburguesa visible en móviles */}
            <button
                onClick={toggleSidebar}
                className="lg:hidden p-3 text-gray-800 bg-white shadow-md rounded-full fixed top-4 left-4 z-50"
            >
                <FaBars size={24} />
            </button>

            {/* Sidebar con fondo gradiente y estilos modernos */}
            <div className={`fixed lg:relative top-0 left-0 w-64 h-full bg-gray-800 text-white p-4 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 min-h-screen flex flex-col overflow-y-auto`}>
            {/* Título del Sidebar */}
                <Link to="/info" className="text-2xl font-bold mb-6 text-blue-500 hover:text-blue-700">
                    SIMADLSC
                </Link>

                <nav className="flex flex-col space-y-2">
                    {/* Asistencia: Solo para admin, superadmin y profesor */}
                    {(role === 'admin' || role === 'superadmin' || role === 'profesor') && (
                        <div>
                            <div onClick={() => toggleSection('asistencia')} className="cursor-pointer flex items-center space-x-2 py-2 hover:bg-gray-200 rounded-md px-2 transition">
                                <FaUserGraduate className="text-blue-400" />
                                <span>Asistencia</span>
                            </div>
                            {openSections.asistencia && (
                                <div className="ml-6 text-white">
                                    <Link to="/asistencia-estudiantes" className="block py-1 text-sm hover:text-blue-500">Asistencia estudiantes</Link>
                                    <Link to="/gestion-asistencia" className="block py-1 text-sm hover:text-blue-500">Gestión asistencia</Link>
                                    <Link to="/justificacion-ausencias" className="block py-1 text-sm hover:text-blue-500">Justificación ausencias</Link>
                                    <Link to="/reporte-asistencia" className="block py-1 text-sm hover:text-blue-500">Reporte asistencia</Link>
                                    <Link to="/reporte-asistencia-seccion" className="block py-1 text-sm hover:text-blue-500">Reporte asistencia sección</Link>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Eventos: Visible para todos los roles */}
                    <div>
                        <div onClick={() => toggleSection('eventos')} className="cursor-pointer flex items-center space-x-2 py-2 hover:bg-gray-200 rounded-md px-2 transition">
                            <FaCalendarAlt className="text-pink-400" />
                            <span>Eventos</span>
                        </div>
                        {openSections.eventos && (
                            <div className="ml-6 text-white">
                                <Link to="/eventos" className="block py-1 text-sm hover:text-pink-500">Eventos</Link>
                                {(role === 'admin' || role === 'superadmin' || role === 'profesor') && (
                                    <>
                                        <Link to="/crear-eventos" className="block py-1 text-sm hover:text-pink-500">Crear eventos</Link>
                                        <Link to="/user-eventos" className="block py-1 text-sm hover:text-pink-500">Estado solicitudes eventos</Link>
                                    </>
                                )}
                                {role === 'superadmin' && (
                                    <Link to="/gestion-eventos" className="block py-1 text-sm hover:text-pink-500">Gestión eventos</Link>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Horarios: Para admin, superadmin, profesor y estudiante */}
                    {(role === 'admin' || role === 'superadmin' || role === 'profesor' || role === 'estudiante') && (
                        <div>
                            <div onClick={() => toggleSection('horarios')} className="cursor-pointer flex items-center space-x-2 py-2 hover:bg-gray-200 rounded-md px-2 transition">
                                <FaChalkboardTeacher className="text-green-400" />
                                <span>Horarios</span>
                            </div>
                            {openSections.horarios && (
                                <div className="ml-6 text-white">
                                    {(role === 'profesor' || role === 'admin' || role === 'superadmin') && (
                                        <Link to="/horario-profesores" className="block py-1 text-sm hover:text-green-500">Horario profesores</Link>
                                    )}
                                    {(role === 'estudiante' || role === 'admin' || role === 'superadmin') && (
                                        <Link to="/horario-estudiantes" className="block py-1 text-sm hover:text-green-500">Horario estudiantes</Link>
                                    )}
                                    {(role === 'admin' || role === 'superadmin') && (
                                        <Link to="/gestion-horario" className="block py-1 text-sm hover:text-green-500">Gestión horario</Link>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Matrícula: Para admin, superadmin y estudiante */}
                    {(role === 'admin' || role === 'superadmin' || role === 'estudiante') && (
                        <div>
                            <div onClick={() => toggleSection('matricula')} className="cursor-pointer flex items-center space-x-2 py-2 hover:bg-gray-200 rounded-md px-2 transition">
                                <FaClipboardList className="text-purple-400" />
                                <span>Matrícula</span>


                            </div>
                            {openSections.matricula && (
                                <div className="ml-6 text-white">
                                    <Link to="/formulario-matricula" className="block py-1 text-sm hover:text-purple-500">Formulario matrícula</Link>
                                    {(role === 'admin' || role === 'superadmin') && (
                                        <>
                                            <Link to="/gestion-matricula" className="block py-1 text-sm hover:text-purple-500">Gestión matrícula</Link>
                                            <Link to="/matricula-ordinaria" className="block py-1 text-sm hover:text-purple-500">Matrícula ordinaria</Link>
                                            <Link to="/matricula-extraordinaria" className="block py-1 text-sm hover:text-purple-500">Matrícula extraordinaria</Link>
                                            <Link to="/asignar-seccion" className="block py-1 text-sm hover:text-purple-500">Asignar sección</Link>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Secciones: Para admin, superadmin y profesor */}
                    {(role === 'admin' || role === 'superadmin' || role === 'profesor') && (
                        <Link 
                            to="/secciones" 
                            className="cursor-pointer flex items-center space-x-2 py-2 hover:bg-gray-200 rounded-md px-2 transition"
                        >
                            <FaListAlt className="text-orange-400" />
                            <span>Secciones</span>
                        </Link>
                    )}

                    {/* Búsqueda de Estudiantes: Para admin, superadmin y profesor */}
                    {(role === 'admin' || role === 'superadmin' || role === 'profesor') && (
                        <Link to="/busqueda-estudiantes" className="cursor-pointer flex items-center space-x-2 py-2 hover:bg-gray-200 rounded-md px-2 transition">
                            <FaSearch className="text-yellow-500" />
                            <span>Búsqueda estudiantes</span>
                        </Link>
                    )}

                    {/* Usuarios: Solo para superadmin */}
                    {role === 'superadmin' && (
                        <div>
                            <div onClick={() => toggleSection('usuarios')} className="cursor-pointer flex items-center space-x-2 py-2 hover:bg-gray-200 rounded-md px-2 transition">
                                <FaUsers className="text-red-400" />
                                <span>Usuarios</span>
                            </div>
                            {openSections.usuarios && (
                                <div className="ml-6 text-white">
                                    <Link to="/gestion-usuarios" className="block py-1 text-sm hover:text-red-500">Gestión usuarios</Link>
                                </div>
                            )}
                        </div>
                    )}
                </nav>

                {/* Perfil y Logout */}
                <div className="border-t border-gray-300 pt-4 mt-auto">
                    <div className="flex items-center space-x-2 px-2">
                        <FaUserCircle className="text-gray-500" size={20} />
                        <span className="text-lg">Perfil</span>
                    </div>
                    <div className="ml-6 text-white">
                        <Link to="/mi-perfil" className="py-1 block text-sm hover:text-gray-500 flex items-center space-x-1">
                            <FaUserCircle size={14} />
                            <span>Ver mi perfil</span>
                        </Link>
                        <button onClick={handleLogout} className="py-1 w-full text-left text-sm hover:text-red-500 flex items-center space-x-1">
                            <FaSignOutAlt size={14} />
                            <span>Cerrar sesión</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};
