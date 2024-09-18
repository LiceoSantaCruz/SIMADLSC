import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Limpiar mensajes anteriores
    setError('');
    setSuccess('');

    if (!email || !password) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    try {
      // Realizar la petición al servidor para el login
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      // Si la respuesta no es exitosa, mostrar el error
      if (!response.ok) {
        
        const errorData = await response.json();
        setError(errorData.message || 'Error en el inicio de sesión');
        return;
      }

      // Si la respuesta es exitosa, recibir los datos (token y rol)
      const data = await response.json();
      console.log('Respuesta del backend:', data); // Verificar toda la respuesta

      // Guardar el token y el rol en localStorage
      localStorage.setItem('token', data.token);  // Aquí guardas el token
      localStorage.setItem('rol', data.rol);    // Aquí guardas el rol del usuario (admin, user, etc.)
      console.log(data.rol)
      // Mostrar mensaje de éxito
      setSuccess('Inicio de sesión exitoso');

      // Redirigir al usuario a la página principal
      window.location.href = '/';  // Redirigir a la página principal o una específica según el rol
    } catch (error) {
      console.error(error);
      setError('Error de conexión con el servidor.');
    }
  };

  const handleGoBack = () => {
    window.location.href = '/paginainformativa'; 
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-400 to-blue-600 px-4 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white p-8 shadow-2xl rounded-xl transition-transform transform hover:scale-105">
          <h2 className="text-center text-3xl font-bold text-blue-900 mb-4">
            Inicia sesión en tu cuenta
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-800">
                Correo Electrónico
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 p-3 shadow-md focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition ease-in-out duration-150"
                  placeholder="Ingresa tu correo electrónico"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-800">
                Contraseña
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 p-3 shadow-md focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition ease-in-out duration-150"
                  placeholder="Ingresa tu contraseña"
                  required
                />
              </div>
            </div>

            {/* Mostrar mensaje de error */}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* Mostrar mensaje de éxito */}
            {success && <p className="text-green-500 text-sm">{success}</p>}

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
              >
                Iniciar Sesión
              </button>
            </div>
          </form>

          <div className="mt-4 flex justify-between items-center">
            {/* Botón Volver a la izquierda con una flecha */}
            <button
              onClick={handleGoBack}
              className="text-blue-700 font-medium hover:underline flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-5 h-5 mr-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Volver
            </button>

            {/* Enlace "¿Olvidaste tu contraseña?" más azul y a la derecha */}
            <a
              href="/paginainformativa/login/forgot-password"
              className="text-blue-600 font-medium hover:underline hover:text-blue-800"
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
