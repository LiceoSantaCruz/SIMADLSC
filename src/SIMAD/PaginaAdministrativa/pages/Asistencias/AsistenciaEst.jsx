import { useState } from "react";
import useCrearAsistencia from "./Hook/useCrearAsistencia";
import useGrados from "./Hook/useGrados";
import useMaterias from "./Hook/useMaterias";
import useProfesores from "./Hook/useProfesores";
import useSecciones from "./Hook/useSecciones";
import useEstudiantesPorSeccion from "./Hook/useEstudiantesPorSeccion";
import { usePeriodos } from "./Hook/usePeriodos";
import ErrorModal from "./components/ErrorModal";
import SuccessModal from "./components/SuccessModal ";

export const AsistenciaEst = () => {
  const { grados } = useGrados();
  const { materias } = useMaterias();
  const { profesores } = useProfesores();
  const { periodos } = usePeriodos();

  const [formData, setFormData] = useState({
    fecha: "",
    id_Materia: "",
    id_grado: "",
    id_Seccion: "",
    id_Profesor: "",
    id_Periodo: "",
    lecciones: [],
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false); // Nuevo estado para el modal de error personalizado

  const { secciones, loading: loadingSecciones } = useSecciones(formData.id_grado);
  const { estudiantes, setEstudiantes, loading: loadingEstudiantes } = useEstudiantesPorSeccion(formData.id_Seccion);
  const { handleCrearAsistencias, loading, error } = useCrearAsistencia();

  // Validar si el día seleccionado es sábado o domingo
  const isWeekend = (date) => {
    const day = new Date(date).getDay();
    return day === 0 || day === 6; // Domingo (0) y sábado (6)
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "fecha") {
      if (isWeekend(value)) {
        // Mostrar modal de error si es fin de semana
        setShowErrorModal(true);
        setFormData((prevData) => ({ ...prevData, fecha: "" })); // Limpiar el campo de fecha
        return;
      }
    }

    setFormData({ ...formData, [name]: value });

    if (name === "id_grado") {
      setFormData((prevData) => ({ ...prevData, id_Seccion: "" }));
      setEstudiantes([]);
    }

    if (name === "id_Seccion") {
      setEstudiantes([]);
    }
  };

  const handleLeccionToggle = (leccion) => {
    const updatedLecciones = formData.lecciones.includes(leccion)
      ? formData.lecciones.filter((l) => l !== leccion)
      : [...formData.lecciones, leccion];

    setFormData({ ...formData, lecciones: updatedLecciones });
  };

  const handleEstadoChange = (id_Estudiante, estado) => {
    const updatedEstudiantes = estudiantes.map((estudiante) =>
      estudiante.id_Estudiante === id_Estudiante
        ? { ...estudiante, estado }
        : estudiante
    );
    setEstudiantes(updatedEstudiantes);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const asistenciasData = estudiantes.map((estudiante) => ({
      fecha: formData.fecha,
      estado: estudiante.estado,
      id_Estudiante: estudiante.id_Estudiante,
      id_Materia: formData.id_Materia,
      id_grado: formData.id_grado,
      id_Seccion: formData.id_Seccion,
      id_Profesor: formData.id_Profesor,
      id_Periodo: formData.id_Periodo,
      lecciones: formData.lecciones,
    }));

    try {
      await handleCrearAsistencias(asistenciasData);

      setShowSuccessModal(true);

      setFormData({
        fecha: "",
        id_Materia: "",
        id_grado: "",
        id_Seccion: "",
        id_Profesor: "",
        id_Periodo: "",
        lecciones: [],
      });
      setEstudiantes([]);
    } catch (err) {
      // El error ya se maneja desde el hook y pasa al estado `error`
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Registrar Asistencia</h2>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">Fecha:</label>
            <input
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-2">Grado:</label>
            <select
              name="id_grado"
              value={formData.id_grado}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            >
              <option value="">Seleccionar Grado</option>
              {grados.map((grado) => (
                <option key={grado.id_grado} value={grado.id_grado}>
                  {grado.nivel}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2">Sección:</label>
            <select
              name="id_Seccion"
              value={formData.id_Seccion}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
              disabled={!formData.id_grado}
            >
              <option value="">Seleccionar Sección</option>
              {loadingSecciones ? (
                <option>Cargando secciones...</option>
              ) : (
                secciones.map((seccion) => (
                  <option key={seccion.id_Seccion} value={seccion.id_Seccion}>
                    {seccion.nombre_Seccion}
                  </option>
                ))
              )}
            </select>
          </div>
          <div>
            <label className="block mb-2">Materia:</label>
            <select
              name="id_Materia"
              value={formData.id_Materia}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            >
              <option value="">Seleccionar Materia</option>
              {materias.map((materia) => (
                <option key={materia.id_Materia} value={materia.id_Materia}>
                  {materia.nombre_Materia}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2">Profesor:</label>
            <select
              name="id_Profesor"
              value={formData.id_Profesor}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            >
              <option value="">Seleccionar Profesor</option>
              {profesores.map((profesor) => (
                <option key={profesor.id_Profesor} value={profesor.id_Profesor}>
                  {profesor.nombre_Profesor} {profesor.apellido1_Profesor} {profesor.apellido2_Profesor}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2">Periodo:</label>
            <select
              name="id_Periodo"
              value={formData.id_Periodo}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            >
              <option value="">Seleccionar Periodo</option>
              {periodos.map((periodo) => (
                <option key={periodo.id_Periodo} value={periodo.id_Periodo}>
                  {periodo.nombre_Periodo}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-2">
            <label className="block mb-2">Seleccionar Lecciones:</label>
            <div className="grid grid-cols-6 gap-2">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((leccion) => (
                <label key={leccion} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={leccion}
                    checked={formData.lecciones.includes(leccion)}
                    onChange={() => handleLeccionToggle(leccion)}
                    className="form-checkbox"
                  />
                  <span>Lección {leccion}</span>
                </label>
              ))}
            </div>
            <p className="mt-2 text-gray-600">
              Seleccionadas:{" "}
              {formData.lecciones.length > 0
                ? formData.lecciones.sort((a, b) => a - b).join("/")
                : "Ninguna"}
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-4">Lista de Estudiantes</h3>
        <div className="overflow-x-auto">
          {loadingEstudiantes ? (
            <p>Cargando estudiantes...</p>
          ) : (
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2">Estudiante</th>
                  <th className="py-2">Estado</th>
                </tr>
              </thead>
              <tbody>
                {estudiantes.map((estudiante) => (
                  <tr key={estudiante.id_Estudiante}>
                    <td className="border px-4 py-2">
                      {estudiante.nombre_Estudiante}{" "}
                      {estudiante.apellido1_Estudiante}
                    </td>
                    <td className="border px-4 py-2">
                      <select
                        value={estudiante.estado}
                        onChange={(e) =>
                          handleEstadoChange(
                            estudiante.id_Estudiante,
                            e.target.value
                          )
                        }
                        className="p-1 border rounded"
                      >
                        <option value="P">Presente</option>
                        <option value="A">Ausente</option>
                        <option value="E">Escapado</option>
                        <option value="J">Justificado</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          {loading ? "Guardando..." : "Guardar Asistencia"}
        </button>
      </form>

      {/* Modales */}
      {error && (
        <ErrorModal
          message={error}
          onClose={() => {}}
        />
      )}
      {showErrorModal && (
        <ErrorModal
          message="No se pueden seleccionar sábados ni domingos como fecha de asistencia."
          onClose={() => setShowErrorModal(false)}
        />
      )}
      {showSuccessModal && (
        <SuccessModal
          message="¡Asistencia creada exitosamente!"
          onClose={() => setShowSuccessModal(false)}
        />
      )}
    </div>
  );
};