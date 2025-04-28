import PropTypes from 'prop-types';
import { useState } from "react";
import { useGestionMatriculas } from "../Hooks/useGestionMatriculas";
import Swal from "sweetalert2";
import "@sweetalert2/theme-bulma/bulma.css";

// Modal con pestañas para detalles
function InfoModal({ matricula, onClose }) {
  const [activeTab, setActiveTab] = useState("estudiante");
  const adecMap = { N: "No presenta", DA: "Adecuación de Acceso", S: "Adecuación Significativa", NS: "Adecuación No Significativa" };
  const stu = matricula.estudiante || {};
  const enc = matricula.encargadoLegal || {};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-11/12 max-w-4xl p-8 relative">
        <button onClick={onClose}
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Detalles de Matrícula</h2>
        <div className="mb-6 border-b border-gray-300 dark:border-gray-600">
          <nav className="flex space-x-6">
            <button onClick={() => setActiveTab('estudiante')}
              className={`pb-2 font-semibold ${activeTab==='estudiante'?'border-b-2 border-blue-500 text-blue-500':'text-gray-600 dark:text-gray-300 hover:text-gray-800'}`}>
              Estudiante
            </button>
            <button onClick={() => setActiveTab('encargado')}
              className={`pb-2 font-semibold ${activeTab==='encargado'?'border-b-2 border-blue-500 text-blue-500':'text-gray-600 dark:text-gray-300 hover:text-gray-800'}`}>
              Encargado Legal
            </button>
          </nav>
        </div>
        {activeTab==='estudiante' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <p><strong>Nombre:</strong> {stu.nombre_Estudiante}</p>
              <p><strong>Apellidos:</strong> {stu.apellido1_Estudiante} {stu.apellido2_Estudiante}</p>
              <p><strong>Cédula:</strong> {stu.cedula}</p>
              <p><strong>Teléfono:</strong> {stu.telefono||'N/A'}</p>
              <p><strong>Correo:</strong> {stu.correo_estudiantil||'N/A'}</p>
              <p><strong>Fecha Nac.:</strong> {stu.fecha_nacimiento||'N/A'}</p>
              <p><strong>Sexo:</strong> {stu.sexo}</p>
              <p><strong>Lugar Nac.:</strong> {stu.lugar_de_nacimiento}</p>
              <p><strong>Nacionalidad:</strong> {stu.nacionalidad}</p>
            </div>
            <div className="space-y-3">
              <p><strong>Repite materia:</strong> {stu.Repite_alguna_materia||'Ninguna'}</p>
              <p><strong>Institución:</strong> {stu.institucion_de_procedencia||'N/A'}</p>
              <p><strong>Enfermedad:</strong> {stu.Presenta_alguna_enfermedad||'Ninguna'}</p>
              <p><strong>Medicamentos:</strong> {stu.medicamentos_que_debe_tomar||'Ninguno'}</p>
              <p><strong>Ruta de Viaje:</strong> {stu.Ruta_de_viaje||'Ninguna'}</p>
              <p><strong>Adecuación:</strong> {adecMap[stu.tipo_de_adecuacion]||'No presenta'}</p>
              <p><strong>Recibe Religión:</strong> {stu.recibe_religion||'N/A'}</p>
              <p><strong>Presenta Carta:</strong> {stu.presenta_carta||'N/A'}</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <p><strong>Nombre:</strong> {enc.nombre_Encargado_Legal}</p>
              <p><strong>Apellidos:</strong> {enc.apellido1_Encargado_Legal} {enc.apellido2_Encargado_Legal}</p>
              <p><strong>Cédula:</strong> {enc.N_Cedula}</p>
              <p><strong>Nacionalidad:</strong> {enc.nacionalidad||'N/A'}</p>
              <p><strong>Teléfono Celular:</strong> {enc.telefono_celular||'N/A'}</p>
            </div>
            <div className="space-y-3">
              <p><strong>Correo:</strong> {enc.correo||'N/A'}</p>
              <p><strong>Ocupación:</strong> {enc.ocupacion||'N/A'}</p>
              <p><strong>Dirección:</strong> {enc.direccion||'N/A'}</p>
              <p><strong>Habitación:</strong> {enc.habitacion||'N/A'}</p>
            </div>
          </div>
        )}
        <button onClick={onClose} className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Cerrar
        </button>
      </div>
    </div>
  );
}
InfoModal.propTypes = {
  matricula: PropTypes.shape({ estudiante: PropTypes.object.isRequired, encargadoLegal: PropTypes.object, seccion: PropTypes.object }).isRequired,
  onClose: PropTypes.func.isRequired
};

export default function GestionMatricula() {
  const { matriculas, loading, error, searchTerm, handleSearchChange, handleUpdateEstado, handleDelete } = useGestionMatriculas();
  const [selectedNivelFilter, setSelectedNivelFilter] = useState("");
  const [selectedEstadoFilter, setSelectedEstadoFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMatricula, setSelectedMatricula] = useState(null);
  const itemsPerPage = 10;

  if (loading) return <p>Cargando matrículas...</p>;
  if (error) return <p>Error: {error}</p>;

  const showDeleteConfirm = id => Swal.fire({
    icon: "warning", title: "Confirmar Eliminación", text: "¿Eliminar esta matrícula?",
    showCancelButton: true, confirmButtonText: "Eliminar", cancelButtonText: "Cancelar", confirmButtonColor: "#2563EB"
  }).then(res => res.isConfirmed && (handleDelete(id), Swal.fire({ icon: "success", title: "Eliminada", confirmButtonColor: "#2563EB" })));

  const niveles = Array.from(new Set(matriculas.map(m => m.estudiante?.grado?.nivel).filter(n => n)));
  const estados = Array.from(new Set(matriculas.map(m => m.estado_Matricula)));

  const filtered = matriculas.filter(m => {
    const nivel = m.estudiante?.grado?.nivel;
    return (!selectedNivelFilter || nivel===selectedNivelFilter) && (!selectedEstadoFilter || m.estado_Matricula===selectedEstadoFilter);
  });
  const sorted = [...filtered].sort((a,b)=>({ RE:2, AC:3 }[a.estado_Matricula]||1)-({ RE:2, AC:3 }[b.estado_Matricula]||1));

  const totalItems = Math.min(sorted.length,100);
  const totalPages = Math.ceil(totalItems/itemsPerPage);
  const startIdx = (currentPage-1)*itemsPerPage;
  const pageItems = sorted.slice(startIdx,startIdx+itemsPerPage);

  // Paginación botones
  const maxBtn=6; let startPage=1,endPage=totalPages;
  if(totalPages>maxBtn){const half=Math.floor(maxBtn/2);
    if(currentPage<=half) endPage=maxBtn;
    else if(currentPage+half>=totalPages) startPage=totalPages-maxBtn+1;
    else{ startPage=currentPage-half; endPage=startPage+maxBtn-1; }
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 dark:text-white">Gestión de Matrículas</h2>

      <div className="flex flex-nowrap gap-4 mb-4">
        <input type="text" placeholder="Buscar cédula..." value={searchTerm}
          onChange={e=>handleSearchChange(e.target.value)}
          className="border p-2 rounded bg-white dark:bg-gray-800" />
        <select value={selectedNivelFilter} onChange={e=>{setSelectedNivelFilter(e.target.value);setCurrentPage(1);}}
          className="border p-2 rounded bg-white dark:bg-gray-800">
          <option value="">Todos los niveles</option>
          {niveles.map(n=><option key={n} value={n}>{n}</option>)}
        </select>
        <select value={selectedEstadoFilter} onChange={e=>{setSelectedEstadoFilter(e.target.value);setCurrentPage(1);}}
          className="border p-2 rounded bg-white dark:bg-gray-800">
          <option value="">Todos los estados</option>
          {estados.map(s=><option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="px-6 py-3 text-left">Boleta</th>
              <th className="px-6 py-3 text-left">Apellido1</th>
              <th className="px-6 py-3 text-left">Apellido2</th>
              <th className="px-6 py-3 text-left">Nombre</th>
              <th className="px-6 py-3 text-left">Cédula</th>
              <th className="px-6 py-3 text-left">Nivel</th>
              <th className="px-6 py-3 text-left">Estado</th>
              <th className="px-6 py-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((m, idx) => (
              <tr key={m.id_Matricula} className={idx % 2 === 0 ? 'bg-gray-50 dark:bg-gray-900' : 'bg-white dark:bg-gray-800'}>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{m.id_Matricula}</td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{m.estudiante?.apellido1_Estudiante}</td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{m.estudiante?.apellido2_Estudiante}</td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{m.estudiante?.nombre_Estudiante}</td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{m.estudiante?.cedula}</td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{m.estudiante?.grado?.nivel ?? 'N/A'}</td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{m.estado_Matricula}</td>
                <td className="px-6 py-4 border space-x-2">
                  <button onClick={() => setSelectedMatricula(m)} className="px-2 py-1 rounded bg-blue-500 text-white hover:bg-blue-600">Info</button>
                  {m.estado_Matricula !== 'AC' && m.estado_Matricula !== 'RE' && <button onClick={() => handleUpdateEstado(m.id_Matricula,'AC')} className="px-2 py-1 rounded bg-green-500 text-white hover:bg-green-600">Aceptar</button>}
                  {m.estado_Matricula !== 'RE' && m.estado_Matricula!=='AC' && <button onClick={() => handleUpdateEstado(m.id_Matricula,'RE')} className="px-2 py-1 rounded bg-yellow-400 hover:bg-yellow-500">Rechazar</button>}
                  {m.estado_Matricula==='RE' && <button onClick={() => showDeleteConfirm(m.id_Matricula)} className="px-2 py-1 rounded bg-red-500 text-white hover:bg-red-600">Eliminar</button>}
                </td>
              </tr>
            ))}
            {pageItems.length===0 && <tr><td colSpan={8} className="py-4 text-center text-gray-500">No hay matrículas</td></tr>}
          </tbody>
        </table>
      </div>

      {totalPages>1 && (
        <div className="mt-4 flex justify-center space-x-2">
          <button onClick={()=>setCurrentPage(p=>p-1)} disabled={currentPage===1} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 rounded disabled:opacity-50">&lt;</button>
          {Array.from({ length: endPage-startPage+1 },(_,i)=> startPage+i).map(p=> (
            <button key={p} onClick={()=>setCurrentPage(p)} className={`px-3 py-1 rounded ${p===currentPage?'bg-blue-600 text-white':'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-white'}`}>{p}</button>
          ))}
          <button onClick={()=>setCurrentPage(p=>p+1)} disabled={currentPage===totalPages} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 rounded disabled:opacity-50">&gt;</button>
        </div>
      )}

      {selectedMatricula && <InfoModal matricula={selectedMatricula} onClose={()=>setSelectedMatricula(null)} />}
    </div>
  );
}
