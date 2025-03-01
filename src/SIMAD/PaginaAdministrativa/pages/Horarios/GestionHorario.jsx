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

const MySwal = withReactContent(Swal);

// URL base de la API dependiendo del entorno
const API_BASE_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:3000'
  : 'https://simadlsc-backend-production.up.railway.app';

export const GestionHorario = () => {
  const [formularioAbierto, setFormularioAbierto] = useState(false);
  const [horarios, setHorarios] = useState([]);
  const [horarioEdit, setHorarioEdit] = useState(null); // Horario a editar
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Elementos por página
  const [seccionSeleccionada, setSeccionSeleccionada] = useState('');

  // Hook para obtener datos
  const { data: grados, loading: loadingGrados, error: errorGrados } = useFetch(`${API_BASE_URL}/grados`);
  const { data: secciones, loading: loadingSecciones, error: errorSecciones } = useFetch(`${API_BASE_URL}/secciones`);
  const { data: materias, loading: loadingMaterias, error: errorMaterias } = useFetch(`${API_BASE_URL}/materias`);
  const { data: profesores, loading: loadingProfesores, error: errorProfesores } = useFetch(`${API_BASE_URL}/profesores`);
  const { data: aulas, loading: loadingAulas, error: errorAulas } = useFetch(`${API_BASE_URL}/aulas`);
  const { data: horariosData, loading: loadingHorarios, error: errorHorarios, refetch: refetchHorarios } = useFetch(`${API_BASE_URL}/horarios`);

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
          // Puedes usar la sección del estudiante para filtrar
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
      ? horarios.filter(h => h.seccion?.id_Seccion === Number(seccionSeleccionada))
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
  const isLoading = [loadingGrados, loadingSecciones, loadingMaterias, loadingProfesores, loadingAulas, loadingHorarios].some(Boolean);
  const hasError = [errorGrados, errorSecciones, errorMaterias, errorProfesores, errorAulas, errorHorarios].some(Boolean);

  const formatearHora = (hora24) => {
    if (!hora24) return "N/A";
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

    const tableColumn = ['ID', 'Grado', 'Sección', 'Materia', 'Profesor', 'Aula', 'Día', 'Hora Inicio', 'Hora Fin'];
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

  // Paginación basada en horarios filtrados
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentHorarios = horariosFiltrados.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-8">Gestión de Horarios</h1>

        {/* Filtro por Sección (solo para admin/superadmin) */}
        {(role === 'admin' || role === 'superadmin') && secciones && (
          <div className="mb-6">
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Seleccionar Sección
            </label>
            <select
              value={seccionSeleccionada}
              onChange={(e) => setSeccionSeleccionada(e.target.value)}
              className="border p-2 rounded-lg w-full"
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

        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <ToggleButton
            label={formularioAbierto ? 'Cerrar Formulario' : 'Crear Horario'}
            isSelected={formularioAbierto}
            onClick={toggleFormulario}
            color="green"
          />
          <button
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md transition"
            onClick={exportarPdf}
            disabled={horariosFiltrados.length === 0 || isLoading}
            title={horariosFiltrados.length === 0 ? "No hay horarios para exportar" : "Exportar todos los horarios como PDF"}
          >
            Exportar Todos los Horarios como PDF
          </button>
        </div>

        {isLoading && <LoadingIndicator />}
        {hasError && (
          <ErrorMessage message="Hubo un problema al cargar los datos. Por favor, intenta nuevamente." />
        )}

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
                  <div className="bg-white shadow-lg rounded-md p-6">
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
                  <div className="flex flex-wrap justify-center mt-6">
                    {Array.from({ length: Math.ceil(horariosFiltrados.length / itemsPerPage) }, (_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => paginate(index + 1)}
                        className={`mx-2 my-1 px-4 py-2 rounded-md transition ${
                          currentPage === index + 1
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
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
