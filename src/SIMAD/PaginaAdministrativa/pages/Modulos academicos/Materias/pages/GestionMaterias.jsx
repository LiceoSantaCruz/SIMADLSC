import { useEffect, useState } from 'react';
import MateriaService from '../Service/MateriaService';
import { Button } from '../../../../../../Components/ui/Button';
import { Input } from '../../../../../../Components/ui/Input';
import { Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';

// Normalizar texto para evitar duplicados con tildes, mayúsculas, espacios
const normalizeText = (text) =>
  text
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

export const GestionMaterias = () => {
  const [nombre, setNombre] = useState('');
  const [materias, setMaterias] = useState([]);
  const [faltantes, setFaltantes] = useState([]);

  const materiasBase = [
    'Español',
    'Matemática',
    'Estudios Sociales',
    'Ciencias',
    'Inglés',
    'Educación Física',
    'Cívica',
    'Religión',
  ];

  const fetchMaterias = async () => {
    try {
      const data = await MateriaService.getMaterias();
      const ordenadas = data.sort((a, b) =>
        a.nombre_Materia.localeCompare(b.nombre_Materia)
      );
      setMaterias(ordenadas);

      const existentes = ordenadas.map((m) => normalizeText(m.nombre_Materia));
      const faltan = materiasBase.filter(
        (m) => !existentes.includes(normalizeText(m))
      );
      setFaltantes(faltan);
    } catch (error) {
      console.error('Error al obtener las materias:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar las materias.',
        confirmButtonColor: '#2563EB',
      });
    }
  };

  useEffect(() => {
    fetchMaterias();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formateada = nombre.trim();

    if (!formateada) {
      await Swal.fire({
        icon: 'warning',
        title: 'Campo vacío',
        text: 'Por favor ingrese el nombre de la materia.',
        confirmButtonColor: '#2563EB',
      });
      return;
    }

    const yaExiste = materias.find(
      (m) => normalizeText(m.nombre_Materia) === normalizeText(formateada)
    );

    if (yaExiste) {
      await Swal.fire({
        icon: 'warning',
        title: 'Materia existente',
        text: `La materia "${yaExiste.nombre_Materia}" ya está registrada.`,
        confirmButtonColor: '#2563EB',
      });
      return;
    }

    try {
      await MateriaService.createMateria({ nombre_Materia: formateada });
      await Swal.fire({
        icon: 'success',
        title: 'Creada',
        text: 'La materia fue creada correctamente.',
        confirmButtonColor: '#2563EB',
      });
      setNombre('');
      fetchMaterias();
    } catch (error) {
      console.error('Error al crear materia:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo crear la materia.',
        confirmButtonColor: '#2563EB',
      });
    }
  };

  const handleDelete = async (id) => {
    const confirmacion = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc2626',
    });

    if (confirmacion.isConfirmed) {
      try {
        await MateriaService.deleteMateria(id);
        await Swal.fire({
          icon: 'success',
          title: 'Eliminada',
          text: 'La materia fue eliminada correctamente.',
          confirmButtonColor: '#2563EB',
        });
        fetchMaterias();
      } catch (error) {
        console.error('Error al eliminar la materia:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar la materia.',
          confirmButtonColor: '#2563EB',
        });
      }
    }
  };

  const handleAgregarTodas = async () => {
    const confirmacion = await Swal.fire({
      title: 'Agregar todas las materias',
      text: `Se agregarán las siguientes: ${faltantes.join(', ')}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Agregar',
      cancelButtonText: 'Cancelar',
    });

    if (confirmacion.isConfirmed) {
      try {
        for (const nombre of faltantes) {
          await MateriaService.createMateria({ nombre_Materia: nombre });
        }
        await Swal.fire({
          icon: 'success',
          title: 'Materias agregadas',
          text: 'Todas las materias faltantes fueron agregadas correctamente.',
          confirmButtonColor: '#2563EB',
        });
        fetchMaterias();
      } catch (error) {
        console.error('Error al agregar materias:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron agregar las materias.',
          confirmButtonColor: '#2563EB',
        });
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-10 space-y-6">
      <h2 className="text-2xl font-bold">Gestión de Materias</h2>

      {faltantes.length > 0 && (
        <Button
          onClick={handleAgregarTodas}
          className="bg-green-600 hover:bg-green-700"
        >
          Agregar materias faltantes
        </Button>
      )}

      <form onSubmit={handleSubmit} className="flex items-center gap-4">
        <Input
          type="text"
          placeholder="Ej: Educación Cívica"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <Button type="submit" disabled={!nombre.trim()}>
          Agregar
        </Button>
      </form>

      <div className="overflow-x-auto mt-6">
        <table className="min-w-full table-auto border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Nombre</th>
              <th className="px-4 py-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {materias.length > 0 ? (
              materias.map((materia) => (
                <tr
                  key={materia.id_Materia || materia.id || materia.nombre_Materia}
                  className="border-t"
                >
                  <td className="px-4 py-2">{materia.nombre_Materia}</td>
                  <td className="px-4 py-2">
                    <Button
                      onClick={() =>
                        handleDelete(materia.id_Materia || materia.id)
                      }
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="px-4 py-4 text-center text-gray-500">
                  No hay materias registradas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GestionMaterias;
