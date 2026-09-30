import { Outlet } from 'react-router-dom';
import { InventoryProvider } from '../../context/InventoryContext.jsx';
import Header from './Header.jsx';
import Sidebar from './Sidebar.jsx';

function MainLayout() {
  return (
    <InventoryProvider>
      <div className="min-h-screen bg-[#f5f7fb] text-slate-900">
        <Sidebar />
        <div className="min-h-screen lg:pl-[315px]">
          <Header />
          <main className="px-4 py-9 sm:px-6 lg:px-9">
            <Outlet />
          </main>
        </div>
      </div>
    </InventoryProvider>
  );
}

export default MainLayout;
