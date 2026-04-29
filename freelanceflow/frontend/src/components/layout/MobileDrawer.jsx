// Mobile navigation drawer.
import { NavLink } from 'react-router-dom';
import { X, Grid, Users, Folder, FileText, Clock, Settings } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: Grid },
  { label: 'Clients', to: '/clients', icon: Users },
  { label: 'Projects', to: '/projects', icon: Folder },
  { label: 'Invoices', to: '/invoices', icon: FileText },
  { label: 'Time Logs', to: '/time-logs', icon: Clock },
  { label: 'Settings', to: '/settings', icon: Settings },
];

const MobileDrawer = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} aria-hidden="true"></div>
      <div className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-lg p-4">
        <div className="flex items-center justify-between mb-6">
          <span className="text-lg font-semibold text-slate-900">FreelanceFlow</span>
          <button type="button" className="p-2" onClick={onClose} aria-label="Close menu">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.label}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${
                    isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default MobileDrawer;
