import React, { useState, useMemo } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';
import FormularioHorarioEstudiante from '../Formularios/FormularioHorarioEstudiante';

// URL base de la API
const API_BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://simadlsc-backend-production.up.railway.app'
    : 'http://localhost:3000';

/**
 * Función utilitaria para formatear hora de 24h a 12h con AM/PM.
 * Ej: "13:05" -> "1:05 PM"
 */
const formatearHora12 = (hora24) => {
  const [hora, minutos] = hora24.split(':').map(Number);
  const periodo = hora >= 12 ? 'PM' : 'AM';
  const hora12 = hora % 12 === 0 ? 12 : hora % 12;
  return `${hora12}:${minutos.toString().padStart(2, '0')} ${periodo}`;
};

// Mapeo para ordenar los días de la semana
const ordenDias = {
  Lunes: 1,
  Martes: 2,
  Miércoles: 3,
  Jueves: 4,
  Viernes: 5,
};

const ListaHorarios = ({
  horarios,
  setHorarios,
  materias,
  profesores,
  aulas,
  secciones,
}) => {
  // ==================
  //   ESTADOS LOCALES
  // ==================

  // 1) Modal para editar
  const [modalAbierto, setModalAbierto] = useState(false);
  const [horarioSeleccionado, setHorarioSeleccionado] = useState(null);

  // 2) "Ver más" (detalles)
  const [detallesAbiertos, setDetallesAbiertos] = useState({});

  // 3) Estado para la sección seleccionada (filtro)
  const [selectedSeccionId, setSelectedSeccionId] = useState('');

  // ======================
  //   FUNCIONES PRINCIPALES
  // ======================

  /**
   * Eliminar un horario
   */
  const eliminarHorario = async (id) => {
    const confirmacion = await Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas eliminar este horario?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (confirmacion.isConfirmed) {
      try {
        await axios.delete(`${API_BASE_URL}/horarios/${id}`);
        setHorarios((prev) => prev.filter((h) => h.id_Horario !== id));

        Swal.fire('¡Eliminado!', 'El horario ha sido eliminado exitosamente.', 'success');
      } catch (err) {
        console.error('Error al eliminar horario:', err);
        Swal.fire('Error', 'Hubo un error al eliminar el horario.', 'error');
      }
    }
  };

  /**
   * Abrir modal de edición: se obtiene el horario por ID desde el backend
   */
  const abrirModalEditar = async (horarioId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/horarios/${horarioId}`);
      setHorarioSeleccionado(response.data); // Guardamos el objeto completo
      setModalAbierto(true);
    } catch (error) {
      console.error('Error al obtener el horario:', error);
      Swal.fire('Error', 'No se pudo obtener el horario para editar.', 'error');
    }
  };

  /**
   * Cerrar el modal de edición
   */
  const cerrarModal = () => {
    setHorarioSeleccionado(null);
    setModalAbierto(false);
  };

  /**
   * Actualizar el horario en la lista luego de editar
   */
  const actualizarHorarioEnLista = (horarioEditado) => {
    setHorarios((prevHorarios) =>
      prevHorarios.map((h) =>
        h.id_Horario === horarioEditado.id_Horario ? horarioEditado : h
      )
    );
    Swal.fire('Actualizado', 'El horario ha sido actualizado exitosamente.', 'success');
    cerrarModal();
  };

  /**
   * Abrir/cerrar los detalles de cada fila
   */
  const toggleDetalles = (idHorario) => {
    setDetallesAbiertos((prev) => ({
      ...prev,
      [idHorario]: !prev[idHorario],
    }));
  };

  // ================
  //  LÓGICA DE FILTRO
  // ================

  // 1) Ordenar los horarios por día y hora de inicio (useMemo para rendimiento)
  const horariosOrdenados = useMemo(() => {
    return [...horarios].sort((a, b) => {
      const ordenA = ordenDias[a.dia_semana_Horario] || 99;
      const ordenB = ordenDias[b.dia_semana_Horario] || 99;

      if (ordenA !== ordenB) {
        return ordenA - ordenB;
      }
      return a.hora_inicio_Horario.localeCompare(b.hora_inicio_Horario);
    });
  }, [horarios]);

  // 2) Filtrar por la sección seleccionada (selectedSeccionId)
  const horariosFiltrados = useMemo(() => {
    if (!selectedSeccionId) {
      return horariosOrdenados;
    }
    return horariosOrdenados.filter((horario) => {
      // Ajusta según cómo venga la data de tu backend (p.e., horario.seccionId en lugar de horario.seccion?.id_Seccion).
      return horario.seccion?.id_Seccion === Number(selectedSeccionId);
    });
  }, [selectedSeccionId, horariosOrdenados]);

  // ================
  //     RENDERIZADO
  // ================

  // Si no hay horarios, mostrar un mensaje.
  if (!horarios) {
    return <p>No hay horarios disponibles.</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Lista de Horarios</h2>

      

      {horariosFiltrados.length === 0 ? (
        <p>No hay horarios con la sección seleccionada.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Sección</th>
                <th className="py-2 px-4 border-b">Profesor</th>
                <th className="py-2 px-4 border-b">Materia</th>
                <th className="py-2 px-4 border-b">Día</th>
                <th className="py-2 px-4 border-b">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {horariosFiltrados.map((horario) => (
                <React.Fragment key={horario.id_Horario}>
                  <tr className="text-center">
                    <td className="py-2 px-4 border-b">
                      {horario.seccion?.nombre_Seccion || 'N/A'}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {horario.profesor
                        ? `${horario.profesor.nombre_Profesor} ${horario.profesor.apellido1_Profesor} ${horario.profesor.apellido2_Profesor}`
                        : 'N/A'}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {horario.materia?.nombre_Materia || 'N/A'}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {horario.dia_semana_Horario}
                    </td>
                    <td className="py-2 px-4 border-b flex justify-center space-x-2">
                      {/* Botón Editar: abre modal con datos */}
                      <button
                        className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                        onClick={() => abrirModalEditar(horario.id_Horario)}
                      >
                        Editar
                      </button>

                      {/* Botón Eliminar */}
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        onClick={() => eliminarHorario(horario.id_Horario)}
                      >
                        Eliminar
                      </button>

                      {/* Botón Ver Más / Ocultar */}
                      <button
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                        onClick={() => toggleDetalles(horario.id_Horario)}
                      >
                        {detallesAbiertos[horario.id_Horario] ? 'Ocultar' : 'Ver Más'}
                      </button>
                    </td>
                  </tr>

                  {/* Fila de detalles adicional */}
                  {detallesAbiertos[horario.id_Horario] && (
                    <tr className="bg-gray-100">
                      <td colSpan="5" className="py-2 px-4">
                        <div className="flex flex-col md:flex-row md:space-x-6">
                          <div className="mb-2 md:mb-0">
                            <p>
                              <strong>Hora de Inicio:</strong>{' '}
                              {formatearHora12(horario.hora_inicio_Horario)}
                            </p>
                            <p>
                              <strong>Hora de Fin:</strong>{' '}
                              {formatearHora12(horario.hora_fin_Horario)}
                            </p>
                          </div>
                          <div>
                            <p>
                              <strong>Aula:</strong>{' '}
                              {horario.aula?.nombre_Aula || 'N/A'}
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL para editar horario */}
      {modalAbierto && horarioSeleccionado && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={cerrarModal}
        >
          <div
            className="bg-white p-6 rounded-lg w-11/12 md:w-1/2 lg:w-1/3 overflow-y-auto max-h-full relative"
            onClick={(e) => e.stopPropagation()} // Evita cerrar el modal al hacer clic dentro
          >
            {/* Botón para cerrar */}
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
              onClick={cerrarModal}
            >
              &times;
            </button>

            <FormularioHorarioEstudiante
              onSubmitSuccess={actualizarHorarioEnLista}
              onCancel={cerrarModal}
              initialData={horarioSeleccionado}
              materias={materias}
              profesores={profesores}
              aulas={aulas}
              secciones={secciones}
            />
          </div>
        </div>
      )}
    </div>
  );
};

ListaHorarios.propTypes = {
  horarios: PropTypes.array.isRequired,
  setHorarios: PropTypes.func.isRequired,
  materias: PropTypes.array.isRequired,
  profesores: PropTypes.array.isRequired,
  aulas: PropTypes.array.isRequired,
  secciones: PropTypes.array.isRequired,
};

export default ListaHorarios;
