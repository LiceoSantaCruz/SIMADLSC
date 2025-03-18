import { useState } from "react";
import { useAsignarSeccion } from "../Hooks/useAsignarSeccion";

// Mapeo de número a texto
const nivelMap = {
  7: "Sétimo",
  8: "Octavo",
  9: "Noveno",
  10: "Décimo",
  11: "Undécimo",
};

function normalizarNivel(valor) {
  const num = parseInt(valor, 10);
  if (!isNaN(num)) {
    return num;
  }
  switch (valor) {
    case "Séptimo":   return 7;
    case "Octavo":    return 8;
    case "Noveno":    return 9;
    case "Décimo":    return 10;
    case "Undécimo":  return 11;
    default:
      return 7;
  }
}

import Swal from 'sweetalert2';
import '@sweetalert2/theme-bulma/bulma.css';

export default function AsignaSeccionPage() {
  const { matriculas, secciones, loading, error, onAssignSeccion } = useAsignarSeccion();
  const [selectedMatriculas, setSelectedMatriculas] = useState([]);
  const [selectedSeccion, setSelectedSeccion] = useState("");
  const [selectedNivel, setSelectedNivel] = useState("");
  const [searchName, setSearchName] = useState("");

  if (loading) return <p className="text-center text-xl">Cargando datos...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  const uniqueNiveles = [
    ...new Set(matriculas.map((mat) => normalizarNivel(mat.estudiante.grado.nivel))),
  ].filter((nivel) => nivel >= 7 && nivel <= 11);

  const filteredMatriculas = matriculas.filter((mat) => {
    const nivelNum = normalizarNivel(mat.estudiante.grado.nivel);
    return (
      mat.estado_Matricula === "AC" &&
      !mat.seccion &&
      (selectedNivel === "" || nivelNum === parseInt(selectedNivel, 10)) &&
      (searchName === "" ||
        mat.estudiante.nombre_Estudiante.toLowerCase().includes(searchName.toLowerCase()) ||
        mat.estudiante.apellido1_Estudiante.toLowerCase().includes(searchName.toLowerCase()))
    );
  });

  const filteredSecciones = selectedMatriculas.length
    ? secciones.filter((sec) => sec.gradoId === selectedMatriculas[0].estudiante.grado.id_grado)
    : secciones;

  const toggleSelect = (mat) => {
    const exists = selectedMatriculas.some((m) => m.id_Matricula === mat.id_Matricula);
    if (exists) {
      setSelectedMatriculas((prev) =>
        prev.filter((m) => m.id_Matricula !== mat.id_Matricula)
      );
    } else {
      if (selectedMatriculas.length > 0) {
        const currentGrado = selectedMatriculas[0].estudiante.grado.id_grado;
        if (mat.estudiante.grado.id_grado !== currentGrado) {
          Swal.fire({
            icon: 'warning',
            title: 'Advertencia',
            text: 'Todas las matrículas deben tener el mismo nivel.',
            confirmButtonColor: '#2563EB',
          });
          return;
        }
      }
      setSelectedMatriculas((prev) => [...prev, mat]);
    }
  };

  const handleAsignar = () => {
    if (!selectedSeccion) {
      Swal.fire({
        icon: 'warning',
        title: 'Advertencia',
        text: 'Seleccione una sección primero.',
        confirmButtonColor: '#2563EB',
      });
      return;
    }
    if (selectedMatriculas.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Advertencia',
        text: 'Seleccione al menos una matrícula.',
        confirmButtonColor: '#2563EB',
      });
      return;
    }
    Swal.fire({
      icon: 'question',
      title: 'Confirmar Asignación',
      text: `¿Está seguro de asignar la sección #${selectedSeccion} a las matrículas seleccionadas?`,
      showCancelButton: true,
      confirmButtonText: 'Sí, asignar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#2563EB',
    }).then((result) => {
      if (result.isConfirmed) {
        confirmAsignar();
      }
    });
  };

  const confirmAsignar = async () => {
    try {
      const ids = selectedMatriculas.map((m) => m.id_Matricula);
      await onAssignSeccion(Number(selectedSeccion), ids);
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: '¡Sección asignada correctamente!',
        confirmButtonColor: '#2563EB',
      });
      setSelectedMatriculas([]);
      setSelectedSeccion("");
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al asignar la sección: ' + err.message,
        confirmButtonColor: '#2563EB',
      });
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

        {/* FILTROS */}
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
              filteredMatriculas.map((mat) => {
                const nivelNum = normalizarNivel(mat.estudiante.grado.nivel);
                return (
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
                        Boleta #{mat.id_Matricula} - {mat.estudiante.nombre_Estudiante} {mat.estudiante.apellido1_Estudiante}
                      </p>
                      <p className="text-sm text-gray-500">
                        Nivel: {nivelMap[nivelNum]}
                      </p>
                    </div>
                  </label>
                );
              })
            )}
          </div>
        </div>

        {/* SELECCIÓN DE SECCIÓN */}
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

        {/* BOTÓN PARA ASIGNAR */}
        <button
          onClick={handleAsignar}
          className="w-full bg-green-500 text-white font-semibold py-3 rounded-lg hover:bg-green-600 transition-colors"
        >
          Asignar Sección
        </button>
      </div>
    </div>
  );
}
