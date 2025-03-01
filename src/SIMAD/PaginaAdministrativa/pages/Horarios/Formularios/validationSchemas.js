// src/SIMAD/PaginaAdministrativa/pages/Horarios/Formularios/validationSchemas.js
import * as yup from 'yup';

export const HorarioEstudianteSchema = yup.object().shape({
  gradoId: yup.number().required('Grado es requerido'),
  seccionId: yup.number().required('Sección es requerida'),
  materiaId: yup.number().required('Materia es requerida'),
  profesorId: yup.number().required('Profesor es requerido'),
  aulaId: yup.number().required('Aula es requerida'),
  dia_semana_Horario: yup.string().required('Día de la semana es requerido'),
  // No valides "hora_inicio_Horario" y "hora_fin_Horario" al top-level
  // porque ahora se manejarán en un array con useFieldArray, uno por cada lección
});
