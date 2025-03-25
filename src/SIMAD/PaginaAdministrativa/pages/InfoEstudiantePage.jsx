// src/pages/InfoEstudiantePage.jsx
export const InfoEstudiantePage = () => (
  <div className="p-4 md:p-6 min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
    <div className="max-w-3xl mx-auto text-center space-y-6">
      <h1 className="text-3xl font-bold">¡Hola, Estudiante!</h1>
      <p className="text-lg">
        Recuerda que cada día es una oportunidad para aprender algo nuevo. <br />
        <span className="text-blue-500 dark:text-blue-400 font-medium">¡Sigue adelante!</span>
      </p>
      <img
        src="/images/IMG_9317.JPG"
        alt="Estudiante"
        className="rounded-xl shadow-lg w-full max-w-md mx-auto"
      />
    </div>
  </div>
);

export default InfoEstudiantePage;
