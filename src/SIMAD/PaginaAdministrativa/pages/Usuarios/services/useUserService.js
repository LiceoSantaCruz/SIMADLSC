// const BASE_URL = 'https://simadlsc-backend-production.up.railway.app/users';  // URL base para las peticiones

const API_URL = import.meta.env.VITE_API_URL;

// Obtener todos los usuarios
export const getAllUsers = async (token) => {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener los usuarios');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en getAllUsers:', error);
    throw error;
  }
};

// ✅ Obtener todas las materias
export const getAllMaterias = async (token) => {
  try {
    const response = await fetch(`${API_URL}/materias`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener las materias');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en getAllMaterias:', error);
    throw error;
  }
};

// Crear un usuario general
export const createUser = async (userData, token) => {
  if (!token) {
    throw new Error('No se proporcionó un token de autenticación');
  }
  try {
    const response = await fetch(`${API_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Error al crear el usuario');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en createUser:', error);
    throw error;
  }
};

// Crear un usuario con rol de Estudiante
export const createStudentUser = async (userData, studentData, token) => {
  if (!token) {
    throw new Error('No se proporcionó un token de autenticación');
  }
  try {
    const response = await fetch(`${API_URL}/users/register-student`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify({ ...userData, ...studentData }),
    });

    if (!response.ok) {
      throw new Error('Error al crear el usuario como estudiante');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en createStudentUser:', error);
    throw error;
  }
};

// Actualizar un usuario existente
export const updateUser = async (id, userData, token) => {
  try {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar el usuario');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en updateUser:', error);
    throw error;
  }
};

// Eliminar un usuario
export const deleteUser = async (id, token) => {
  try {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
    });

    if (response.status === 204) {
      return; // No hay contenido
    }

    if (!response.ok) {
      throw new Error('Error al eliminar el usuario');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en deleteUser:', error);
    throw error;
  }
};

// Bloquear o desbloquear un usuario
export const toggleBlockUser = async (id, bloqueado_Usuario, token) => {
  try {
    const response = await fetch(`${API_URL}/users/${id}/block`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ bloqueado_Usuario }),
    });

    if (!response.ok) {
      throw new Error('Error al bloquear/desbloquear el usuario');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en toggleBlockUser:', error);
    throw error;
  }
};
