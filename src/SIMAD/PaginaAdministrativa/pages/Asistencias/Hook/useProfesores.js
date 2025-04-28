// src/Hooks/useProfesores.jsx

import { useEffect, useState } from 'react'
import { obtenerProfesores } from '../Services/ProfesorService'

/**
 * Hook para obtener la lista de profesores y, si el usuario es profesor,
 * auto-seleccionar al profesor que inició sesión.
 *
 * @returns {{
 *   profesores: Array,
 *   loading: boolean,
 *   selectedProfesor: string,
 *   setSelectedProfesor: (id: string) => void
 * }}
 */
const useProfesores = () => {
  const [profesores, setProfesores] = useState([])
  const [loading, setLoading] = useState(true)

  // Lee rol e id de profesor logueado desde localStorage
  const role = localStorage.getItem('role')
  const idProfesorLogged = localStorage.getItem('id_Profesor') || ''

  // Estado para el profesor seleccionado en el <select>
  const [selectedProfesor, setSelectedProfesor] = useState(
    role === 'profesor' ? idProfesorLogged : ''
  )

  useEffect(() => {
    let isMounted = true

    async function fetchProfesores() {
      try {
        const data = await obtenerProfesores()
        if (!isMounted) return

        setProfesores(data)

        // Una vez cargados, si es profesor, auto-selecciona su ID
        if (role === 'profesor') {
          setSelectedProfesor(idProfesorLogged)
        }
      } catch (error) {
        console.error('Error al obtener profesores:', error)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchProfesores()

    return () => {
      // Evita actualizaciones de estado si el componente se desmonta
      isMounted = false
    }
  }, [role, idProfesorLogged])

  return {
    profesores,
    loading,
    selectedProfesor,
    setSelectedProfesor
  }
}

export default useProfesores
