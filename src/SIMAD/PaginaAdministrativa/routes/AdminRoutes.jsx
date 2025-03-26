import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { InfoAdminPage } from '../pages/InfoAdminPage';
import { InfoProfesorPage } from '../pages/InfoProfesorPage';
import { InfoEstudiantePage } from '../pages/InfoEstudiantePage';
import { AsistenciaEst } from '../pages/Asistencias/AsistenciaEst';
import { GestionAsistencia } from '../pages/Asistencias/GestionAsistencia';
import { JustificacionAusencias } from '../pages/Asistencias/JustificacionAusencias';
import { ReporteAsistencia } from '../pages/Asistencias/ReporteAsistencia';
import GestionEventos from '../pages/Eventos/GestionEventos';
import { GestionHorario } from '../pages/Horarios/GestionHorario';
import { HorarioEstu } from '../pages/Horarios/Vistas/HorarioEstu';
import { HorarioProf } from '../pages/Horarios/Vistas/HorarioProf';
import { FormularioMatricula } from '../pages/Matricula/components/FormularioMatricula';
import { MatriculaExtraordinaria } from '../pages/Matricula/pages/MatriculaExtraordinaria';
import GestionUsuarios from '../pages/Usuarios/GestionUsuarios';
import CrearUsuario from '../pages/Usuarios/CrearUsuario';
import { MiPerfil } from '../pages/Perfil/MiPerfil';
import CrearEventos from '../pages/Eventos/CrearEventos';
import Eventos from '../pages/Eventos/Eventos';
import ListaEstudiantes from '../pages/Modulos academicos/Secciones/pages/ListaEstudiantes';
import Secciones from '../pages/Modulos academicos/Secciones/pages/Secciones';
import DetalleEstudiante from '../pages/Modulos academicos/Estudiantes/pages/DetalleEstudiante';
import UserEventos from '../pages/Eventos/UserEventos';
import BusquedaEstudiantes from '../../PaginaAdministrativa/pages/Modulos academicos/Estudiantes/pages/BusquedaEstudiantes';
import EventosEdit from '../pages/Eventos/EventosEdit';
import GestionMatriculas from '../pages/Matricula/pages/GestionMatricula';
import CrearSeccion from '../pages/Modulos academicos/Secciones/pages/CrearSeccion';
import GestionGrados from '../pages/Modulos academicos/Grados/pages/GestionGrados';
import GestionAulas from '../pages/Modulos academicos/Aulas/pages/GestionAulas';
import GestionMaterias from '../pages/Modulos academicos/Materias/pages/GestionMaterias';
import AsignaSeccionPage from '../pages/Matricula/pages/AsignaSeccionPage';
import ReporteAsistenciaSeccion from '../pages/Asistencias/ReporteAsistenciaSeccion';
import { MatriculaOrdinaria } from '../pages/Matricula/pages/MatriculaOrdinaria';
 
export const AdminRoutes = () => {
  const [role, setRole] = useState(localStorage.getItem('role'));

  useEffect(() => {
    const handleStorageChange = () => {
      setRole(localStorage.getItem('role'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
<div className="flex-grow w-full p-4 md:p-6 min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100 overflow-y-auto overflow-x-hidden transition-colors duration-300">
<Routes>

        <Route path="/" element={<Navigate to="/paginainformativa" replace />} />
         {/* Rutas de inicio personalizadas según el rol */}
         {role === 'admin' || role === 'superadmin' ? (
          <Route path="/info" element={<InfoAdminPage />} />
        ) : role === 'profesor' ? (
          <Route path="/info" element={<InfoProfesorPage />} />
        ) : (
          <Route path="/info" element={<InfoEstudiantePage />} />
        )}

        {/* Rutas para asistencia, según rol */}
        {(role === 'admin' || role === 'superadmin' || role === 'profesor') && (
          <>
            <Route path="/asistencia-estudiantes" element={<AsistenciaEst />} />
            <Route path="/gestion-asistencia" element={<GestionAsistencia />} />
            <Route path="/justificacion-ausencias" element={<JustificacionAusencias />} />
            <Route path="/reporte-asistencia" element={<ReporteAsistencia />} />
            <Route path="/reporte-asistencia-seccion" element={<ReporteAsistenciaSeccion />} />
          </>
        )}

        <Route path="/eventos" element={<Eventos />} />
        <Route path="/crear-eventos" element={<CrearEventos />} />
        <Route path="/gestion-eventos" element={<GestionEventos />} />
        <Route path="/user-eventos" element={<UserEventos />} />
        <Route path="/eventos-edit/:id" element={<EventosEdit />} />

          {/* Rutas para horarios, según el rol */}
          {(role === 'admin' || role === 'superadmin') && (
            <>
              <Route path="/gestion-horario" element={<GestionHorario />} />
              <Route path="/horario-estudiantes" element={<HorarioEstu />} />
              <Route path="/horario-profesores" element={<HorarioProf />} />
            </>
          )}
          {role === 'profesor' && (
            <Route path="/horario-profesores" element={<HorarioProf />} />
          )}
          {role === 'estudiante' && (
            <Route path="/horario-estudiantes" element={<HorarioEstu />} />
          )}

           {/* Rutas para Busqueda de estudiantes, según el rol */}
          {(role === 'admin' || role === 'superadmin' || role === 'profesor') && (
            <>
              <Route path="/busqueda-estudiantes" element={<BusquedaEstudiantes />} />
              <Route path="/detalle-estudiante/:id" element={<DetalleEstudiante />} />
            </>
          )}
          

            {/* Rutas para Busqueda de estudiantes, según el rol */}
            {(role === 'admin' || role === 'superadmin' ) && (
            <>
              <Route path="/Secciones" element={<Secciones />} />
              <Route path="/lista-estudiantes/:seccionId" element={<ListaEstudiantes />} />
              <Route path="/crear-seccion" element={<CrearSeccion />} />

            </>
          )}
          
          
        {/* Rutas para matrícula, según el rol */}
        {(role === 'admin' || role === 'superadmin') && (
          <>
            <Route path="/formulario-matricula" element={<FormularioMatricula />} />
            <Route path="/gestion-matricula" element={<GestionMatriculas />} />
            <Route path="/matricula-ordinaria" element={<MatriculaOrdinaria/>} />
            <Route path="/matricula-extraordinaria" element={<MatriculaExtraordinaria />} /> 
            <Route path="/asignar-seccion" element={<AsignaSeccionPage />} /> 
          </>
        )}
        {role === 'Estudiante' && (
          <Route path="/formulario-matricula" element={<FormularioMatricula />} />
        )}

        {/* Rutas de usuarios solo para admin */}
        {role === 'superadmin' && (
          <>
            <Route path="/gestion-usuarios" element={<GestionUsuarios />} />
            <Route path="/crear-usuarios" element={<CrearUsuario />} />
          </>
        )}

        {/* Rutas de de grados  */}
        {role === 'superadmin'  && (
          <>
            <Route path="/Gestion-grados" element={<GestionGrados/>} />
          </>
        )}
        
        {/* Rutas de de Aulas  */}
        {role === 'superadmin'  && (
          <>
            <Route path="/Gestion-aulas" element={<GestionAulas/>} />
          </>
        )}

        {/* Rutas de de materias  */}
        {role === 'superadmin'  && (
          <>
            <Route path="/Gestion-materias" element={<GestionMaterias/>} />
          </>
        )}

        {/* Ruta para el perfil, accesible a todos */}
        <Route path="/mi-perfil" element={<MiPerfil />} />
      </Routes>
    </div>
  );
};
