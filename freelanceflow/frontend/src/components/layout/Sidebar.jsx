// Desktop sidebar navigation.
import { NavLink } from 'react-router-dom';
import {
  Squares2X2Icon,
  UserGroupIcon,
  FolderIcon,
  DocumentTextIcon,
  ClockIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: Squares2X2Icon },
  { label: 'Clients', to: '/clients', icon: UserGroupIcon },
  { label: 'Projects', to: '/projects', icon: FolderIcon },
  { label: 'Invoices', to: '/invoices', icon: DocumentTextIcon },
  { label: 'Time Logs', to: '/time-logs', icon: ClockIcon },
  { label: 'Settings', to: '/settings', icon: Cog6ToothIcon },
];

const Sidebar = ({ currentPath }) => (
  <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-slate-200 min-h-screen px-4 py-6">
    <div className="flex items-center gap-2 px-2 mb-8">
      <div className="w-8 h-8 rounded-lg bg-blue-600"></div>
      <span className="text-lg font-semibold text-slate-900">FreelanceFlow</span>
    </div>
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentPath === item.to;
        return (
          <NavLink
            key={item.label}
            to={item.to}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
              isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        );
      })}
    </nav>
  </aside>
);

export default Sidebar;
