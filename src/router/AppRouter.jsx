import {  Route, Routes } from "react-router-dom"
import { SimadRoutes } from "../SIMAD/PaginaInformativa/routes/SimadRoutes";
import { AdminPage } from "../SIMAD/PaginaAdministrativa/AdminPage";

export const AppRouter = () => {

    const status = 'admin'; 

  return (
    <Routes>

    {
      (status === 'admin')
       ? <Route path="/*" element={ <AdminPage/> } />
       : <Route path="*" element={ <SimadRoutes /> } />
    }




</Routes>
    
  )
}
