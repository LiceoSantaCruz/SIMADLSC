
export const InfoEducation = () => {
  return (
    <div>
        <section className="py-16 bg-blue-800 text-white" data-aos="fade-up"> {/* Azul oscuro para fondo de sección */}
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-semibold mb-6">Nuestra Educación Secundaria</h3>
          <p className="mb-10 max-w-2xl mx-auto text-gray-300">En el Liceo Santa Cruz, nos especializamos en brindar una educación secundaria de calidad que prepara a nuestros estudiantes para los retos del futuro.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-blue-700 p-8 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <h4 className="text-2xl font-bold text-white mb-4">Currículo Académico</h4>
              <p className="text-gray-300">Nuestro currículo está diseñado para proporcionar una educación integral, enfocada en el desarrollo de habilidades críticas y conocimiento profundo en diversas disciplinas.</p>
            </div>
            <div className="bg-blue-700 p-8 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <h4 className="text-2xl font-bold text-white mb-4">Actividades Extracurriculares</h4>
              <p className="text-gray-300">Ofrecemos una variedad de actividades extracurriculares que complementan la educación académica y fomentan habilidades sociales y de liderazgo.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
  