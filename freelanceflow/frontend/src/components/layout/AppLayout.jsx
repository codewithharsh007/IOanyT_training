// Authenticated layout wrapper.
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopHeaderBar from './TopHeaderBar';
import MobileDrawer from './MobileDrawer';

const AppLayout = ({ children }) => {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar currentPath={location.pathname} />
      <MobileDrawer isOpen={isMobileDrawerOpen} onClose={() => setIsMobileDrawerOpen(false)} />
      <div className="flex-1 flex flex-col">
        <TopHeaderBar onHamburgerClick={() => setIsMobileDrawerOpen(true)} />
        <main className="p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
};

export default AppLayout;
