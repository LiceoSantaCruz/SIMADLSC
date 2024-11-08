export const fetchUserProfile = async () => {
    const token = localStorage.getItem('token'); 
  
    const response = await fetch('https://simadlsc-backend-production.up.railway.app/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  
    if (!response.ok) {
      throw new Error('Error al obtener el perfil del usuario');
    }
  
    const data = await response.json();
    return data;
  };
  