// src/Pages/CrearSeccion.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SeccionesService from '../Services/SeccionesService';
import Swal from 'sweetalert2';
import '@sweetalert2/theme-bulma/bulma.css';

const CrearSeccion = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre_Seccion: '',
    gradoId: '',
  });
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nombre_Seccion || !formData.gradoId) {
      setErrorMessage('Por favor complete todos los campos.');
      return;
    }
    try {
      await SeccionesService.create(formData);
      Swal.fire({
        icon: 'success',
        title: 'Creada',
        text: 'La sección ha sido creada exitosamente.',
        confirmButtonColor: '#2563EB',
      });
      navigate('/secciones');
    } catch (error) {
      console.error('Error al crear sección:', error);
      setErrorMessage('Ocurrió un error al crear la sección.');
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Crear Sección</h1>
        {errorMessage && (
          <div className="p-4 bg-red-100 text-red-700 rounded mb-4">
            {errorMessage}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nombre_Seccion" className="block text-gray-700 mb-1">
              Nombre de la Sección
            </label>
            <input
              type="text"
              id="nombre_Seccion"
              name="nombre_Seccion"
              value={formData.nombre_Seccion}
              onChange={handleChange}
              placeholder="Ej. 7-1, 8-2, etc."
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="gradoId" className="block text-gray-700 mb-1">
              ID del Grado
            </label>
            <input
              type="number"
              id="gradoId"
              name="gradoId"
              value={formData.gradoId}
              onChange={handleChange}
              placeholder="Ej. 1, 2, 3, etc."
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Crear Sección
          </button>
        </form>
      </div>
    </div>
  );
};

export default CrearSeccion;
