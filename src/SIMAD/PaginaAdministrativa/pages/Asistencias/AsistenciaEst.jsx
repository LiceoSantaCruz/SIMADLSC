// src/components/AsistenciaEst.jsx

import { useState } from "react"
import useProfesores from "./Hook/useProfesores"
import useGrados from "./Hook/useGrados"
import useSecciones from "./Hook/useSecciones"
import useMaterias from "./Hook/useMaterias"
import useCrearAsistencia from "./Hook/useCrearAsistencia"
import useEstudiantesPorSeccion from "./Hook/useEstudiantesPorSeccion"
import { usePeriodos } from "./Hook/usePeriodos"
import Swal from "sweetalert2"
import "@sweetalert2/theme-bulma/bulma.css"

export const AsistenciaEst = () => {
  // 1. Rol y materias en localStorage
  const role = localStorage.getItem("role")
  const materiaLocalStorage = localStorage.getItem("materia")

  // 2. Hooks de datos
  const { grados } = useGrados()
  const { materias } = useMaterias()
  const {
    profesores,
    loading: loadingProfesores,
    selectedProfesor,
    setSelectedProfesor,
  } = useProfesores()
  const { periodos } = usePeriodos()

  // 3. Filtrar materias si es profesor
  let materiaIds = []
  if (role === "profesor" && materiaLocalStorage) {
    try {
      const parsed = JSON.parse(materiaLocalStorage)
      materiaIds = Array.isArray(parsed) ? parsed.map(Number) : [Number(parsed)]
    } catch {
      materiaIds = materiaLocalStorage.split(",").map((id) => Number(id.trim()))
    }
  }
  const filteredMaterias =
    role === "profesor"
      ? materias.filter((m) => materiaIds.includes(m.id_Materia))
      : materias

  // 4. Estado del formulario (sin id_Profesor aquí)
  const [formData, setFormData] = useState({
    fecha: "",
    id_Materia: "",
    id_grado: "",
    id_Seccion: "",
    id_Periodo: "",
    lecciones: [],
  })

  const { secciones, loading: loadingSecciones } = useSecciones(formData.id_grado)
  const {
    estudiantes,
    setEstudiantes,
    loading: loadingEstudiantes,
  } = useEstudiantesPorSeccion(formData.id_Seccion)
  const { handleCrearAsistencias, loading: loadingCrear } = useCrearAsistencia()

  // 5. Validar fin de semana
  const isWeekend = (dateStr) => {
    if (!dateStr) return false
    const [y, m, d] = dateStr.split("-").map(Number)
    const day = new Date(y, m - 1, d).getDay()
    return day === 0 || day === 6
  }

  // 6. Handlers de formulario
  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === "fecha" && isWeekend(value)) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pueden seleccionar sábados ni domingos.",
        confirmButtonColor: "#2563EB",
      })
      return setFormData((prev) => ({ ...prev, fecha: "" }))
    }

    setFormData((prev) => ({ ...prev, [name]: value }))

    if (name === "id_grado") {
      setFormData((prev) => ({ ...prev, id_Seccion: "" }))
      setEstudiantes([])
    }
    if (name === "id_Seccion") {
      setEstudiantes([])
    }
  }

  const handleLeccionToggle = (lec) => {
    setFormData((prev) => {
      const lecciones = prev.lecciones.includes(lec)
        ? prev.lecciones.filter((l) => l !== lec)
        : [...prev.lecciones, lec]
      return { ...prev, lecciones }
    })
  }

  const handleEstadoChange = (id_Estudiante, estado) => {
    setEstudiantes((prev) =>
      prev.map((e) =>
        e.id_Estudiante === id_Estudiante ? { ...e, estado } : e
      )
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Validaciones
    if (!formData.fecha) {
      return Swal.fire({
        icon: "warning",
        title: "Advertencia",
        text: "Selecciona una fecha.",
        confirmButtonColor: "#2563EB",
      })
    }
    if (!formData.id_Materia) {
      return Swal.fire({
        icon: "warning",
        title: "Advertencia",
        text: "Selecciona una materia.",
        confirmButtonColor: "#2563EB",
      })
    }
    if (!formData.id_grado) {
      return Swal.fire({
        icon: "warning",
        title: "Advertencia",
        text: "Selecciona un grado.",
        confirmButtonColor: "#2563EB",
      })
    }
    if (!formData.id_Seccion) {
      return Swal.fire({
        icon: "warning",
        title: "Advertencia",
        text: "Selecciona una sección.",
        confirmButtonColor: "#2563EB",
      })
    }
    if (!selectedProfesor) {
      return Swal.fire({
        icon: "warning",
        title: "Advertencia",
        text: "Selecciona un profesor.",
        confirmButtonColor: "#2563EB",
      })
    }
    if (!formData.id_Periodo) {
      return Swal.fire({
        icon: "warning",
        title: "Advertencia",
        text: "Selecciona un periodo.",
        confirmButtonColor: "#2563EB",
      })
    }
    if (formData.lecciones.length === 0) {
      return Swal.fire({
        icon: "warning",
        title: "Advertencia",
        text: "Selecciona al menos una lección.",
        confirmButtonColor: "#2563EB",
      })
    }

    // Prepara datos
    const payload = estudiantes.map((est) => ({
      fecha: formData.fecha,
      estado: est.estado,
      id_Estudiante: est.id_Estudiante,
      id_Materia: formData.id_Materia,
      id_grado: formData.id_grado,
      id_Seccion: formData.id_Seccion,
      id_Profesor: Number(selectedProfesor),
      id_Periodo: formData.id_Periodo,
      lecciones: formData.lecciones,
    }))

    try {
      await handleCrearAsistencias(payload)
      Swal.fire({
        icon: "success",
        title: "¡Asistencia creada!",
        confirmButtonColor: "#2563EB",
      })
      // Limpia formulario
      setFormData({
        fecha: "",
        id_Materia: "",
        id_grado: "",
        id_Seccion: "",
        id_Periodo: "",
        lecciones: [],
      })
      setSelectedProfesor(role === "profesor" ? selectedProfesor : "")
      setEstudiantes([])
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.error || "No se pudo crear asistencia",
        confirmButtonColor: "#2563EB",
      })
    }
  }

  // 7. Render
  return (
    <div className="container mx-auto p-4 text-gray-900 dark:text-gray-100">
      <h2 className="text-2xl font-semibold mb-4">Registrar Asistencia</h2>
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-900 p-6 rounded shadow-md"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Fecha */}
          <div>
            <label className="block mb-2">Fecha:</label>
            <input
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-white dark:bg-gray-800"
            />
          </div>

          {/* Grado */}
          <div>
            <label className="block mb-2">Grado:</label>
            <select
              name="id_grado"
              value={formData.id_grado}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-white dark:bg-gray-800"
            >
              <option value="">Seleccionar Grado</option>
              {grados.map((g) => (
                <option key={g.id_grado} value={g.id_grado}>
                  {g.nivel}
                </option>
              ))}
            </select>
          </div>

          {/* Sección */}
          <div>
            <label className="block mb-2">Sección:</label>
            <select
              name="id_Seccion"
              value={formData.id_Seccion}
              onChange={handleChange}
              disabled={!formData.id_grado}
              className="w-full p-2 border rounded bg-white dark:bg-gray-800"
            >
              <option value="">Seleccionar Sección</option>
              {loadingSecciones ? (
                <option>Cargando...</option>
              ) : (
                secciones.map((s) => (
                  <option key={s.id_Seccion} value={s.id_Seccion}>
                    {s.nombre_Seccion}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Materia */}
          <div>
            <label className="block mb-2">Materia:</label>
            <select
              name="id_Materia"
              value={formData.id_Materia}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-white dark:bg-gray-800"
            >
              <option value="">Seleccionar Materia</option>
              {filteredMaterias.map((m) => (
                <option key={m.id_Materia} value={m.id_Materia}>
                  {m.nombre_Materia}
                </option>
              ))}
            </select>
          </div>

          {/* Profesor */}
          <div>
            <label className="block mb-2">Profesor:</label>
            <select
              name="id_Profesor"
              value={selectedProfesor}
              onChange={(e) => setSelectedProfesor(e.target.value)}  
              disabled={role === "profesor"}
              className="w-full p-2 border rounded bg-white dark:bg-gray-800"
            >
              <option value="">Seleccionar Profesor</option>
              {(role === "profesor"
                ? profesores.filter((p) => String(p.id_Profesor) === selectedProfesor)
                : profesores
              ).map((p) => (
                <option key={p.id_Profesor} value={String(p.id_Profesor)}>
                  {p.nombre_Profesor} {p.apellido1_Profesor}
                </option>
              ))}
            </select>
          </div>

          {/* Periodo */}
          <div>
            <label className="block mb-2">Periodo:</label>
            <select
              name="id_Periodo"
              value={formData.id_Periodo}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-white dark:bg-gray-800"
            >
              <option value="">Seleccionar Periodo</option>
              {periodos.map((p) => (
                <option key={p.id_Periodo} value={p.id_Periodo}>
                  {p.nombre_Periodo}
                </option>
              ))}
            </select>
          </div>

          {/* Lecciones */}
          <div className="col-span-2">
            <label className="block mb-2">Lecciones:</label>
            <div className="grid grid-cols-6 gap-2">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                <label key={n} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.lecciones.includes(n)}
                    onChange={() => handleLeccionToggle(n)}
                    className="form-checkbox"
                  />
                  <span>Lección {n}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Lista de Estudiantes */}
        <h3 className="text-xl font-semibold mt-6 mb-4">Estudiantes</h3>
        <div className="overflow-x-auto">
          {loadingEstudiantes ? (
            <p>Cargando estudiantes...</p>
          ) : (
            <table className="min-w-full bg-white dark:bg-gray-800 border">
              <thead>
                <tr>
                  <th className="px-4 py-2">Nombre</th>
                  <th className="px-4 py-2">Estado</th>
                </tr>
              </thead>
              <tbody>
                {estudiantes.map((est) => (
                  <tr key={est.id_Estudiante}>
                    <td className="border px-4 py-2">
                      {est.nombre_Estudiante} {est.apellido1_Estudiante}
                    </td>
                    <td className="border px-4 py-2">
                      <select
                        value={est.estado}
                        onChange={(e) =>
                          handleEstadoChange(est.id_Estudiante, e.target.value)
                        }
                        className="w-full p-1 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      >
                        <option value="P">Presente</option>
                        <option value="A">Ausente</option>
                        <option value="E">Escapado</option>
                        <option value="T">Tardía</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Botón Guardar */}
        <button
          type="submit"
          disabled={loadingCrear}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loadingCrear ? "Guardando..." : "Guardar Asistencia"}
        </button>
      </form>
    </div>
  )
}
