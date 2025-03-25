import { useEffect, useState } from 'react';
import AulaService from '../Service/AulaService';
import { Button } from '../../../../../../Components/ui/Button';
import { Input } from '../../../../../../Components/ui/Input';
import { Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';

export const GestionAulas = () => {
  const [nombre, setNombre] = useState('');
  const [aulas, setAulas] = useState([]);
  const [faltantes, setFaltantes] = useState([]);

  const aulasBase = ['1', '2', '3', '4', '5', '6']; // Ajustá según tus necesidades

  const fetchAulas = async () => {
    try {
      const data = await AulaService.getAulas();
      const ordenadas = data.sort((a, b) =>
        a.nombre_Aula.localeCompare(b.nombre_Aula, 'es', { numeric: true })
      );
      setAulas(ordenadas);

      const existentes = ordenadas.map((a) => a.nombre_Aula.toLowerCase());
      const faltan = aulasBase.filter(
        (aula) => !existentes.includes(aula.toLowerCase())
      );
      setFaltantes(faltan);
    } catch (error) {
      console.error('Error al obtener las aulas:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron obtener las aulas.',
        confirmButtonColor: '#2563EB',
      });
    }
  };

  useEffect(() => {
    fetchAulas();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nombreFormateado = nombre.trim();

    if (!nombreFormateado) {
      await Swal.fire({
        icon: 'warning',
        title: 'Campo vacío',
        text: 'Ingrese el nombre del aula.',
        confirmButtonColor: '#2563EB',
      });
      return;
    }

    const yaExiste = aulas.find(
      (a) => a.nombre_Aula.toLowerCase() === nombreFormateado.toLowerCase()
    );

    if (yaExiste) {
      await Swal.fire({
        icon: 'warning',
        title: 'Aula existente',
        text: `El aula "${yaExiste.nombre_Aula}" ya está registrada.`,
        confirmButtonColor: '#2563EB',
      });
      return;
    }

    try {
      await AulaService.createAula({ nombre_Aula: nombreFormateado });
      await Swal.fire({
        icon: 'success',
        title: 'Aula creada',
        text: `El aula "${nombreFormateado}" fue registrada correctamente.`,
        confirmButtonColor: '#2563EB',
      });
      setNombre('');
      fetchAulas();
    } catch (error) {
      console.error('Error al crear aula:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo crear el aula.',
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
        await AulaService.deleteAula(id);
        await Swal.fire({
          icon: 'success',
          title: 'Aula eliminada',
          text: 'El aula fue eliminada correctamente.',
          confirmButtonColor: '#2563EB',
        });
        fetchAulas();
      } catch (error) {
        console.error('Error al eliminar aula:', error);
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'No se pudo eliminar el aula.',
          confirmButtonColor: '#2563EB',
        });
      }
    }
  };

  const handleAgregarTodas = async () => {
    const confirmacion = await Swal.fire({
      title: 'Agregar todas las aulas',
      text: `Se agregarán: ${faltantes.join(', ')}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Agregar',
      cancelButtonText: 'Cancelar',
    });

    if (confirmacion.isConfirmed) {
      try {
        for (const nombre of faltantes) {
          await AulaService.createAula({ nombre_Aula: nombre });
        }
        await Swal.fire({
          icon: 'success',
          title: 'Aulas agregadas',
          text: 'Se agregaron todas las aulas faltantes correctamente.',
          confirmButtonColor: '#2563EB',
        });
        fetchAulas();
      } catch (error) {
        console.error('Error al agregar aulas:', error);
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron agregar las aulas.',
          confirmButtonColor: '#2563EB',
        });
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-10 space-y-6">
      <h2 className="text-2xl font-bold">Gestión de Aulas</h2>

      {faltantes.length > 0 && (
        <Button
          onClick={handleAgregarTodas}
          className="bg-green-600 hover:bg-green-700"
        >
          Agregar aulas faltantes
        </Button>
      )}

      <form onSubmit={handleSubmit} className="flex items-center gap-4">
        <Input
          type="text"
          placeholder="Ej: 1, 2, 3..."
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
            {aulas.length > 0 ? (
              aulas.map((aula) => (
                <tr key={aula.id_aula} className="border-t">
                  <td className="px-4 py-2">{aula.nombre_Aula}</td>
                  <td className="px-4 py-2">
                    <Button
                      onClick={() => handleDelete(aula.id_aula)}
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
                  No hay aulas registradas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GestionAulas;
