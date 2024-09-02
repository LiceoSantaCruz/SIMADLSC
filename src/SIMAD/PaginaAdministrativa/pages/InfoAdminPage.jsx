import { Estadisticas } from "../components/Estadisticas"
import { EventList } from "../components/EventList"

export const InfoAdminPage = () => {
  return (
    <div className="p-6">
        <Estadisticas/>
        <EventList/>
    </div>
  )
}
