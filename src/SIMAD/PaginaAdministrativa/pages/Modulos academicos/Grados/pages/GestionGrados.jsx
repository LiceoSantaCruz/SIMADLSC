import { useEffect, useState } from 'react';
import GradoService from '../Service/GradoService';
import { Button } from '../../../../../../Components/ui/Button';
import { Input } from '../../../../../../Components/ui/Input';
import { toast } from 'sonner';
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
      const ordenados = data.sort((a, b) => 
        todosLosGrados.indexOf(a.nivel) - todosLosGrados.indexOf(b.nivel)
      );
      setGrados(ordenados);

      // Buscar faltantes
      const existentes = ordenados.map((g) => g.nivel);
      const faltan = todosLosGrados.filter((nivel) => !existentes.includes(nivel));
      setFaltantes(faltan);
    } catch (error) {
      console.error('Error al obtener los grados:', error);
      toast.error('Error al obtener los grados');
    }
  };

  useEffect(() => {
    fetchGrados();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const capitalizado = nivel.trim().charAt(0).toUpperCase() + nivel.trim().slice(1).toLowerCase();

    if (!todosLosGrados.includes(capitalizado)) {
      toast.warning('Solo se permiten los grados: Sétimo a Undécimo');
      return;
    }

    if (grados.some((g) => g.nivel === capitalizado)) {
      toast.warning('Ese grado ya está registrado');
      return;
    }

    try {
      await GradoService.createGrado({ nivel: capitalizado });
      toast.success('Grado creado correctamente');
      setNivel('');
      fetchGrados();
    } catch (error) {
      console.error('Error al crear el grado:', error);
      toast.error('Error al crear el grado');
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
        toast.success('Grado eliminado');
        fetchGrados();
      } catch (error) {
        console.error('Error al eliminar el grado:', error);
        toast.error('Error al eliminar el grado');
      }
    }
  };

  const handleAgregarTodos = async () => {
    const confirmacion = await Swal.fire({
      title: 'Agregar grados Sétimo a Undécimo',
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
        toast.success('Grados agregados correctamente');
        fetchGrados();
      } catch (error) {
        console.error('Error al agregar los grados:', error);
        toast.error('Error al agregar los grados');
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-10 space-y-6">
      <h2 className="text-2xl font-bold">Gestión de Grados</h2>

      {/* Botón para agregar todos los grados */}
      {faltantes.length > 0 && (
        <Button
          onClick={handleAgregarTodos}
          className="bg-green-600 hover:bg-green-700"
        >
          Agregar grados faltantes
        </Button>
      )}

      {/* Formulario de creación */}
      <form onSubmit={handleSubmit} className="flex items-center gap-4">
        <Input
          type="text"
          placeholder="Ej: Sétimo, Octavo..."
          value={nivel}
          onChange={(e) => setNivel(e.target.value)}
          required
        />
        <Button type="submit">Agregar</Button>
      </form>

      {/* Tabla de grados */}
      <div className="overflow-x-auto mt-6">
        <table className="min-w-full table-auto border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Nivel</th>
              <th className="px-4 py-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {grados.length > 0 ? (
              grados.map((grado) => (
                <tr key={grado.id_grado} className="border-t">
                  <td className="px-4 py-2">{grado.nivel}</td>
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
                <td colSpan="2" className="px-4 py-4 text-center text-gray-500">
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
