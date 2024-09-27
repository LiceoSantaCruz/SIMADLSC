// src/auth/services/forgotPasswordService.js
export const forgotPassword = async (email_Usuario) => {
    const response = await fetch('http://localhost:3000/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email_Usuario }),
    });
  
    if (!response.ok) {
      throw new Error('Hubo un error al enviar el enlace de restablecimiento.');
    }
  
    return await response.json();
  };
  