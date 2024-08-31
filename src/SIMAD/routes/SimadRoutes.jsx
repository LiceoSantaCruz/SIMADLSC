import { Navigate, Route, Routes } from "react-router-dom"

import SimadPage from "../PaginaInformativa/SimadPage"
import SobreNosotros from "../PaginaInformativa/pages/SobreNosotros"
import Servicios from "../PaginaInformativa/pages/Servicios"
import RegisterPage from "../../auth/pages/RegisterPage"
import LoginPage from "../../auth/pages/LoginPage"
import Contacto from "../PaginaInformativa/pages/Contacto"

export const SimadRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={ <SimadPage /> } />
        <Route path="/about" element={<SobreNosotros />} /> {/* Rutas agregadas */}
        <Route path="/services" element={<Servicios />} />  {/* Rutas agregadas */}
        <Route path="/contact" element={<Contacto />} /> 
        <Route path="/register" element={ <RegisterPage /> } /> 
        <Route path="/login" element={ <LoginPage /> } /> 
        <Route path="/*" element={ <Navigate to="/" /> } />
    </Routes>
  )
}
