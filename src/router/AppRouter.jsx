import {  Route, Routes } from "react-router-dom"
import { SimadRoutes } from "../SIMAD/routes/SimadRoutes";
import { AdminPage } from "../SIMAD/PaginaAdministrativa/AdminPage";

export const AppRouter = () => {

    const status = 'admi'; 

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
