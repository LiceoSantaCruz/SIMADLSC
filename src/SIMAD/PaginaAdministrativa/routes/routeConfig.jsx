import { InfoAdminPage } from '../pages/InfoAdminPage';
import { InfoProfesorPage } from '../pages/InfoProfesorPage';
import { InfoEstudiantePage } from '../pages/InfoEstudiantePage';
import { AsistenciaEst } from '../pages/Asistencias/AsistenciaEst';
import { GestionAsistencia } from '../pages/Asistencias/GestionAsistencia';
import { JustificacionAusencias } from '../pages/Asistencias/JustificacionAusencias';
import { ReporteAsistencia } from '../pages/Asistencias/ReporteAsistencia';
import { ReporteAsistenciaSeccion } from '../pages/Asistencias/ReporteAsistenciaSeccion';
import GestionEventos from '../pages/Eventos/GestionEventos';
import CrearEventos from '../pages/Eventos/CrearEventos';
import Eventos from '../pages/Eventos/Eventos';
import UserEventos from '../pages/Eventos/UserEventos';
import EventosEdit from '../pages/Eventos/EventosEdit';
import { MiPerfil } from '../pages/Perfil/MiPerfil';

export const routeConfig = [
  { path: '/infoAdmin', element: () => <InfoAdminPage />, roles: ['admin', 'superadmin'] },
  { path: '/infoProfesor', element: () => <InfoProfesorPage />, roles: ['profesor'] },
  { path: '/infoEstudiante', element: () => <InfoEstudiantePage />, roles: ['estudiante'] },
  { path: '/asistencia-estudiantes', element: () => <AsistenciaEst />, roles: ['admin', 'superadmin', 'profesor'] },
  { path: '/gestion-asistencia', element: () => <GestionAsistencia />, roles: ['admin', 'superadmin', 'profesor'] },
  { path: '/justificacion-ausencias', element: () => <JustificacionAusencias />, roles: ['admin', 'superadmin', 'profesor'] },
  { path: '/reporte-asistencia', element: () => <ReporteAsistencia />, roles: ['admin', 'superadmin', 'profesor'] },
  { path: '/reporte-asistencia-seccion', element: () => <ReporteAsistenciaSeccion />, roles: ['admin', 'superadmin', 'profesor'] },
  { path: '/eventos', element: () => <Eventos /> },
  { path: '/crear-eventos', element: () => <CrearEventos />, roles: ['admin', 'superadmin'] },
  { path: '/gestion-eventos', element: () => <GestionEventos />, roles: ['admin', 'superadmin'] },
  { path: '/user-eventos', element: () => <UserEventos /> },
  { path: '/eventos-edit/:id', element: () => <EventosEdit />, roles: ['admin', 'superadmin'] },
  { path: '/mi-perfil', element: () => <MiPerfil /> },
];