// Top header bar with tabs and actions.
import { NavLink } from 'react-router-dom';
import { Menu, Bell, HelpCircle } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const TopHeaderBar = ({ onHamburgerClick, actionButton = null }) => {
  const { user } = useAuth();

  return (
    <div className="flex items-center justify-between gap-4 px-4 py-4 bg-white border-b border-slate-200 sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="lg:hidden p-2 rounded-md hover:bg-slate-100"
          onClick={onHamburgerClick}
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : 'text-slate-600'
            }
          >
            My Projects
          </NavLink>
          <NavLink
            to="/invoices/my"
            className={({ isActive }) =>
              isActive ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : 'text-slate-600'
            }
          >
            My Invoices
          </NavLink>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {actionButton}
        <button type="button" className="p-2 rounded-md hover:bg-slate-100" aria-label="Help">
          <HelpCircle className="w-5 h-5 text-slate-500" />
        </button>
        <button type="button" className="p-2 rounded-md hover:bg-slate-100" aria-label="Notifications">
          <Bell className="w-5 h-5 text-slate-500" />
        </button>
        <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center text-xs font-semibold text-slate-700">
          {user?.name ? user.name.slice(0, 2).toUpperCase() : 'FF'}
        </div>
      </div>
    </div>
  );
};

export default TopHeaderBar;
