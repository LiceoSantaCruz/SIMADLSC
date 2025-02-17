

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export const MatriculaExtraordinaria = () => {
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    Swal.fire({
      title: 'Formulario enviado!',
      text: 'Tu boleta de matrícula ha sido enviada correctamente.',
      icon: 'success',
      confirmButtonText: 'Aceptar'
    }).then(() => {
      navigate('/gestion-matricula'); // Redirige a la página de GestionMatricula
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white shadow-md">
      <h1 className="text-center text-2xl font-bold mb-6">Boleta de Matrícula Año 2025</h1>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {page === 1 ? (
          <>
            <div className="flex justify-between">
              <div>
                <label className="block text-gray-700">Motivo de la Matrícula:</label>
                <textarea
                  className="border p-2 rounded-md w-full"
                  rows="3"
                  placeholder="Especifica el motivo de la matrícula..."
                ></textarea>
              </div>
              <div>
                <label className="block text-gray-700">Nivel:</label>
                <input type="text" className="border p-2 rounded-md w-full" />
              </div>
            </div>

            <h2 className="text-lg font-semibold">Datos del Estudiante</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700">Nombre:</label>
                <input type="text" className="border p-2 rounded-md w-full" />
              </div>
              <div>
                <label className="block text-gray-700">1º Apellido:</label>
                <input type="text" className="border p-2 rounded-md w-full" />
              </div>
              <div>
                <label className="block text-gray-700">2º Apellido:</label>
                <input type="text" className="border p-2 rounded-md w-full" />
              </div>
              <div>
                <label className="block text-gray-700">Nº Cédula o Pasaporte:</label>
                <input type="text" className="border p-2 rounded-md w-full" />
              </div>
              <div>
                <label className="block text-gray-700">Correo Estudiantil:</label>
                <input type="email" className="border p-2 rounded-md w-full" />
              </div>
            </div>

            <div className="flex space-x-4">
              <label className="block text-gray-700">Sexo:</label>
              <label className="inline-flex items-center">
                <input type="radio" name="sexo" value="Femenino" className="mr-2" />
                Femenino
              </label>
              <label className="inline-flex items-center ml-4">
                <input type="radio" name="sexo" value="Masculino" className="mr-2" />
                Masculino
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700">Nacionalidad:</label>
                <input type="text" className="border p-2 rounded-md w-full" />
              </div>
              <div>
                <label className="block text-gray-700">Edad:</label>
                <input type="number" className="border p-2 rounded-md w-full" />
              </div>
            </div>

            {/* Lugar y Fecha de Nacimiento */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-gray-700">Lugar de Nacimiento:</label>
                <input type="text" className="border p-2 rounded-md w-full" placeholder="Especifica el lugar de nacimiento" />
              </div>
              <div>
                <label className="block text-gray-700">Fecha de Nacimiento:</label>
                <input type="date" className="border p-2 rounded-md w-full" />
              </div>
            </div>

            <div className="flex space-x-4">
              <label className="block text-gray-700">Condición Migratoria:</label>
              <label className="inline-flex items-center">
                <input type="radio" name="condicion" value="Legal" className="mr-2" />
                Legal
              </label>
              <label className="inline-flex items-center ml-4">
                <input type="radio" name="condicion" value="Refugiado" className="mr-2" />
                Refugiado
              </label>
              <label className="inline-flex items-center ml-4">
                <input type="radio" name="condicion" value="Ilegal" className="mr-2" />
                Ilegal
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700">Repite alguna materia:</label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input type="radio" name="repite" value="Si" className="mr-2" />
                    Sí
                  </label>
                  <label className="inline-flex items-center">
                    <input type="radio" name="repite" value="No" className="mr-2" />
                    No
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-gray-700">Institución de Procedencia:</label>
                <input type="text" className="border p-2 rounded-md w-full" />
              </div>
            </div>

            <h2 className="text-lg font-semibold">Enfermedades y Medicamentos</h2>

            <div className="flex space-x-4">
              <label className="block text-gray-700">Presenta alguna enfermedad:</label>
              <label className="inline-flex items-center">
                <input type="radio" name="enfermedad" value="Si" className="mr-2" />
                Sí
              </label>
              <label className="inline-flex items-center ml-4">
                <input type="radio" name="enfermedad" value="No" className="mr-2" />
                No
              </label>
            </div>

            <div>
              <label className="block text-gray-700">Medicamentos que debe tomar:</label>
              <input type="text" className="border p-2 rounded-md w-full" />
            </div>

            <div>
              <label className="block text-gray-700">Ruta que viaja el estudiante:</label>
              <input type="text" className="border p-2 rounded-md w-full" />
            </div>

            <div className="flex justify-center mt-6">
              <button
                type="button"
                onClick={() => setPage(2)}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600"
              >
                Siguiente
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-lg font-semibold">Datos del Responsable o Encargado Legal</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700">Nombre:</label>
                <input type="text" className="border p-2 rounded-md w-full" />
              </div>
              <div>
                <label className="block text-gray-700">1º Apellido:</label>
                <input type="text" className="border p-2 rounded-md w-full" />
              </div>
              <div>
                <label className="block text-gray-700">2º Apellido:</label>
                <input type="text" className="border p-2 rounded-md w-full" />
              </div>
              <div>
                <label className="block text-gray-700">Nº Cédula:</label>
                <input type="text" className="border p-2 rounded-md w-full" />
              </div>
              <div>
                <label className="block text-gray-700">Nacionalidad:</label>
                <input type="text" className="border p-2 rounded-md w-full" />
              </div>
              <div>
                <label className="block text-gray-700">Ocupación:</label>
                <input type="text" className="border p-2 rounded-md w-full" />
              </div>
              <div>
                <label className="block text-gray-700">Dirección:</label>
                <input type="text" className="border p-2 rounded-md w-full" />
              </div>
              <div>
                <label className="block text-gray-700">Teléfono Celular:</label>
                <input type="text" className="border p-2 rounded-md w-full" />
              </div>
              <div>
                <label className="block text-gray-700">Correo:</label>
                <input type="email" className="border p-2 rounded-md w-full" />
              </div>
              <div>
                <label className="block text-gray-700">Habitación:</label>
                <input type="text" className="border p-2 rounded-md w-full" />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-gray-700 mb-2">
                Autorizo a la Institución para que utilice derecho de imagen de mi hijo (con fines educativos):
              </label>
              <label className="inline-flex items-center">
                <input type="radio" name="autorizacion" value="si" className="mr-2" />
                Sí
              </label>
              <label className="inline-flex items-center ml-4">
                <input type="radio" name="autorizacion" value="no" className="mr-2" />
                No
              </label>
            </div>

            <div className="flex justify-center space-x-4 mt-6">
              <button
                type="button"
                onClick={() => setPage(1)}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-gray-600"
              >
                Anterior
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600"
              >
                Enviar
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default MatriculaExtraordinaria;

