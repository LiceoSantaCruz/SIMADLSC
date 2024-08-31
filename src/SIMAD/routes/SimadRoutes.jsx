import { Navigate, Route, Routes } from "react-router-dom"
import SimadPage from "../pages/SimadPage"
import SobreNosotros from "../components/SobreNosotros"
import Servicios from "../components/Servicios"
import Contacto from "../components/Contacto"
import RegisterPage from "../../auth/pages/RegisterPage"
import LoginPage from "../../auth/pages/LoginPage"

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
