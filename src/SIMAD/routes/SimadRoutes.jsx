import { Navigate, Route, Routes } from "react-router-dom"
import SimadPage from "../pages/SimadPage"
import RegisterPage from "../../auth/pages/RegisterPage"
import LoginPage from "../../auth/pages/LoginPage"
export const SimadRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={ <SimadPage /> } />
        <Route path="/register" element={ <RegisterPage /> } /> 
        <Route path="/login" element={ <LoginPage /> } /> 
        <Route path="/*" element={ <Navigate to="/" /> } />
    </Routes>
  )
}
