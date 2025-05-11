import { useState, useEffect, useMemo } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import useFetch from '../../../../Hooks/useFetch';
import FormularioHorarioEstudiante from '../../../PaginaAdministrativa/pages/Horarios/Formularios/FormularioHorarioEstudiante';
import ListaHorarios from './Vistas/ListaHorarios';
import ToggleButton from '../../../../Components/ToggleButton';
import ErrorMessage from '../../../../Components/ErrorMessage';
import LoadingIndicator from '../../../../Components/LoadingIndicator';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MySwal = withReactContent(Swal);

const API_BASE_URL =
  window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : 'https://simadlsc-backend-production.up.railway.app';

export const GestionHorario = () => {
  const [formularioAbierto, setFormularioAbierto] = useState(false);
  const [horarios, setHorarios] = useState([]);
  const [horarioEdit, setHorarioEdit] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(27);
  const [seccionSeleccionada, setSeccionSeleccionada] = useState('');

  const { data: grados, loading: loadingGrados, error: errorGrados } = useFetch(
    `${API_BASE_URL}/grados`
  );
  const { data: secciones, loading: loadingSecciones, error: errorSecciones } = useFetch(
    `${API_BASE_URL}/secciones`
  );
  const { data: materias, loading: loadingMaterias, error: errorMaterias } = useFetch(
    `${API_BASE_URL}/materias`
  );
  const { data: profesores, loading: loadingProfesores, error: errorProfesores } = useFetch(
    `${API_BASE_URL}/profesores`
  );
  const { data: aulas, loading: loadingAulas, error: errorAulas } = useFetch(
    `${API_BASE_URL}/aulas`
  );
  const {
    data: horariosData,
    loading: loadingHorarios,
    error: errorHorarios,
    refetch: refetchHorarios,
  } = useFetch(`${API_BASE_URL}/horarios`);

  // Actualizar horarios desde la data obtenida
  useEffect(() => {
    if (horariosData) {
      setHorarios(horariosData);
    }
  }, [horariosData]);

  // Para estudiantes, la sección viene de su información
  const role = localStorage.getItem('role');
  const estudianteId = localStorage.getItem('id_Estudiante');

  useEffect(() => {
    const obtenerDatosIniciales = async () => {
      try {
        if (role === 'estudiante' && estudianteId) {
          const responseEstudiante = await fetch(
            `${API_BASE_URL}/estudiantes/${estudianteId}`
          );
          const dataEstudiante = await responseEstudiante.json();
          setSeccionSeleccionada(dataEstudiante.seccion?.id_Seccion || '');
        }
      } catch (error) {
        console.error('Error al obtener datos iniciales:', error);
      }
    };
    obtenerDatosIniciales();
  }, [role, estudianteId]);

  // Reiniciar paginación cuando cambia el filtro de sección
  useEffect(() => {
    setCurrentPage(1);
  }, [seccionSeleccionada]);

  // Filtro de sección
  const horariosFiltrados = useMemo(() => {
    return seccionSeleccionada
      ? horarios.filter((h) => h.seccion?.id_Seccion === Number(seccionSeleccionada))
      : horarios;
  }, [seccionSeleccionada, horarios]);

  // Confirmación y eliminación de todos los horarios
  const handleDeleteAll = async () => {
    const result = await MySwal.fire({
      title: '¿Eliminar todos los horarios?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e53e3e',
      cancelButtonColor: '#a0aec0',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`${API_BASE_URL}/horarios`, { method: 'DELETE' });
        if (!res.ok) throw new Error();
        setHorarios([]);
        refetchHorarios();
        MySwal.fire('Eliminados', 'Todos los horarios han sido eliminados.', 'success');
      } catch {
        MySwal.fire('Error', 'No se pudieron eliminar los horarios.', 'error');
      }
    }
  };

  // Abrir / cerrar formulario
  const toggleFormulario = () => {
    setFormularioAbierto(!formularioAbierto);
    setHorarioEdit(null);
  };

  // Manejadores de éxito en crear/editar
  const handleSubmitSuccess = (nuevoHorario) => {
    setHorarios((prev) => [...prev, nuevoHorario]);
    MySwal.fire({ icon: 'success', title: 'Horario registrado exitosamente.', confirmButtonText: 'OK' });
    refetchHorarios();
    setFormularioAbierto(false);
  };
  const handleEditHorario = (horario) => {
    setFormularioAbierto(true);
    setHorarioEdit(horario);
  };
  const handleUpdateHorario = (horarioActualizado) => {
    setHorarios((prev) =>
      prev.map((h) => (h.id_Horario === horarioActualizado.id_Horario ? horarioActualizado : h))
    );
    MySwal.fire({ icon: 'success', title: 'Horario actualizado exitosamente.', confirmButtonText: 'OK' });
    setHorarioEdit(null);
    setFormularioAbierto(false);
    refetchHorarios();
  };

  // Estados de carga y error
  const isLoading = [
    loadingGrados,
    loadingSecciones,
    loadingMaterias,
    loadingProfesores,
    loadingAulas,
    loadingHorarios,
  ].some(Boolean);
  const hasError = [
    errorGrados,
    errorSecciones,
    errorMaterias,
    errorProfesores,
    errorAulas,
    errorHorarios,
  ].some(Boolean);

  // Función para formatear hora
  const formatearHora = (h) => {
    if (!h) return 'N/A';
    const [hora, min] = h.split(':');
    let num = parseInt(hora, 10);
    const ampm = num >= 12 ? 'PM' : 'AM';
    num = num % 12 || 12;
    return `${num}:${min} ${ampm}`;
  };

  // Exportar a PDF
  const exportarPdf = () => {
    if (horariosFiltrados.length === 0) {
      MySwal.fire({ icon: 'info', title: 'No hay horarios para exportar.', confirmButtonText: 'OK' });
      return;
    }
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Gestión de Horarios', 14, 22);

    const cols = ['ID','Grado','Sección','Materia','Profesor','Aula','Día','Hora Inicio','Hora Fin'];
    const rows = horariosFiltrados.map((h) => [
      h.id_Horario,
      h.seccion?.gradoId || 'N/A',
      h.seccion?.nombre_Seccion || 'N/A',
      h.materia?.nombre_Materia || 'N/A',
      h.profesor
        ? `${h.profesor.nombre_Profesor} ${h.profesor.apellido1_Profesor} ${h.profesor.apellido2_Profesor}`
        : 'N/A',
      h.aula?.nombre_Aula || 'N/A',
      h.dia_semana_Horario,
      formatearHora(h.hora_inicio_Horario),
      formatearHora(h.hora_fin_Horario),
    ]);

    doc.autoTable({ head: [cols], body: rows, startY: 30, styles: { fontSize: 10 }, theme: 'striped', margin: { top: 20 } });
    doc.save('Gestion_Horarios.pdf');
  };

  // Paginación
  const totalPages = Math.ceil(horariosFiltrados.length / itemsPerPage);
  const indexLast = currentPage * itemsPerPage;
  const indexFirst = indexLast - itemsPerPage;
  const currentHorarios = horariosFiltrados.slice(indexFirst, indexLast);

  const maxButtons = 6;
  let startPage = 1;
  let endPage = totalPages <= maxButtons
    ? totalPages
    : currentPage <= Math.floor(maxButtons/2)
      ? maxButtons
      : currentPage + Math.floor(maxButtons/2) - 1 >= totalPages
        ? totalPages
        : currentPage - Math.floor(maxButtons/2) + 1 + maxButtons - 1;

  const paginate = (num) => setCurrentPage(num);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 text-gray-900 dark:text-white">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-4xl font-extrabold text-center mb-8">Gestión de Horarios</h1>

        {/* Filtro por sección */}
        {(role === 'admin' || role === 'superadmin') && !formularioAbierto && secciones && (
          <div className="mb-6">
            <label className="block text-lg font-medium mb-2 text-gray-700 dark:text-gray-200">
              Seleccionar Sección
            </label>
            <select
              value={seccionSeleccionada}
              onChange={(e) => setSeccionSeleccionada(e.target.value)}
              className="border p-2 rounded-lg w-full dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="">Todas las secciones</option>
              {secciones.map((sec) => (
                <option key={sec.id_Seccion} value={sec.id_Seccion}>
                  {sec.nombre_Seccion}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <ToggleButton
            label={formularioAbierto ? 'Cerrar Formulario' : 'Crear Horario'}
            isSelected={formularioAbierto}
            onClick={toggleFormulario}
            color="green"
          />
          <button
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-md transition disabled:opacity-50"
            onClick={handleDeleteAll}
            disabled={horarios.length === 0 || isLoading}
            title={horarios.length === 0 ? "No hay horarios para eliminar" : "Eliminar todos los horarios"}
          >
            Eliminar Todos los Horarios
          </button>
          <button
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md transition disabled:opacity-50"
            onClick={exportarPdf}
            disabled={horariosFiltrados.length === 0 || isLoading}
            title={horariosFiltrados.length === 0 ? "No hay horarios para exportar" : "Exportar todos los horarios como PDF"}
          >
            Exportar Todos los Horarios como PDF
          </button>
        </div>

        {/* Estado de carga / error */}
        {isLoading && <LoadingIndicator />}
        {hasError && (
          <ErrorMessage message="Hubo un problema al cargar los datos. Por favor, intenta nuevamente." />
        )}

        {/* Contenido principal */}
        {!isLoading && !hasError && (
          <>
            {formularioAbierto ? (
              <div className="mb-8">
                <FormularioHorarioEstudiante
                  onSubmitSuccess={horarioEdit ? handleUpdateHorario : handleSubmitSuccess}
                  onCancel={() => setFormularioAbierto(false)}
                  initialData={horarioEdit}
                  grados={grados}
                  materias={materias}
                  profesores={profesores}
                  aulas={aulas}
                />
              </div>
            ) : (
              materias && profesores && aulas && (
                <>
                  <div className="bg-white dark:bg-gray-800 shadow-lg rounded-md p-6">
                    <ListaHorarios
                      horarios={currentHorarios}
                      onEditHorario={handleEditHorario}
                      setHorarios={setHorarios}
                      materias={materias}
                      profesores={profesores}
                      aulas={aulas}
                      secciones={secciones}
                    />
                  </div>
                  {/* Paginación */}
                  <div className="flex justify-center items-center mt-6 space-x-2">
                    <button
                      onClick={() => setCurrentPage((prev) => prev - 1)}
                      disabled={currentPage === 1}
                      className="mx-1 w-10 h-10 flex justify-center items-center rounded text-sm transition bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-white disabled:opacity-50"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    {Array.from({ length: endPage - startPage + 1 }, (_, idx) => {
                      const pageNumber = startPage + idx;
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => paginate(pageNumber)}
                          className={`mx-1 w-10 h-10 flex justify-center items-center rounded text-sm transition font-medium ${
                            currentPage === pageNumber
                              ? 'bg-blue-600 text-white hover:bg-blue-700'
                              : 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-500'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setCurrentPage((prev) => prev + 1)}
                      disabled={currentPage === totalPages}
                      className="mx-1 w-10 h-10 flex justify-center items-center rounded text-sm transition bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-white disabled:opacity-50"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </>
              )
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default GestionHorario;
