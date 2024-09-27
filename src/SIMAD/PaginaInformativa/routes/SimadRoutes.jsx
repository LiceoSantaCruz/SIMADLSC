import { Navigate, Route, Routes } from "react-router-dom"
import SimadPage from "../SimadPage"
import LoginPage from "../../../auth/pages/LoginPage"
// import {ForgotPassword} from "../../../auth/pages/ForgotPassword"
// import {ResetPassword} from "../../../auth/pages/ResetPassword"


export const SimadRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={ <SimadPage /> } />

        <Route path="/*" element={ <Navigate to="/" /> } />
        
        <Route path="/login" element={ <LoginPage /> } /> 

        {/* <Route path="forgot-password" element={<ForgotPassword />} />

        <Route path="reset-password" element={<ResetPassword />} /> */}
    </Routes>
  )
}
