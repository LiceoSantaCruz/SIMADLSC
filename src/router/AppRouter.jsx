import { Navigate, Route, Routes } from "react-router-dom"
import { SimadRoutes } from "../SIMAD/routes/SimadRoutes";
import { AuthRoutes } from "../auth/routes/AuthRoutes";

export const AppRouter = () => {

    const status = 'authenticated'; 

  return (
    <Routes>

    {
      (status === 'authenticated')
       ? <Route path="/*" element={ <SimadRoutes /> } />
       : <Route path="/auth/*" element={ <AuthRoutes /> } />
    }

    <Route path='/*' element={ <Navigate to='/auth/login' />  } />



</Routes>
    
  )
}
