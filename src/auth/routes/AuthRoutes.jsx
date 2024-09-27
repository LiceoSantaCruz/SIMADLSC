import { Navigate, Route, Routes } from "react-router-dom"
import LoginPage from "../pages/LoginPage"
import {ForgotPassword} from "../pages/ForgotPassword"
import {ResetPassword} from "../pages/ResetPassword"

export const AuthRoutes = () => {
  return (
    <Routes>
        <Route path="login" element={ <LoginPage /> } />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
        <Route path='/*' element={ <Navigate to="/auth/login" /> } />
    </Routes>
  )
}
