import { useState } from "react";
import { useAsignarSeccion } from "../Hooks/useAsignarSeccion";
import { ConfirmModal } from "../components/ConfirmModalMatricula";
import { AlertModal } from "../components/AlertModalMatricula";


export default function AsignaSeccionPage() {
  const { matriculas, secciones, loading, error, onAssignSeccion } = useAsignarSeccion();
  const [selectedMatriculas, setSelectedMatriculas] = useState([]);
  const [selectedSeccion, setSelectedSeccion] = useState("");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // Si está cargando o hay error, se muestran mensajes
  if (loading) return <p>Cargando datos...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  // Filtrar las matrículas aceptadas y sin sección asignada
  const filteredMatriculas = matriculas.filter(
    (mat) => mat.estado_Matricula === "AC" && !mat.seccion
  );

  // Filtra las secciones según el grado de la primera matrícula seleccionada
  const filteredSecciones = selectedMatriculas.length
    ? secciones.filter(
        (sec) => sec.gradoId === selectedMatriculas[0].estudiante.grado.id_grado
      )
    : secciones;

  // Permite agregar/quitar matrícula de la selección. Todas deben tener el mismo grado.
  const toggleSelect = (mat) => {
    const exists = selectedMatriculas.some(
      (m) => m.id_Matricula === mat.id_Matricula
    );
    if (exists) {
      setSelectedMatriculas((prev) =>
        prev.filter((m) => m.id_Matricula !== mat.id_Matricula)
      );
    } else {
      if (selectedMatriculas.length > 0) {
        const currentGrado = selectedMatriculas[0].estudiante.grado.id_grado;
        if (mat.estudiante.grado.id_grado !== currentGrado) {
          alert("Todas las matrículas deben tener el mismo grado.");
          return;
        }
      }
      setSelectedMatriculas((prev) => [...prev, mat]);
    }
  };

  // Abre el modal de confirmación
  const handleAsignar = () => {
    if (!selectedSeccion) {
      alert("Seleccione una sección primero.");
      return;
    }
    if (selectedMatriculas.length === 0) {
      alert("Seleccione al menos una matrícula.");
      return;
    }
    setConfirmOpen(true);
  };

  // Confirma la asignación
  const confirmAsignar = async () => {
    setConfirmOpen(false);
    try {
      const ids = selectedMatriculas.map((m) => m.id_Matricula);
      await onAssignSeccion(Number(selectedSeccion), ids);

      // Después de la asignación, eliminamos las matrículas asignadas de la lista
      setAlertMessage("¡Sección asignada correctamente!");
      setAlertOpen(true);
      setSelectedMatriculas([]); // Limpiar selección
      setSelectedSeccion("");
    } catch (err) {
      setAlertMessage("Error al asignar la sección: " + err.message);
      setAlertOpen(true);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">
        Asignar Sección a Matrículas Aceptadas
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        Seleccione una o varias matrículas (todas con el mismo grado) y elija la
        sección.
      </p>

      {/* Lista de matrículas aceptadas sin sección asignada */}
      <div className="border p-2 mb-4 max-h-64 overflow-y-auto">
        {filteredMatriculas.length === 0 ? (
          <p className="text-gray-500">No hay matrículas aceptadas.</p>
        ) : (
          filteredMatriculas.map((mat) => (
            <label key={mat.id_Matricula} className="flex items-center mb-1">
              <input
                type="checkbox"
                checked={selectedMatriculas.some(
                  (m) => m.id_Matricula === mat.id_Matricula
                )}
                onChange={() => toggleSelect(mat)}
                className="mr-2"
              />
              <span>
                <strong>Boleta #{mat.id_Matricula}</strong> - Estudiante:{" "}
                {mat.estudiante.nombre_Estudiante}{" "}
                {mat.estudiante.apellido1_Estudiante} (Grado:{" "}
                {mat.estudiante.grado.nivel})
              </span>
            </label>
          ))
        )}
      </div>

      {/* Select de secciones filtradas */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">Sección:</label>
        <select
          className="border p-2 rounded w-full"
          value={selectedSeccion}
          onChange={(e) => setSelectedSeccion(e.target.value)}
        >
          <option value="">-- Seleccione Sección --</option>
          {filteredSecciones.map((sec) => (
            <option key={sec.id_Seccion} value={sec.id_Seccion}>
              {sec.nombre_Seccion} (Grado {sec.gradoId})
            </option>
          ))}
        </select>
      </div>

      {/* Botón para asignar */}
      <button
        onClick={handleAsignar}
        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
      >
        Asignar Sección
      </button>

      {/* Modal de confirmación */}
      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmAsignar}
        title="Confirmar Asignación"
        message={`¿Está seguro de asignar la sección #${selectedSeccion} a las matrículas seleccionadas?`}
      />

      {/* Modal de alerta */}
      <AlertModal
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        title="Resultado"
        message={alertMessage}
      />
    </div>
  );
}
