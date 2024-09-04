import { useEffect } from 'react';
import 'aos/dist/aos.css';
import AOS from 'aos';

export const HeroSection = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div>
      <section className="h-96 flex items-center justify-center relative bg-hero bg-cover bg-center">
        {/* Superposición para el fondo */}
        <div className="absolute inset-0 bg-black opacity-50"></div>

        {/* Tarjeta Translúcida */}
        <div className="relative p-10 bg-black bg-opacity-70 rounded-lg shadow-lg text-center text-white" data-aos="fade-up">
          <h2 className="text-5xl font-bold">Bienvenido al Liceo Santa Cruz</h2>
          <p className="mt-4 text-lg">Somos una huella de éxito en el tiempo, con el futuro en tus manos.</p>
        </div>
      </section>
    </div>
  );
};

