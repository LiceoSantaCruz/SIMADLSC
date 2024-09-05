import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    setError('');

    console.log('Inicio de sesión exitoso:', { email, password });
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
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 p-3 shadow-md focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition ease-in-out duration-150"
                  placeholder="Ingresa tu correo electrónico"
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
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 p-3 shadow-md focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition ease-in-out duration-150"
                  placeholder="Ingresa tu contraseña"
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
              >
                Iniciar Sesión
              </button>
            </div>
          </form>

          {/* Botón Volver a la Página Principal */}
          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-blue-700 font-medium hover:underline hover:text-blue-900"
            >
              Volver a la página principal
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
