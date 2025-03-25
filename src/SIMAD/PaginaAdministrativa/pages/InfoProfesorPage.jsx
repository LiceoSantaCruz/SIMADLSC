// src/pages/InfoProfesorPage.jsx
export const InfoProfesorPage = () => (
  <div className="p-4 md:p-6 min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
    <div className="max-w-3xl mx-auto text-center space-y-6">
      <h1 className="text-3xl font-bold">Bienvenido, Profesor</h1>
      <p className="text-lg">
        ¡Gracias por tu dedicación! <br />
        Aquí encontrarás toda la información importante para tus clases.
      </p>
      <img
        src="/images/IMG_0675.JPG"
        alt="Profesor"
        className="rounded-xl shadow-lg w-full max-w-md mx-auto"
      />
    </div>
  </div>
);

export default InfoProfesorPage;
