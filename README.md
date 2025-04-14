# 🎓 SIMADLSC - Sistema de Gestión Académica

**SIMADLSC** es una plataforma web desarrollada en **React** para la administración educativa de un colegio. Diseñada para gestionar horarios, matrícula, asistencia, eventos y más, con soporte para distintos roles de usuario.

## 📁 Organización del Proyecto

```
src/
├── SIMAD/                  # Módulo central del sistema
│   └── PaginaAdministrativa/pages/
│       ├── Horarios/
│       ├── Matricula/
│       ├── Asistencias/
│       └── Eventos/
├── auth/                   # Lógica de autenticación y roles
├── components/             # Componentes reutilizables globales
├── router/                 # Configuración de rutas con React Router
```

## 👥 Roles del Sistema

- **Administrador**: Gestiona horarios, usuarios, eventos, matrícula y asistencia.
- **Profesor**: Visualiza su horario, pasa asistencia y consulta eventos.
- **Estudiante**: Consulta su horario y eventos asignados.


## ⚙️ Tecnologías Utilizadas

- **React + Vite**
- **TailwindCSS** (diseño responsivo)
- **SweetAlert2** (alertas personalizadas)
- **jsPDF** (exportación de horarios)
- **React Router DOM**
- **Modo oscuro habilitado**

## ✅ Funcionalidades Clave

- Visualización de horarios personalizados por rol
- Filtrado dinámico de horarios y secciones
- Exportación de horarios a PDF con diseño limpio
- Gestión de eventos y matrícula por módulo
- Protección de rutas según rol del usuario


## 👨‍💻 Autores

Desarrollado por **Cristian Aguirre,Victor Bustos,Gerald Lanza,Alejandro Obando,Joan Pereza **  
Repositorio y despliegue: [GitHub & Vercel]  
Tecnologías enfocadas en usabilidad, rendimiento y escalabilidad.
