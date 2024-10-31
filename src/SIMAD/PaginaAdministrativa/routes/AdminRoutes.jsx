import { Routes, Route, Navigate } from 'react-router-dom';
import { InfoAdminPage } from '../pages/InfoAdminPage';
import { AsistenciaEst } from '../pages/Asistencias/AsistenciaEst';
import { AsistenciaProf } from '../pages/Asistencias/AsistenciaProf';
import { GestionAsistencia } from '../pages/Asistencias/GestionAsistencia';
import { JustificacionAusencias } from '../pages/Asistencias/JustificacionAusencias';
import { ReporteAsistencia } from '../pages/Asistencias/ReporteAsistencia';
import { Eventos } from '../../components/Eventos';
import { GestionEventos } from '../pages/Eventos/GestionEventos';
import { GestionHorario } from '../pages/Horarios/GestionHorario';
<<<<<<< Updated upstream
import { HorarioEstu } from '../pages/Horarios/HorarioEstu';
import { HorarioProf } from '../pages/Horarios/HorarioProf';
import { FormularioMatricula } from '../pages/Matricula/FormularioMatricula';
import { GestionMatricula } from '../pages/Matricula/GestionMatricula';
import { MatriculaOrdinaria } from '../pages/Matricula/MatriculaOrdinaria';
import { MatriculaExtraordinaria } from '../pages/Matricula/MatriculaExtraordinaria';
import { GestionUsuarios } from '../pages/Usuarios/GestionUsuarios';
import { MiPerfil } from '../pages/Perfil/MiPerfil';



=======
import { HorarioEstu } from '../pages/Horarios/Vistas/HorarioEstu';
import { HorarioProf } from '../pages/Horarios/Vistas/HorarioProf';
import { FormularioMatricula } from '../pages/Matricula/components/FormularioMatricula';
// import { GestionMatricula } from '../pages/Matricula/GestionMatricula';
// import { MatriculaOrdinaria } from '../pages/Matricula/Vite/MatriculaOrdinaria';
import GestionUsuarios from '../pages/Usuarios/GestionUsuarios';
import CrearUsuario from '../pages/Usuarios/CrearUsuario';
import { MiPerfil } from '../pages/Perfil/MiPerfil';
import CrearEventos from '../pages/Eventos/CrearEventos';
import Eventos from '../pages/Eventos/Eventos';
import UserEventos from '../pages/Eventos/UserEventos';
import EventosEdit from '../pages/Eventos/EventosEdit';
import MatriculaExtraordinaria from '../pages/Matricula/Vite/MatriculaExtraordinaria';
import GestionMatriculas from '../pages/Matricula/GestionMatricula';
//import GestionMatriculas from '../pages/Matricula/GestionMatricula';
>>>>>>> Stashed changes
export const AdminRoutes = () => {
  return (
    <div className="flex-grow p-6 bg-gray-100 min-h-screen overflow-auto">
                    <Routes>
                        <Route path="/" element={<Navigate to="/info" replace />} />
                        <Route path="/info" element={<InfoAdminPage />} />

<<<<<<< Updated upstream
                        {/* Asistencia Routes */}
                        <Route path="/asistencia-estudiantes" element={<AsistenciaEst />} />
                        <Route path="/asistencia-profesores" element={<AsistenciaProf />} />
                        <Route path="/gestion-asistencia" element={<GestionAsistencia />} />
                        <Route path="/justificacion-ausencias" element={<JustificacionAusencias />} />
                        <Route path="/reporte-asistencia" element={<ReporteAsistencia />} />
                        
                        {/* Eventos Routes */}
                        <Route path="/eventos" element={<Eventos />} />
                        <Route path="/gestion-eventos" element={<GestionEventos />} />
                        
                        {/* Horarios Routes */}
                        <Route path="/gestion-horario" element={<GestionHorario />} />
                        <Route path="/horario-estudiantes" element={<HorarioEstu />} />
                        <Route path="/horario-profesores" element={<HorarioProf />} />
                        
                        {/* Matrícula Routes */}
                        <Route path="/formulario-matricula" element={<FormularioMatricula />} />
                        <Route path="/gestion-matricula" element={<GestionMatricula />} />
                        <Route path="/matricula-ordinaria" element={<MatriculaOrdinaria />} />
                        <Route path="/matricula-extraordinaria" element={<MatriculaExtraordinaria />} />
                        
                        {/* Usuarios Routes */}
                        <Route path="/gestion-usuarios" element={<GestionUsuarios />} />
                        
                        {/* Perfil y Logout */}
                        <Route path="/mi-perfil" element={<MiPerfil />} />
                    </Routes>
                </div>
  )
}
=======
      <Routes>
        <Route path="/" element={<Navigate to="/info" replace />} />
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
          </>
        )}

        <Route path="/eventos" element={<Eventos />} />
        <Route path="/crear-eventos" element={<CrearEventos />} />
        <Route path="/gestion-eventos" element={<GestionEventos />} />
        <Route path="/user-eventos" element={<UserEventos />} />
        <Route path="/eventos-edit/:id" element={<EventosEdit />} />

          {/* Rutas para horarios, según el rol */}
          {(role === 'admin' || role === 'superadmin' || role === 'profesor' || role === 'estudiante') && (
            <>
              <Route path="/gestion-horario" element={<GestionHorario />} />
              <Route path="/horario-estudiantes" element={<HorarioEstu />} />
              <Route path="/horario-profesores" element={<HorarioProf />} />
            </>
          )}
          
        {/* Rutas para matrícula, según el rol */}
        {(role === 'admin' || role === 'superadmin') && (
          <>
            <Route path="/formulario-matricula" element={<FormularioMatricula />} />
            <Route path="/gestion-matricula" element={<GestionMatriculas />} />
            {/* <Route path="/matricula-ordinaria" element={<MatriculaOrdinaria />} /> */}
            <Route path="/matricula-extraordinaria" element={<MatriculaExtraordinaria />} /> 
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

        {/* Ruta para el perfil, accesible a todos */}
        <Route path="/mi-perfil" element={<MiPerfil />} />
      </Routes>
    </div>
  );
};
>>>>>>> Stashed changes
