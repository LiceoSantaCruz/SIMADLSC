import { useState } from "react";
import useCrearAsistencia from "./Hook/useCrearAsistencia";
import useGrados from "./Hook/useGrados";
import useMaterias from "./Hook/useMaterias";
import useProfesores from "./Hook/useProfesores";
import useSecciones from "./Hook/useSecciones";
import useEstudiantesPorSeccion from "./Hook/useEstudiantesPorSeccion";

export const AsistenciaEst = () => {

  const { grados } = useGrados();
  const { materias } = useMaterias();
  const { profesores } = useProfesores();

  const [formData, setFormData] = useState({
    fecha: '',
    id_Materia: '',
    id_grado: '',
    id_Seccion: '',
    id_Profesor: '',
  });

  const { secciones, loading: loadingSecciones } = useSecciones(formData.id_grado);
  const { estudiantes, setEstudiantes, loading: loadingEstudiantes } = useEstudiantesPorSeccion(formData.id_Seccion);
  const { handleCrearAsistencias, loading, error } = useCrearAsistencia();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (e.target.name === 'id_grado') {
      setFormData((prevData) => ({ ...prevData, id_Seccion: '' }));
      setEstudiantes([]);
    }

    if (e.target.name === 'id_Seccion') {
      setEstudiantes([]);
    }
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
    }));

    await handleCrearAsistencias(asistenciasData);

    // Mostrar prompt de éxito y limpiar el formulario
    window.alert("¡Asistencia creada exitosamente!");

    setFormData({
      fecha: '',
      id_Materia: '',
      id_grado: '',
      id_Seccion: '',
      id_Profesor: '',
    });
    setEstudiantes([]);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Registrar Asistencia</h2>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        {error && <p className="text-red-500">{error}</p>}
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
                  {profesor.nombre_Profesor}
                </option>
              ))}
            </select>
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
                    <td className="border px-4 py-2">{estudiante.nombre_Estudiante} {estudiante.apellido1_Estudiante}</td>
                    <td className="border px-4 py-2">
                      <select
                        value={estudiante.estado}
                        onChange={(e) =>
                          handleEstadoChange(estudiante.id_Estudiante, e.target.value)
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
          {loading ? 'Guardando...' : 'Guardar Asistencia'}
        </button>
      </form>
    </div>
  );
}
