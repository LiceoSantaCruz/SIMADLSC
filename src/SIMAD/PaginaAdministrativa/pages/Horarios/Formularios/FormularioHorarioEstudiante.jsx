// src/SIMAD/PaginaAdministrativa/pages/Horarios/Formularios/FormularioHorarioEstudiante.jsx

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { HorarioEstudianteSchema } from './validationSchemas';

const FormularioHorarioEstudiante = () => {
  // Estados para almacenar datos dinámicos
  const [grados, setGrados] = useState([]);
  const [secciones, setSecciones] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [profesores, setProfesores] = useState([]);

  // Configurar React Hook Form con Yup
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(HorarioEstudianteSchema),
    defaultValues: {
      gradoId: '',
      seccionId: '',
      materiaId: '',
      profesorId: '',
      dia_semana_Horario: '',
      hora_inicio_Horario: '',
    },
  });

  // Observar cambios en 'gradoId' para actualizar secciones
  const gradoSeleccionado = watch('gradoId');

  useEffect(() => {
    // Funciones para obtener datos desde el back-end
    const fetchGrados = async () => {
      try {
        const response = await axios.get('http://localhost:3000/grados');
        setGrados(response.data);
      } catch (error) {
        console.error('Error al obtener grados:', error);
        alert('Error al obtener grados');
      }
    };

    const fetchMaterias = async () => {
      try {
        const response = await axios.get('http://localhost:3000/materias');
        setMaterias(response.data);
      } catch (error) {
        console.error('Error al obtener materias:', error);
        alert('Error al obtener materias');
      }
    };

    const fetchProfesores = async () => {
      try {
        const response = await axios.get('http://localhost:3000/profesores');
        setProfesores(response.data);
      } catch (error) {
        console.error('Error al obtener profesores:', error);
        alert('Error al obtener profesores');
      }
    };

    fetchGrados();
    fetchMaterias();
    fetchProfesores();
  }, []);

  useEffect(() => {
    // Actualizar las secciones según el grado seleccionado
    const fetchSecciones = async () => {
      if (gradoSeleccionado) {
        try {
          const response = await axios.get(`http://localhost:3000/secciones?id_grado=${gradoSeleccionado}`);
          setSecciones(response.data);
        } catch (error) {
          console.error('Error al obtener secciones:', error);
          alert('Error al obtener secciones');
        }
      } else {
        setSecciones([]);
      }
    };

    fetchSecciones();
  }, [gradoSeleccionado]);

  const onSubmit = async (data) => {
    // Transformar los campos a números
    const transformedData = {
      ...data,
      gradoId: Number(data.gradoId),
      seccionId: Number(data.seccionId),
      materiaId: Number(data.materiaId),
      profesorId: Number(data.profesorId),
    };

    try {
      await axios.post('http://localhost:3000/horarios/estudiante', transformedData);
      alert('Horario de estudiante creado exitosamente');
      reset();
    } catch (error) {
      console.error('Error al crear el horario de estudiante:', error);
      alert('Error al crear el horario de estudiante');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Formulario de Horario para Estudiante</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-md">
        
        {/* Grado */}
        <div className="mb-4">
          <label className="block text-gray-700">Grado</label>
          <select
            className={`border p-2 rounded-lg w-full ${errors.id_grado ? 'border-red-500' : ''}`}
            {...register('id_grado')}
          >
            <option value="">Seleccione un grado</option>
            {grados.map((grado) => (
              <option key={grado.id_grado} value={grado.id_grado}>
                {grado.nivel}
              </option>
            ))}
          </select>
          {errors.id_grado && <p className="text-red-500">{errors.id_grado.message}</p>}
        </div>

        {/* Sección */}
        <div className="mb-4">
          <label className="block text-gray-700">Sección</label>
          <select
            className={`border p-2 rounded-lg w-full ${errors.seccionId ? 'border-red-500' : ''}`}
            {...register('seccionId')}
            disabled={!gradoSeleccionado}
          >
            <option value="">Seleccione una sección</option>
            {secciones.map((seccion) => (
              <option key={seccion.id_Seccion} value={seccion.id_Seccion}>
                {seccion.nombre_Seccion}
              </option>
            ))}
          </select>
          {errors.seccionId && <p className="text-red-500">{errors.seccionId.message}</p>}
        </div>

        {/* Materia */}
        <div className="mb-4">
          <label className="block text-gray-700">Materia</label>
          <select
            className={`border p-2 rounded-lg w-full ${errors.id_Materia ? 'border-red-500' : ''}`}
            {...register('id_Materia')}
          >
            <option value="">Seleccione una materia</option>
            {materias.map((materia) => (
              <option key={materia.id_Materia} value={materia.id_Materia}>
                {materia.nombre_Materia}
              </option>
            ))}
          </select>
          {errors.id_Materia && <p className="text-red-500">{errors.id_Materia.message}</p>}
        </div>

        {/* Profesor */}
        <div className="mb-4">
          <label className="block text-gray-700">Profesor</label>
          <select
            className={`border p-2 rounded-lg w-full ${errors.profesorId ? 'border-red-500' : ''}`}
            {...register('profesorId')}
          >
            <option value="">Seleccione un profesor</option>
            {profesores.map((profesor) => (
              <option key={profesor.id} value={profesor.id}>
                {`${profesor.nombre_Profesor} ${profesor.apellido1_Profesor} ${profesor.apellido2_Profesor}`}
              </option>
            ))}
          </select>
          {errors.profesorId && <p className="text-red-500">{errors.profesorId.message}</p>}
        </div>

        {/* Día de la Semana */}
        <div className="mb-4">
          <label className="block text-gray-700">Día de la Semana</label>
          <select
            className={`border p-2 rounded-lg w-full ${errors.dia_semana_Horario ? 'border-red-500' : ''}`}
            {...register('dia_semana_Horario')}
          >
            <option value="">Seleccione un día</option>
            <option value="Lunes">Lunes</option>
            <option value="Martes">Martes</option>
            <option value="Miércoles">Miércoles</option>
            <option value="Jueves">Jueves</option>
            <option value="Viernes">Viernes</option>
            <option value="Sábado">Sábado</option>
            <option value="Domingo">Domingo</option>
          </select>
          {errors.dia_semana_Horario && <p className="text-red-500">{errors.dia_semana_Horario.message}</p>}
        </div>

        {/* Hora de Inicio */}
        <div className="mb-4">
          <label className="block text-gray-700">Hora de Inicio</label>
          <input
            type="time"
            className={`border p-2 rounded-lg w-full ${errors.hora_inicio_Horario ? 'border-red-500' : ''}`}
            {...register('hora_inicio_Horario')}
          />
          {errors.hora_inicio_Horario && <p className="text-red-500">{errors.hora_inicio_Horario.message}</p>}
        </div>

        {/* Botón de Enviar */}
        <button
          type="submit"
          className={`bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Enviando...' : 'Registrar Horario'}
        </button>
      </form>
    </div>
  );
};

export default FormularioHorarioEstudiante;
