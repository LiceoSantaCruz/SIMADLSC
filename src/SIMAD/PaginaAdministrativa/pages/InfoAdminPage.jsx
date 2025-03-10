import { Estadisticas } from "../components/Estadisticas"
import { GraficaSeccionesPorGrado } from "../components/GraficaSeccionesPorGrado"
import { EventList } from "../components/EventList"
import { WelcomeMessage } from "../components/WelcomeMessage"

export const InfoAdminPage = () => {
  return (
    <div className="p-6">
      <WelcomeMessage/>
        <Estadisticas/>
        <GraficaSeccionesPorGrado/>
        <EventList/>
    </div>
  )
}
