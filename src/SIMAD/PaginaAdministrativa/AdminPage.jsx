import { SideBar } from './components/SideBar';
import { AdminRoutes } from './routes/AdminRoutes';

export const AdminPage = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar (posición fija a la izquierda) */}
      <SideBar />

      {/* Contenido principal */}
      <main className="flex-grow w-full overflow-y-auto overflow-x-hidden bg-gray-100 dark:bg-gray-950 p-4 md:p-6">
        <AdminRoutes />
      </main>
    </div>
  );
};
