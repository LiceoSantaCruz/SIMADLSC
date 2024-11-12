import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import useFetch from '../../../../Hooks/useFetch';
import FormularioHorarioEstudiante from '../../../PaginaAdministrativa/pages/Horarios/Formularios/FormularioHorarioEstudiante';
import ListaHorarios from './Vistas/ListaHorarios';
import ToggleButton from '../../../../Components/ToggleButton';
import ErrorMessage from '../../../../Components/ErrorMessage';
import LoadingIndicator from '../../../../Components/LoadingIndicator';

// Definir la URL base de la API dependiendo del entorno
const API_BASE_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:3000' // URL de desarrollo
  : 'https://simadlsc-backend-production.up.railway.app'; // URL de producción

export const GestionHorario = () => {
  const [formularioAbierto, setFormularioAbierto] = useState(false);
  const [horarios, setHorarios] = useState([]);
  const [horarioEdit, setHorarioEdit] = useState(null); // Estado para el horario a editar

  // Utilizar el hook personalizado useFetch para obtener datos
  const { data: grados, loading: loadingGrados, error: errorGrados } = useFetch(`${API_BASE_URL}/grados`);
  const { data: secciones, loading: loadingSecciones, error: errorSecciones } = useFetch(`${API_BASE_URL}/secciones`);
  const { data: materias, loading: loadingMaterias, error: errorMaterias } = useFetch(`${API_BASE_URL}/materias`);
  const { data: profesores, loading: loadingProfesores, error: errorProfesores } = useFetch(`${API_BASE_URL}/profesores`);
  const { data: aulas, loading: loadingAulas, error: errorAulas } = useFetch(`${API_BASE_URL}/aulas`);
  const { data: horariosData, loading: loadingHorarios, error: errorHorarios, refetch: refetchHorarios } = useFetch(`${API_BASE_URL}/horarios`);

  // Actualizar horarios al obtener los datos iniciales
  useEffect(() => {
    if (horariosData) {
      setHorarios(horariosData);
    }
  }, [horariosData]);

  const toggleFormulario = () => {
    setFormularioAbierto(!formularioAbierto);
    setHorarioEdit(null); // Resetear el horarioEdit al abrir o cerrar el formulario
  };

  const handleSubmitSuccess = (nuevoHorario) => {
    setHorarios((prevHorarios) => [...prevHorarios, nuevoHorario]);

    // SweetAlert2 para éxito de registro
    Swal.fire({
      icon: 'success',
      title: 'Horario registrado exitosamente.',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK',
    });

    refetchHorarios(); // Refrescar la lista de horarios
    setFormularioAbierto(false); // Cerrar el formulario después de crear
  };

  const handleEditHorario = (horario) => {
    setFormularioAbierto(true);
    setHorarioEdit(horario); // Establecer el horario a editar
  };

  const handleUpdateHorario = (horarioActualizado) => {
    setHorarios((prevHorarios) =>
      prevHorarios.map((horario) =>
        horario.id_Horario === horarioActualizado.id_Horario ? horarioActualizado : horario
      )
    );

    // SweetAlert2 para éxito de actualización
    Swal.fire({
      icon: 'success',
      title: 'Horario actualizado exitosamente.',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK',
    });

    setHorarioEdit(null);
    setFormularioAbierto(false); // Cerrar el formulario después de actualizar
    refetchHorarios();
  };

  // Manejar estados de carga y errores de manera simplificada
  const isLoading = [loadingGrados, loadingSecciones, loadingMaterias, loadingProfesores, loadingAulas, loadingHorarios].some(Boolean);
  const hasError = [errorGrados, errorSecciones, errorMaterias, errorProfesores, errorAulas, errorHorarios].some(Boolean);

  // Función para formatear la hora de 24 horas a 12 horas con AM/PM
  const formatearHora = (hora24) => {
    if (!hora24) return "N/A"; // Si la hora no está disponible, retornar "N/A"
    const [hora, minuto] = hora24.split(':');
    let horaNum = parseInt(hora, 10);
    const ampm = horaNum >= 12 ? 'PM' : 'AM';
    horaNum = horaNum % 12 || 12; // Convertir 0 a 12
    return `${horaNum}:${minuto} ${ampm}`;
  };

  // Función para generar el PDF
  const exportarPdf = () => {
    if (horarios.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'No hay horarios para exportar.',
        confirmButtonText: 'OK',
      });
      return;
    }

    const doc = new jsPDF();

    // Título
    doc.setFontSize(16);
    doc.text('Gestión de Horarios', 14, 22);

    // Definir las columnas
    const tableColumn = ['ID', 'Grado', 'Sección', 'Materia', 'Profesor', 'Aula', 'Día', 'Hora Inicio', 'Hora Fin'];
    const tableRows = [];

    // Agregar filas
    horarios.forEach((horario) => {
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

    // Agregar la tabla al PDF
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [100, 100, 100] },
      theme: 'striped',
      margin: { top: 20 },
    });

    // Guardar el PDF
    doc.save('Gestion_Horarios.pdf');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Gestión de Horarios</h1>

      {/* Botones para abrir/cerrar formulario y exportar PDF */}
      <div className="flex items-center mb-6 space-x-4">
        <ToggleButton
          label={formularioAbierto ? 'Cerrar Formulario' : 'Crear Horario'}
          isSelected={formularioAbierto}
          onClick={toggleFormulario}
          color="green"
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          onClick={exportarPdf}
          disabled={horarios.length === 0 || isLoading}
          title={horarios.length === 0 ? "No hay horarios para exportar" : "Exportar todos los horarios como PDF"}
        >
          Exportar Todos los Horarios como PDF
        </button>
      </div>

      {/* Manejar estados de carga y errores */}
      {isLoading && <LoadingIndicator />}
      {hasError && (
        <ErrorMessage message="Hubo un problema al cargar los datos. Por favor, intenta nuevamente." />
      )}

      {/* Mostrar el formulario o la lista, pero no ambos */}
      {!isLoading && !hasError && (
        <>
          {formularioAbierto ? (
            <FormularioHorarioEstudiante
              onSubmitSuccess={horarioEdit ? handleUpdateHorario : handleSubmitSuccess}
              onCancel={() => setFormularioAbierto(false)}
              initialData={horarioEdit}
              grados={grados}
              materias={materias}
              profesores={profesores}
              aulas={aulas}
            />
          ) : (
            materias && profesores && aulas && (
              <ListaHorarios
                horarios={horarios}
                onEditHorario={handleEditHorario} // Pasar la función de edición
                setHorarios={setHorarios}
                materias={materias}
                profesores={profesores}
                aulas={aulas}
                secciones={secciones}
              />
            )
          )}
        </>
      )}
    </div>
  );
};

export default GestionHorario;
