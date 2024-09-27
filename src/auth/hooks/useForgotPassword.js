// src/auth/hooks/useForgotPassword.js
import { useState } from 'react';
import { forgotPassword } from '../services/forgotPasswordService';

export const useForgotPassword = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleForgotPassword = async (email_Usuario) => {
    try {
      setError('');
      await forgotPassword(email_Usuario);
      setSuccess('Se ha enviado un enlace de restablecimiento a tu correo electrónico.');
    } catch (error) {
      setError(error.message);
    }
  };

  return { handleForgotPassword, error, success };
};
