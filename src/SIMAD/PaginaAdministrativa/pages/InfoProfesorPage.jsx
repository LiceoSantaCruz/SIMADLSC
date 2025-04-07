import { WelcomeMessage } from "../components/WelcomeMessage";
import { Estadisticas } from "../components/Estadisticas";
import { GraficaSeccionesPorGrado } from "../components/GraficaSeccionesPorGrado";
import { EventList } from "../components/EventList";
export const InfoProfesorPage = () => (
  <div className="p-4 md:p-6 min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100 transition-colors duration-300 overflow-x-hidden">
    <div className="w-full space-y-12">
      <WelcomeMessage />
      <Estadisticas />
      <GraficaSeccionesPorGrado />
      <EventList />
    </div>
  </div>
);

export default InfoProfesorPage;
