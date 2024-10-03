// src/SIMAD/PaginaAdministrativa/pages/Horarios/Formularios/validationSchemas.js
import * as Yup from 'yup';

export const HorarioEstudianteSchema = Yup.object().shape({
  gradoId: Yup.number()
    .required('El grado es obligatorio')
    .positive('El grado debe ser un número positivo')
    .integer('El grado debe ser un número entero'),
  seccionId: Yup.number()
    .required('La sección es obligatoria')
    .positive('La sección debe ser un número positivo')
    .integer('La sección debe ser un número entero'),
  materiaId: Yup.number()
    .required('La materia es obligatoria')
    .positive('La materia debe ser un número positivo')
    .integer('La materia debe ser un número entero'),
  profesorId: Yup.number()
    .required('El profesor es obligatorio')
    .positive('El profesor debe ser un número positivo')
    .integer('El profesor debe ser un número entero'),
  dia_semana_Horario: Yup.string()
    .required('El día de la semana es obligatorio')
    .oneOf(['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'], 'Día de la semana inválido'),
  hora_inicio_Horario: Yup.string()
    .required('La hora de inicio es obligatoria')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Hora de inicio inválida'),
});


export const ProfesorSchema = Yup.object().shape({
  profesorId: Yup.number()
    .typeError('El profesor ID debe ser un número')
    .required('El profesor ID es obligatorio'),
  
  gradoId: Yup.number()
    .typeError('El grado ID debe ser un número')
    .required('El grado ID es obligatorio'),
  
  materiaId: Yup.number()
    .typeError('El materia ID debe ser un número')
    .required('El materia ID es obligatorio'),
  
  dia_semana_Horario: Yup.string()
    .oneOf(['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'], 'Día de semana inválido')
    .required('El día de la semana es obligatorio'),
  
  hora_inicio_Horario: Yup.string()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Hora de inicio inválida')
    .required('La hora de inicio es obligatoria'),
  
  hora_fin_Horario: Yup.string()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Hora de fin inválida')
    .required('La hora de fin es obligatoria'),
  
  aulaId: Yup.number()
    .typeError('El aula ID debe ser un número')
    .required('El aula ID es obligatorio'),
});
