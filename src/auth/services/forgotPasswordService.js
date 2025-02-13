
const API_URL = import.meta.env.VITE_API_URL;

//https://simadlsc-backend-production.up.railway.app/auth/forgot-password
export const forgotPassword = async (email_Usuario) => {
  try {
    const response = await fetch(`${API_URL}/auth/forgot-password}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email_Usuario }),
    });

    if (!response.ok) {
      // Manejo de errores HTTP
      const errorText = await response.text();
      throw new Error(`Error en la solicitud: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log(data.message); // 'Se ha enviado un correo para restablecer tu contraseña.'
  } catch (error) {
    console.error('Error en forgotPassword:', error);
    throw error; // Re-lanza el error para manejarlo en el componente que lo llama
  }
};
