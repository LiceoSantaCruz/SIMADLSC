import { useState } from "react";
import { useAsignarSeccion } from "../Hooks/useAsignarSeccion";
import { ConfirmModal } from "../components/ConfirmModalMatricula";
import { AlertModal } from "../components/AlertModalMatricula";

const nivelMap = {
  7: "Séptimo",
  8: "Octavo",
  9: "Noveno",
  10: "Décimo",
  11: "Undécimo",
};

export default function AsignaSeccionPage() {
  const { matriculas, secciones, loading, error, onAssignSeccion } = useAsignarSeccion();
  const [selectedMatriculas, setSelectedMatriculas] = useState([]);
  const [selectedSeccion, setSelectedSeccion] = useState("");
  const [selectedNivel, setSelectedNivel] = useState("");
  const [searchName, setSearchName] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  if (loading) return <p className="text-center text-xl">Cargando datos...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  const uniqueNiveles = [
    ...new Set(matriculas.map((mat) => parseInt(mat.estudiante.grado.nivel, 10)))
  ].filter(nivel => nivel >= 7 && nivel <= 11);
  
  const filteredMatriculas = matriculas.filter(
    (mat) =>
      mat.estado_Matricula === "AC" &&
      !mat.seccion &&
      (selectedNivel === "" || parseInt(mat.estudiante.grado.nivel, 10) === parseInt(selectedNivel, 10)) &&
      (searchName === "" ||
        mat.estudiante.nombre_Estudiante.toLowerCase().includes(searchName.toLowerCase()) ||
        mat.estudiante.apellido1_Estudiante.toLowerCase().includes(searchName.toLowerCase()))
  );

  const filteredSecciones = selectedMatriculas.length
    ? secciones.filter(
        (sec) => sec.gradoId === selectedMatriculas[0].estudiante.grado.id_grado
      )
    : secciones;

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
          alert("Todas las matrículas deben tener el mismo nivel.");
          return;
        }
      }
      setSelectedMatriculas((prev) => [...prev, mat]);
    }
  };

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

  const confirmAsignar = async () => {
    setConfirmOpen(false);
    try {
      const ids = selectedMatriculas.map((m) => m.id_Matricula);
      await onAssignSeccion(Number(selectedSeccion), ids);
      setAlertMessage("¡Sección asignada correctamente!");
      setAlertOpen(true);
      setSelectedMatriculas([]);
      setSelectedSeccion("");
    } catch (err) {
      setAlertMessage("Error al asignar la sección: " + err.message);
      setAlertOpen(true);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-3xl font-bold mb-2 text-gray-800">
          Asignar Sección a Matrículas Aceptadas
        </h2>
        <p className="text-gray-600 mb-6">
          Seleccione una o varias matrículas (todas con el mismo nivel) y elija la sección.
        </p>

        <div className="mb-6">
          <label className="block text-lg font-semibold mb-2">Filtrar por Nivel</label>
          <select
            className="w-full border rounded-lg p-3 mb-4"
            value={selectedNivel}
            onChange={(e) => setSelectedNivel(e.target.value)}
          >
            <option value="">Todos los Niveles</option>
            {uniqueNiveles.map((nivel) => (
              <option key={nivel} value={nivel}>
                {nivelMap[nivel]}
              </option>
            ))}
          </select>

          <label className="block text-lg font-semibold mb-2">Filtrar por Nombre</label>
          <input
            type="text"
            className="w-full border rounded-lg p-3 mb-4"
            placeholder="Buscar por nombre o apellido"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />

          <h3 className="text-xl font-semibold mb-2">Matrículas Sin Sección</h3>
          <div className="border rounded-lg p-4 max-h-80 overflow-y-auto">
            {filteredMatriculas.length === 0 ? (
              <p className="text-gray-500 text-center">No hay matrículas aceptadas.</p>
            ) : (
              filteredMatriculas.map((mat) => (
                <label
                  key={mat.id_Matricula}
                  className="flex items-center p-2 hover:bg-gray-50 rounded-md mb-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedMatriculas.some(
                      (m) => m.id_Matricula === mat.id_Matricula
                    )}
                    onChange={() => toggleSelect(mat)}
                    className="mr-3"
                  />
                  <div>
                    <p className="font-semibold text-gray-700">
                      Boleta #{mat.id_Matricula} - {mat.estudiante.nombre_Estudiante}{" "}
                      {mat.estudiante.apellido1_Estudiante}
                    </p>
                    <p className="text-sm text-gray-500">
                      Nivel: {nivelMap[mat.estudiante.grado.nivel]}
                    </p>
                  </div>
                </label>
              ))
            )}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-lg font-semibold mb-2">Seleccione Sección</label>
          <select
            className="w-full border rounded-lg p-3"
            value={selectedSeccion}
            onChange={(e) => setSelectedSeccion(e.target.value)}
          >
            <option value="">Seleccione Sección</option>
            {filteredSecciones.map((sec) => (
              <option key={sec.id_Seccion} value={sec.id_Seccion}>
                {sec.nombre_Seccion} (Nivel {nivelMap[sec.gradoId]})
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleAsignar}
          className="w-full bg-green-500 text-white font-semibold py-3 rounded-lg hover:bg-green-600 transition-colors"
        >
          Asignar Sección
        </button>
      </div>

      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmAsignar}
        title="Confirmar Asignación"
        message={`¿Está seguro de asignar la sección #${selectedSeccion} a las matrículas seleccionadas?`}
      />

      <AlertModal
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        title="Resultado"
        message={alertMessage}
      />
    </div>
  );
}