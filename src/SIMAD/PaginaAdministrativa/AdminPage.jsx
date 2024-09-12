import {SideBar} from './components/SideBar';
import { AdminRoutes } from './routes/AdminRoutes';



export const AdminPage = () => {
    return (
        <>  

            <div className="flex h-screen">

                <SideBar />
                
                <AdminRoutes/>

            </div>

            
        </>
    );
};

