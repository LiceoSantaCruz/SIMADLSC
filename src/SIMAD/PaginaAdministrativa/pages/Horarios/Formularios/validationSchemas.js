// src/SIMAD/PaginaAdministrativa/pages/Horarios/Formularios/validationSchemas.js
import * as Yup from 'yup';

// src/SIMAD/PaginaAdministrativa/pages/Horarios/Formularios/validationSchemas.js

import * as yup from 'yup';

export const HorarioEstudianteSchema = yup.object().shape({
  gradoId: yup.number().required('Grado es requerido'),
  seccionId: yup.number().required('Sección es requerida'),
  materiaId: yup.number().required('Materia es requerida'),
  profesorId: yup.number().required('Profesor es requerido'),
  aulaId: yup.number().required('Aula es requerida'),
  dia_semana_Horario: yup.string().required('Día de la semana es requerido'),
  hora_inicio_Horario: yup.string().required('Hora de inicio es requerida'),
  hora_fin_Horario: yup
    .string()
    .required('Hora de fin es requerida')
    .test('is-greater', 'Hora de fin debe ser mayor que hora de inicio', function (value) {
      const { hora_inicio_Horario } = this.parent;
      return value > hora_inicio_Horario;
    }),
});

