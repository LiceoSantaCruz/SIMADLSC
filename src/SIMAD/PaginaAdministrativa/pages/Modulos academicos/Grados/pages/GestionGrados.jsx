import { useEffect, useState } from 'react';
import GradoService from '../Service/GradoService';
import { Button } from '../../../../../../Components/ui/Button';
import { Input } from '../../../../../../Components/ui/Input';
import { Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';

export const GestionGrados = () => {
  const [nivel, setNivel] = useState('');
  const [grados, setGrados] = useState([]);
  const [faltantes, setFaltantes] = useState([]);

  const todosLosGrados = ['Sétimo', 'Octavo', 'Noveno', 'Décimo', 'Undécimo'];

  const fetchGrados = async () => {
    try {
      const data = await GradoService.getGrados();
      const ordenados = data.sort(
        (a, b) => todosLosGrados.indexOf(a.nivel) - todosLosGrados.indexOf(b.nivel)
      );
      setGrados(ordenados);

      const existentes = ordenados.map((g) => g.nivel);
      const faltan = todosLosGrados.filter((nivel) => !existentes.includes(nivel));
      setFaltantes(faltan);
    } catch (error) {
      console.error('Error al obtener los grados:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar los grados.',
        confirmButtonColor: '#2563EB',
      });
    }
  };

  useEffect(() => {
    fetchGrados();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const capitalizado =
      nivel.trim().charAt(0).toUpperCase() + nivel.trim().slice(1).toLowerCase();

    if (!todosLosGrados.includes(capitalizado)) {
      await Swal.fire({
        icon: 'warning',
        title: 'Grado no permitido',
        text: 'Solo se permiten los grados: Sétimo, Octavo, Noveno, Décimo, Undécimo.',
        confirmButtonColor: '#2563EB',
      });
      return;
    }

    if (grados.some((g) => g.nivel === capitalizado)) {
      await Swal.fire({
        icon: 'warning',
        title: 'Grado duplicado',
        text: `El grado "${capitalizado}" ya está registrado.`,
        confirmButtonColor: '#2563EB',
      });
      return;
    }

    try {
      await GradoService.createGrado({ nivel: capitalizado });
      await Swal.fire({
        icon: 'success',
        title: 'Grado creado',
        text: `El grado "${capitalizado}" fue creado exitosamente.`,
        confirmButtonColor: '#2563EB',
      });
      setNivel('');
      fetchGrados();
    } catch (error) {
      console.error('Error al crear el grado:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo crear el grado.',
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
        await GradoService.deleteGrado(id);
        await Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'El grado fue eliminado correctamente.',
          confirmButtonColor: '#2563EB',
        });
        fetchGrados();
      } catch (error) {
        console.error('Error al eliminar el grado:', error);
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar el grado.',
          confirmButtonColor: '#2563EB',
        });
      }
    }
  };

  const handleAgregarTodos = async () => {
    const confirmacion = await Swal.fire({
      title: 'Agregar grados',
      text: `Se agregarán los siguientes grados: ${faltantes.join(', ')}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Agregar',
      cancelButtonText: 'Cancelar',
    });

    if (confirmacion.isConfirmed) {
      try {
        for (const nivel of faltantes) {
          await GradoService.createGrado({ nivel });
        }
        await Swal.fire({
          icon: 'success',
          title: 'Grados agregados',
          text: 'Todos los grados faltantes fueron agregados correctamente.',
          confirmButtonColor: '#2563EB',
        });
        fetchGrados();
      } catch (error) {
        console.error('Error al agregar grados:', error);
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron agregar los grados.',
          confirmButtonColor: '#2563EB',
        });
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg mt-10 space-y-6">
  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Gestión de Grados</h2>

  {faltantes.length > 0 && (
    <Button
      onClick={handleAgregarTodos}
      className="bg-green-600 hover:bg-green-700"
    >
      Agregar grados faltantes
    </Button>
  )}

  <form onSubmit={handleSubmit} className="flex items-center gap-4">
    <Input
      type="text"
      placeholder="Ej: Sétimo, Octavo..."
      value={nivel}
      onChange={(e) => setNivel(e.target.value)}
      required
      className="dark:bg-gray-800 dark:text-white dark:border-gray-600"
    />
    <Button type="submit">Agregar</Button>
  </form>

  <div className="overflow-x-auto mt-6">
    <table className="min-w-full table-auto border text-sm">
      <thead className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100">
        <tr>
          <th className="px-4 py-2 text-left">Nivel</th>
          <th className="px-4 py-2 text-left">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {grados.length > 0 ? (
          grados.map((grado) => (
            <tr key={grado.id_grado} className="border-t border-gray-200 dark:border-gray-600">
              <td className="px-4 py-2 text-gray-900 dark:text-gray-100">{grado.nivel}</td>
              <td className="px-4 py-2">
                <Button
                  onClick={() => handleDelete(grado.id_grado)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="2" className="px-4 py-4 text-center text-gray-500 dark:text-gray-400">
              No hay grados registrados
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>

  );
};

export default GestionGrados;
