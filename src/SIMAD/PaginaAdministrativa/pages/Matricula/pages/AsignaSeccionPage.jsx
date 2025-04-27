// src/SIMAD/PaginaAdministrativa/pages/Matricula/pages/AsignaSeccionPage.jsx
import { useState, useEffect } from "react";
import { useAsignarSeccion } from "../Hooks/useAsignarSeccion";
import Swal from 'sweetalert2';
import '@sweetalert2/theme-bulma/bulma.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const nivelMap = {
  7: "Séptimo",
  8: "Octavo",
  9: "Noveno",
  10: "Décimo",
  11: "Undécimo",
};

function normalizarNivel(valor) {
  const num = parseInt(valor, 10);
  if (!isNaN(num)) return num;
  switch (valor) {
    case "Séptimo": return 7;
    case "Octavo":  return 8;
    case "Noveno":  return 9;
    case "Décimo":  return 10;
    case "Undécimo":return 11;
    default:         return 7;
  }
}

export default function AsignaSeccionPage() {
  const { matriculas, secciones, loading, error, onAssignSeccion, onGraduateUndecimo } = useAsignarSeccion();

  const [selectedMatriculas, setSelectedMatriculas] = useState([]);
  const [selectedNivel, setSelectedNivel] = useState("");
  const [selectedSeccion, setSelectedSeccion] = useState("");
  const [searchName, setSearchName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => setCurrentPage(1), [selectedNivel, searchName]);

  if (loading) return <p className="text-center text-2xl py-6">Cargando datos...</p>;
  if (error)   return <p className="text-center text-red-600 text-2xl py-6">Error: {error}</p>;

  const uniqueNiveles = [...new Set(
    matriculas.map(mat => normalizarNivel(mat.estudiante.grado.nivel))
  )].filter(n => n >= 7 && n <= 11);

  const filteredMatriculas = matriculas.filter(mat => {
    const nivelNum = normalizarNivel(mat.estudiante.grado.nivel);
    return (
      mat.estado_Matricula === 'AC' &&
      (selectedNivel === '' || nivelNum === +selectedNivel) &&
      (searchName === '' ||
        mat.estudiante.nombre_Estudiante.toLowerCase().includes(searchName.toLowerCase()) ||
        mat.estudiante.apellido1_Estudiante.toLowerCase().includes(searchName.toLowerCase())
      )
    );
  });

  const filteredSecciones = secciones.filter(sec =>
    selectedMatriculas.length > 0
      ? sec.gradoId === selectedMatriculas[0].estudiante.grado.id_grado
      : true
  );

  const totalItems = filteredMatriculas.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentMatriculas = filteredMatriculas.slice(indexOfFirst, indexOfLast);

  const maxButtons = 6;
  let startPage = 1;
  let endPage = totalPages;
  if (totalPages > maxButtons) {
    const half = Math.floor(maxButtons / 2);
    if (currentPage <= half) {
      endPage = maxButtons;
    } else if (currentPage + half >= totalPages) {
      startPage = totalPages - maxButtons + 1;
    } else {
      startPage = currentPage - half;
      endPage = currentPage + half;
    }
  }

  const toggleSelect = mat => {
    if (selectedMatriculas.some(m => m.id_Matricula === mat.id_Matricula)) {
      setSelectedMatriculas(prev => prev.filter(m => m.id_Matricula !== mat.id_Matricula));
    } else {
      if (selectedMatriculas.length > 0 && mat.estudiante.grado.id_grado !== selectedMatriculas[0].estudiante.grado.id_grado) {
        Swal.fire({ icon: 'warning', title: 'Advertencia', text: 'Todas las matrículas deben ser del mismo nivel.', confirmButtonColor: '#2563EB' });
        return;
      }
      setSelectedMatriculas(prev => [...prev, mat]);
    }
  };

  const handleGraduate = () => {
    Swal.fire({
      icon: 'question',
      title: 'Confirmar Graduación',
      text: '¿Deseas graduar a todos los estudiantes de Undécimo?',
      showCancelButton: true,
      confirmButtonText: 'Sí, graduar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#2563EB'
    }).then(res => {
      if (res.isConfirmed) {
        onGraduateUndecimo()
          .then(result => Swal.fire({
            icon: 'success',
            title: 'Graduación completada',
            text: `Se graduaron ${result.length} estudiantes.`,
            confirmButtonColor: '#2563EB'
          }))
          .then(() => window.location.reload())
          .catch(err => Swal.fire({ icon: 'error', title: 'Error', text: err.message, confirmButtonColor: '#EF4444' }));
      }
    });
  };

  const handleAsignar = () => {
    if (!selectedSeccion) {
      return Swal.fire({ icon: 'warning', title: 'Advertencia', text: 'Seleccione una sección.', confirmButtonColor: '#2563EB' });
    }
    if (selectedMatriculas.length === 0) {
      return Swal.fire({ icon: 'warning', title: 'Advertencia', text: 'Seleccione al menos un estudiante.', confirmButtonColor: '#2563EB' });
    }
    // Obtener nombre de la sección seleccionada
    const secObj = secciones.find(sec => sec.id_Seccion === +selectedSeccion);
    const secName = secObj ? secObj.nombre_Seccion : selectedSeccion;

    Swal.fire({
      icon: 'question',
      title: 'Confirmar Asignación',
      text: `Asignar sección ${secName} a ${selectedMatriculas.length} estudiante(s)?`,
      showCancelButton: true,
      confirmButtonText: 'Sí, asignar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#2563EB'
    }).then(res => res.isConfirmed && confirmAsignar());
  };

  const confirmAsignar = async () => {
    try {
      await onAssignSeccion(+selectedSeccion, selectedMatriculas.map(m => m.id_Matricula));
      Swal.fire({ icon: 'success', title: 'Éxito', text: 'Sección asignada.', confirmButtonColor: '#2563EB' });
      setSelectedMatriculas([]); setSelectedSeccion(''); setSearchName(''); setSelectedNivel(''); setCurrentPage(1);
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.message, confirmButtonColor: '#2563EB' });
    }
  };

  return (
    <div className="w-full mx-auto px-12 py-10">
      <div className="bg-white dark:bg-gray-900 shadow-xl rounded-lg p-10">
        <div className="flex justify-end mb-6">
          <button onClick={handleGraduate} className="py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded">Pasar Graduados</button>
        </div>
        <h1 className="text-3xl font-semibold text-center text-gray-900 dark:text-white mb-6">Asignar Sección</h1>
        <p className="text-center text-gray-700 dark:text-gray-300 mb-8">Página {currentPage} de {totalPages}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <label className="block mb-2 text-sm text-gray-700 dark:text-gray-200">Nivel</label>
            <select value={selectedNivel} onChange={e => setSelectedNivel(e.target.value)} className="w-full p-3 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
              <option value="">Todos los niveles</option>
              {uniqueNiveles.map(n => <option key={n} value={n}>{nivelMap[n]}</option>)}
            </select>
          </div>
          <div>
            <label className="block mb-2 text-sm text-gray-700 dark:text-gray-200">Buscar</label>
            <input type="text" placeholder="Nombre..." value={searchName} onChange={e => setSearchName(e.target.value)} className="w-full p-3 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"/>
          </div>
          <div>
            <label className="block mb-2 text-sm text-gray-700 dark:text-gray-200">Sección a asignar</label>
            <select value={selectedSeccion} onChange={e => setSelectedSeccion(e.target.value)} className="w-full p-3 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
              <option value="">Seleccione una sección</option>
              {filteredSecciones.map(sec => <option key={sec.id_Seccion} value={sec.id_Seccion}>{sec.nombre_Seccion}</option>)}
            </select>
          </div>
        </div>
        <div className="overflow-y-auto border border-gray-200 dark:border-gray-700 rounded p-4 mb-6" style={{ maxHeight: '350px' }}>
          {currentMatriculas.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">No hay estudiantes disponibles.</p>
          ) : (
            <ul className="space-y-2">
              {currentMatriculas.map(mat => {
                const nivelNum = normalizarNivel(mat.estudiante.grado.nivel);
                const sel = selectedMatriculas.some(m => m.id_Matricula === mat.id_Matricula);
                return (
                  <li key={mat.id_Matricula} onClick={() => toggleSelect(mat)} className={`flex items-start p-3 rounded-lg cursor-pointer transition-colors ${sel ? 'bg-blue-50 dark:bg-blue-900' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}> 
                    <input type="checkbox" checked={sel} readOnly className="mr-3 mt-1 w-5 h-5"/>
                    <div>
                      <p className="text-base font-medium text-gray-900 dark:text-white">{mat.estudiante.nombre_Estudiante} {mat.estudiante.apellido1_Estudiante} {mat.estudiante.apellido2_Estudiante || ''}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Cédula: {mat.estudiante.cedula} | Nivel: {nivelMap[nivelNum]} | Edad: {mat.estudiante.edad} | Sección: {mat.seccion ? mat.seccion.nombre_Seccion : 'Sin sección'}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <div className="flex justify-center items-center space-x-2 mb-6">
          <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="p-2 rounded bg-gray-200 dark:bg-gray-600 disabled:opacity-50">
            <ChevronLeft className="w-4 h-4 text-gray-700 dark:text-white" />
          </button>
          {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(page => (
            <button key={page} onClick={() => setCurrentPage(page)} className={`w-8 h-8 flex justify-center items-center rounded text-sm ${page === currentPage ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-500'}`}>{page}</button>
          ))}
          <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="p-2 rounded bg-gray-200 dark:bg-gray-600 disabled:opacity-50">
            <ChevronRight className="w-4 h-4 text-gray-700 dark:text-white" />
          </button>
        </div>
        <button onClick={handleAsignar} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded">Asignar Sección</button>
      </div>
    </div>
  );
}
