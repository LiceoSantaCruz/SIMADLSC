import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';

// Importa tu esquema SIN contexto
import { HorarioEstudianteSchema } from './validationSchemas';

const API_BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://simadlsc-backend-production.up.railway.app'
    : 'http://localhost:3000';

// Mapeo de lecciones a horarios (formato HH:mm)
// Definición de los horarios de lecciones
const lessonTimes = {
  "1": { start: "07:00", end: "07:40" },
  "2": { start: "07:40", end: "08:20" },
  "3": { start: "08:30", end: "09:10" },
  "4": { start: "09:10", end: "09:50" },
  "5": { start: "10:00", end: "10:40" },
  "6": { start: "10:40", end: "11:20" },
  "7": { start: "12:00", end: "12:40" },
  "8": { start: "12:40", end: "13:20" },
  "9": { start: "13:25", end: "14:05" },
  "10": { start: "14:05", end: "14:45" },
  "11": { start: "14:55", end: "15:35" },
  "12": { start: "15:35", end: "16:15" },
};

const FormularioHorarioEstudiante = ({
  onSubmitSuccess,
  onCancel,
  initialData = null,
  grados,
  materias,
  profesores,
  aulas,
}) => {
  const isEditing = !!initialData;

  // ---------------------
  // REACT HOOK FORM
  // ---------------------
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors, isSubmitting },
    reset,
    control,
  } = useForm({
    resolver: yupResolver(HorarioEstudianteSchema),
    defaultValues: {
      gradoId: '',
      seccionId: '',
      materiaId: '',
      profesorId: '',
      dia_semana_Horario: '',
      aulaId: '',
      lessons: [
        {
          lessonKey: '',
          hora_inicio_Horario: '',
          hora_fin_Horario: '',
        },
      ],
    },
  });

  // Manejar array dinámico de "lessons"
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'lessons',
  });

  const [errorGeneral, setErrorGeneral] = useState('');
  const gradoSeleccionado = watch('gradoId');
  const diaSeleccionado = watch('dia_semana_Horario');
  const seccionSeleccionada = watch('seccionId');

  // Secciones disponibles según el grado
  const [seccionesDisponibles, setSeccionesDisponibles] = useState([]);

  // ---------------------
  // 1. Cargar secciones según grado
  // ---------------------
  useEffect(() => {
    const fetchSecciones = async () => {
      if (gradoSeleccionado) {
        try {
          const response = await axios.get(`${API_BASE_URL}/secciones?gradoId=${gradoSeleccionado}`);
          setSeccionesDisponibles(response.data);
        } catch (error) {
          console.error('Error al obtener las secciones:', error);
          Swal.fire('Error', 'Hubo un problema al obtener las secciones.', 'error');
        }
      } else {
        setSeccionesDisponibles([]);
      }
    };
    fetchSecciones();
  }, [gradoSeleccionado]);

  // ---------------------
  // 2. Si estás en edición, rellena campos
  // ---------------------
  useEffect(() => {
    if (initialData) {
      setValue('gradoId', initialData.gradoId || '');
      setValue('seccionId', initialData.seccionId || '');
      setValue('materiaId', initialData.materiaId || '');
      setValue('profesorId', initialData.profesorId || '');
      setValue('dia_semana_Horario', initialData.dia_semana_Horario || '');
      setValue('aulaId', initialData.aulaId || '');
      // setValue('lessons', initialData.lessons || []);
    }
  }, [initialData, setValue]);

  // ---------------------
  // 3. Verificar lecciones ocupadas en DB
  // ---------------------
  const [occupiedLessons, setOccupiedLessons] = useState([]);
  
  useEffect(() => {
    // Cuando cambia el día o la sección, buscamos horarios existentes en esa sección
    // y filtramos los que coincidan con el día seleccionado.
    const fetchHorariosSeccion = async () => {
      if (diaSeleccionado && seccionSeleccionada) {
        try {
          const resp = await axios.get(`${API_BASE_URL}/horarios/seccion/${seccionSeleccionada}`);
          // Filtrar solo los del día seleccionado
          const sameDay = resp.data.filter(
            (item) => item.dia_semana_Horario === diaSeleccionado
          );
          // Convertir horarios en "lessonKeys" ocupados
          const used = [];
          sameDay.forEach((item) => {
            // item.hora_inicio_Horario e item.hora_fin_Horario están en "HH:MM:SS"
            const startHHmm = item.hora_inicio_Horario.substring(0, 5);
            const endHHmm = item.hora_fin_Horario.substring(0, 5);

            // Buscar en lessonTimes cuál key coincide
            const foundKey = Object.entries(lessonTimes).find(
              ([, val]) => val.start === startHHmm && val.end === endHHmm
            );
            if (foundKey) used.push(foundKey[0]);
          });
          setOccupiedLessons(used);
        } catch (error) {
          console.error('Error al obtener horarios de la seccion:', error);
        }
      } else {
        // Si no hay día o sección, no hay nada que filtrar
        setOccupiedLessons([]);
      }
    };

    fetchHorariosSeccion();
  }, [diaSeleccionado, seccionSeleccionada]);

  // ---------------------
  // 4. Función para obtener las lecciones disponibles
  // ---------------------
  const getAvailableLessons = (index) => {
    // Todas las lecciones definidas en lessonTimes
    let allKeys = Object.keys(lessonTimes);

    // (a) Eliminar las que ya estén ocupadas en la DB (occupiedLessons)
    allKeys = allKeys.filter((k) => !occupiedLessons.includes(k));

    // (b) Eliminar las que el usuario ya haya seleccionado en otro field
    const selectedLessons = watch('lessons').map((l) => l.lessonKey).filter(Boolean);
    const currentValue = selectedLessons[index]; // la lección actual (si ya está seleccionada)
    const selectedOthers = selectedLessons.filter((_, i) => i !== index);

    allKeys = allKeys.filter((k) => !selectedOthers.includes(k));

    // (c) Permitir que el valor actual se muestre aunque esté filtrado (por ejemplo, si está editando)
    if (
      currentValue &&
      !occupiedLessons.includes(currentValue) && // no está ocupada en la DB
      !selectedOthers.includes(currentValue) &&  // no está seleccionada en otro field
      !allKeys.includes(currentValue)
    ) {
      allKeys.push(currentValue);
    }

    return allKeys;
  };

  // ---------------------
  // 5. Cuando el usuario selecciona una "lessonKey"
  //    asignamos automáticamente hora_inicio y hora_fin
  // ---------------------
  const handleLessonChange = (lessonKey, index) => {
    if (lessonTimes[lessonKey]) {
      setValue(`lessons.${index}.hora_inicio_Horario`, lessonTimes[lessonKey].start);
      setValue(`lessons.${index}.hora_fin_Horario`, lessonTimes[lessonKey].end);
    } else {
      setValue(`lessons.${index}.hora_inicio_Horario`, '');
      setValue(`lessons.${index}.hora_fin_Horario`, '');
    }
  };

  // ---------------------
  // 6. onSubmit: Crear o editar horarios
  // ---------------------
  const onSubmit = async (formData) => {
    try {
      setErrorGeneral('');

      const {
        gradoId,
        seccionId,
        materiaId,
        profesorId,
        dia_semana_Horario,
        aulaId,
        lessons,
      } = formData;

      // Datos comunes
      const commonData = {
        gradoId: Number(gradoId),
        seccionId: Number(seccionId),
        materiaId: Number(materiaId),
        profesorId: Number(profesorId),
        aulaId: Number(aulaId),
        dia_semana_Horario,
      };

      // --- MODO EDICIÓN ---
      if (isEditing && initialData?.id_Horario) {
        // Supongamos que solo editas UNA lección (por ejemplo, la primera del array).
        const [firstLesson] = lessons;
        const updateData = {
          ...commonData,
          hora_inicio_Horario: firstLesson.hora_inicio_Horario,
          hora_fin_Horario: firstLesson.hora_fin_Horario,
        };

        const response = await axios.put(
          `${API_BASE_URL}/horarios/estudiante/${initialData.id_Horario}`,
          updateData
        );
        Swal.fire('Éxito', 'Horario de estudiante actualizado exitosamente.', 'success');
        reset();
        if (onSubmitSuccess) onSubmitSuccess(response.data);
        return;
      }

      // --- MODO CREACIÓN ---
      const createdHorarios = [];
      const createdLessonKeys = [];

      for (const lesson of lessons) {
        if (lesson.lessonKey) {
          const newHorarioData = {
            ...commonData,
            hora_inicio_Horario: lesson.hora_inicio_Horario,
            hora_fin_Horario: lesson.hora_fin_Horario,
          };

          const resp = await axios.post(`${API_BASE_URL}/horarios/estudiante`, newHorarioData);
          createdHorarios.push(resp.data);
          createdLessonKeys.push(lesson.lessonKey);
        }
      }

      // Mensaje de éxito con las lecciones creadas
      if (createdLessonKeys.length > 0) {
        Swal.fire(
          'Éxito',
          `Se crearon los horarios exitosamente para las lecciones: ${createdLessonKeys.join(', ')}`,
          'success'
        );
      } else {
        Swal.fire('Info', 'No se creó ningún horario (no se seleccionaron lecciones).', 'info');
      }

      // Quitar las lecciones ya creadas del formulario
      const newFields = watch('lessons').filter((l) => !createdLessonKeys.includes(l.lessonKey));
      reset(
        {
          ...formData,
          lessons: newFields,
        },
        {
          keepDefaultValues: true,
        }
      );

      if (onSubmitSuccess) onSubmitSuccess(createdHorarios);
    } catch (error) {
      console.error('Error al guardar el horario de estudiante:', error);

      if (error.response && error.response.data) {
        const {
          errors: backendErrors,
          message: backendMessage,
          error: backendError,
        } = error.response.data;

        // Manejo de validaciones del backend
        if (backendErrors && typeof backendErrors === 'object') {
          Object.keys(backendErrors).forEach((field) => {
            setError(field, { type: 'server', message: backendErrors[field] });
          });
        }

        const message =
          backendMessage || backendError || 'Hubo un problema al guardar el horario.';
        if (message) {
          setErrorGeneral(message);
        }

        Swal.fire(
          'Error',
          'Hubo un problema al guardar el horario. Revisa los errores en el formulario.',
          'error'
        );
      } else {
        setErrorGeneral('Hubo un problema inesperado al guardar el horario.');
        Swal.fire('Error', 'Hubo un problema al guardar el horario.', 'error');
      }
    }
  };

  // ---------------------
  // RENDER
  // ---------------------
  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="max-w-xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">
          {isEditing ? 'Editar Horario de Estudiante' : 'Crear Horario de Estudiante'}
        </h2>

        {errorGeneral && <p className="text-red-500 mb-4">{errorGeneral}</p>}

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Grado */}
          <div className="mb-4">
            <label className="block text-gray-700">Grado</label>
            <select
              className={`border p-2 rounded-lg w-full ${
                errors.gradoId ? 'border-red-500' : ''
              }`}
              {...register('gradoId')}
            >
              <option value="">Seleccione un grado</option>
              {grados.map((grado) => (
                <option key={grado.id_grado} value={grado.id_grado}>
                  {grado.nivel}
                </option>
              ))}
            </select>
            {errors.gradoId && <p className="text-red-500">{errors.gradoId.message}</p>}
          </div>

          {/* Sección */}
          <div className="mb-4">
            <label className="block text-gray-700">Sección</label>
            <select
              className={`border p-2 rounded-lg w-full ${
                errors.seccionId ? 'border-red-500' : ''
              }`}
              {...register('seccionId')}
              disabled={!gradoSeleccionado}
            >
              <option value="">Seleccione una sección</option>
              {seccionesDisponibles.map((seccion) => (
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
              className={`border p-2 rounded-lg w-full ${
                errors.materiaId ? 'border-red-500' : ''
              }`}
              {...register('materiaId')}
            >
              <option value="">Seleccione una materia</option>
              {materias.map((materia) => (
                <option key={materia.id_Materia} value={materia.id_Materia}>
                  {materia.nombre_Materia}
                </option>
              ))}
            </select>
            {errors.materiaId && <p className="text-red-500">{errors.materiaId.message}</p>}
          </div>

          {/* Profesor */}
          <div className="mb-4">
            <label className="block text-gray-700">Profesor</label>
            <select
              className={`border p-2 rounded-lg w-full ${
                errors.profesorId ? 'border-red-500' : ''
              }`}
              {...register('profesorId')}
            >
              <option value="">Seleccione un profesor</option>
              {profesores.map((profesor) => (
                <option key={profesor.id_Profesor} value={profesor.id_Profesor}>
                  {profesor.nombre_Profesor} {profesor.apellido1_Profesor} {profesor.apellido2_Profesor}
                </option>
              ))}
            </select>
            {errors.profesorId && <p className="text-red-500">{errors.profesorId.message}</p>}
          </div>

          {/* Aula */}
          <div className="mb-4">
            <label className="block text-gray-700">Aula</label>
            <select
              className={`border p-2 rounded-lg w-full ${
                errors.aulaId ? 'border-red-500' : ''
              }`}
              {...register('aulaId')}
            >
              <option value="">Seleccione un aula</option>
              {aulas.map((aula) => (
                <option key={aula.id_aula} value={aula.id_aula}>
                  {aula.nombre_Aula}
                </option>
              ))}
            </select>
            {errors.aulaId && <p className="text-red-500">{errors.aulaId.message}</p>}
          </div>

          {/* Día de la Semana */}
          <div className="mb-4">
            <label className="block text-gray-700">Día de la Semana</label>
            <select
              className={`border p-2 rounded-lg w-full ${
                errors.dia_semana_Horario ? 'border-red-500' : ''
              }`}
              {...register('dia_semana_Horario')}
            >
              <option value="">Seleccione un día</option>
              <option value="Lunes">Lunes</option>
              <option value="Martes">Martes</option>
              <option value="Miércoles">Miércoles</option>
              <option value="Jueves">Jueves</option>
              <option value="Viernes">Viernes</option>
            </select>
            {errors.dia_semana_Horario && (
              <p className="text-red-500">{errors.dia_semana_Horario.message}</p>
            )}
          </div>

          {/* LECCIONES DINÁMICAS */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Lecciones</label>
            {fields.map((field, index) => (
              <div key={field.id} className="border p-4 mb-4 rounded relative">
                <label className="block text-gray-700">
                  Lección #{index + 1}
                </label>
                <select
                  className="border p-2 rounded-lg w-full mt-1"
                  {...register(`lessons.${index}.lessonKey`)}
                  onChange={(e) => handleLessonChange(e.target.value, index)}
                >
                  <option value="">Seleccione una lección</option>
                  {getAvailableLessons(index).map((key) => (
                    <option key={key} value={key}>
                      {key} Lección
                    </option>
                  ))}
                </select>

                {/* Campos ocultos para las horas */}
                <input
                  type="hidden"
                  {...register(`lessons.${index}.hora_inicio_Horario`)}
                />
                <input
                  type="hidden"
                  {...register(`lessons.${index}.hora_fin_Horario`)}
                />

                {/* Botón para eliminar esta lección si hay más de una */}
                {fields.length > 1 && (
                  <button
                    type="button"
                    className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    onClick={() => remove(index)}
                  >
                    Eliminar
                  </button>
                )}
              </div>
            ))}

            {/* Botón para agregar otra lección */}
            <button
              type="button"
              className="bg-green-500 text-white px-4 py-2 rounded w-full hover:bg-green-600"
              onClick={() =>
                append({
                  lessonKey: '',
                  hora_inicio_Horario: '',
                  hora_fin_Horario: '',
                })
              }
            >
              Agregar otra lección
            </button>
          </div>

          {/* BOTONES DE ACCIÓN */}
          <div className="flex flex-col sm:flex-row justify-end mt-6 space-y-2 sm:space-y-0 sm:space-x-2">
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 w-full sm:w-auto"
              onClick={() => {
                reset();
                setErrorGeneral('');
                if (onCancel) onCancel();
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full sm:w-auto ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Guardando...'
                : isEditing
                ? 'Guardar Cambios'
                : 'Registrar Horario(s)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

FormularioHorarioEstudiante.propTypes = {
  onSubmitSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  initialData: PropTypes.object,
  grados: PropTypes.array.isRequired,
  materias: PropTypes.array.isRequired,
  profesores: PropTypes.array.isRequired,
  aulas: PropTypes.array.isRequired,
};

export default FormularioHorarioEstudiante;
