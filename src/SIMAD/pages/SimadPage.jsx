import React from 'react';
import AOS from 'aos';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'aos/dist/aos.css';
import '../../App.css';
import Navbar from '../components/Navbar';
import { Footer } from '../components/Footer';
import { HeroSection } from '../components/HeroSection';
import { Eventos } from '../components/Eventos';
import { InfoEducation } from '../components/InfoEducation';



const SimadPage = () => {

  React.useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true,
    });
  }, []);

 

  return (
    <div className="bg-gray-300 min-h-screen font-roboto"> {/* Usar Roboto como fuente principal */}

      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection/>

      {/* Sección de Educación Secundaria */}
      <InfoEducation/>

      {/* Eventos */}
      <Eventos/>

      {/* Footer */}
      <Footer/>

    </div>
  );
};

export default SimadPage;
