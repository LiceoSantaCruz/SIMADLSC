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
  const [itemsPerPage] = useState(10);
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
  const estudianteId = localStorage.getItem('id_estudiante');

  useEffect(() => {
    const obtenerDatosIniciales = async () => {
      try {
        if (role === 'admin' || role === 'superadmin') {
          // Ya se obtiene la lista de secciones mediante useFetch
        }
        if (role === 'estudiante' && estudianteId) {
          const responseEstudiante = await fetch(`${API_BASE_URL}/estudiantes/${estudianteId}`);
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

  // Filtro: si se selecciona una sección, se muestran solo esos horarios; si no, todos
  const horariosFiltrados = useMemo(() => {
    return seccionSeleccionada
      ? horarios.filter((h) => h.seccion?.id_Seccion === Number(seccionSeleccionada))
      : horarios;
  }, [seccionSeleccionada, horarios]);

  const toggleFormulario = () => {
    setFormularioAbierto(!formularioAbierto);
    setHorarioEdit(null);
  };

  const handleSubmitSuccess = (nuevoHorario) => {
    setHorarios((prevHorarios) => [...prevHorarios, nuevoHorario]);
    Swal.fire({
      icon: 'success',
      title: 'Horario registrado exitosamente.',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK',
    });
    refetchHorarios();
    setFormularioAbierto(false);
  };

  const handleEditHorario = (horario) => {
    setFormularioAbierto(true);
    setHorarioEdit(horario);
  };

  const handleUpdateHorario = (horarioActualizado) => {
    setHorarios((prevHorarios) =>
      prevHorarios.map((horario) =>
        horario.id_Horario === horarioActualizado.id_Horario ? horarioActualizado : horario
      )
    );
    Swal.fire({
      icon: 'success',
      title: 'Horario actualizado exitosamente.',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK',
    });
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

  const formatearHora = (hora24) => {
    if (!hora24) return 'N/A';
    const [hora, minuto] = hora24.split(':');
    let horaNum = parseInt(hora, 10);
    const ampm = horaNum >= 12 ? 'PM' : 'AM';
    horaNum = horaNum % 12 || 12;
    return `${horaNum}:${minuto} ${ampm}`;
  };

  const exportarPdf = () => {
    if (horariosFiltrados.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'No hay horarios para exportar.',
        confirmButtonText: 'OK',
      });
      return;
    }
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Gestión de Horarios', 14, 22);

    const tableColumn = [
      'ID',
      'Grado',
      'Sección',
      'Materia',
      'Profesor',
      'Aula',
      'Día',
      'Hora Inicio',
      'Hora Fin',
    ];
    const tableRows = [];
    horariosFiltrados.forEach((horario) => {
      const grado = horario.seccion?.gradoId || 'N/A';
      const seccion = horario.seccion?.nombre_Seccion || 'N/A';
      const materia = horario.materia?.nombre_Materia || 'N/A';
      const profesor = horario.profesor
        ? `${horario.profesor.nombre_Profesor} ${horario.profesor.apellido1_Profesor} ${horario.profesor.apellido2_Profesor}`
        : 'N/A';
      const aula = horario.aula?.nombre_Aula || 'N/A';
      tableRows.push([
        horario.id_Horario,
        grado,
        seccion,
        materia,
        profesor,
        aula,
        horario.dia_semana_Horario,
        formatearHora(horario.hora_inicio_Horario),
        formatearHora(horario.hora_fin_Horario),
      ]);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [100, 100, 100] },
      theme: 'striped',
      margin: { top: 20 },
    });
    doc.save(`Gestion_Horarios.pdf`);
  };

  // Paginación: calcular la porción actual según la página
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentHorarios = horariosFiltrados.slice(indexOfFirstItem, indexOfLastItem);

  // Lógica para limitar la cantidad de botones a 6
  const totalPages = Math.ceil(horariosFiltrados.length / itemsPerPage);
  const maxButtons = 6;
  let startPage, endPage;
  if (totalPages <= maxButtons) {
    startPage = 1;
    endPage = totalPages;
  } else {
    if (currentPage <= Math.floor(maxButtons / 2)) {
      startPage = 1;
      endPage = maxButtons;
    } else if (currentPage + Math.floor(maxButtons / 2) - 1 >= totalPages) {
      startPage = totalPages - maxButtons + 1;
      endPage = totalPages;
    } else {
      startPage = currentPage - Math.floor(maxButtons / 2) + 1;
      endPage = startPage + maxButtons - 1;
    }
  }

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 text-gray-900 dark:text-white">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-4xl font-extrabold text-center mb-8">Gestión de Horarios</h1>

        {/* Filtro por Sección */}
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

        {/* Botones */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <ToggleButton
            label={formularioAbierto ? 'Cerrar Formulario' : 'Crear Horario'}
            isSelected={formularioAbierto}
            onClick={toggleFormulario}
            color="green"
          />
          <button
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md transition disabled:opacity-50"
            onClick={exportarPdf}
            disabled={horariosFiltrados.length === 0 || isLoading}
            title={
              horariosFiltrados.length === 0
                ? "No hay horarios para exportar"
                : "Exportar todos los horarios como PDF"
            }
          >
            Exportar Todos los Horarios como PDF
          </button>
        </div>

        {/* Estados */}
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
                  {/* Paginación personalizada */}
                  <div className="flex justify-center items-center mt-6 space-x-2">
                    {/* Botón anterior */}
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
                              ? "bg-blue-600 text-white hover:bg-blue-700"
                              : "bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-500"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                    {/* Botón siguiente */}
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
