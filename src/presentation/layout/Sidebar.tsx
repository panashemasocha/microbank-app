import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  CreditCard, 
  Users, 
  Settings, 
  X 
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/presentation/store/hooks';
import { setSidebarOpen } from '@/presentation/store/slices/uiSlice';
import { APP_ROUTES, USER_ROLES } from '@/shared/constants/appConstants';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  requiredRole?: keyof typeof USER_ROLES;
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: APP_ROUTES.DASHBOARD, icon: Home },
  { name: 'Transactions', href: '/transactions', icon: CreditCard },
  { name: 'Clients', href: APP_ROUTES.ADMIN_CLIENTS, icon: Users, requiredRole: 'ADMIN' },
  { name: 'Settings', href: '/settings', icon: Settings, requiredRole: 'CLIENT' },
];

export const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { sidebarOpen } = useAppSelector((state) => state.ui);
  const { user } = useAppSelector((state) => state.auth);
  const location = useLocation();

  const filteredNavigation = navigation.filter(
    item => !item.requiredRole || user?.role === item.requiredRole
  );

  const navToRender = user?.role === 'ADMIN'
    ? navigation.filter(item => item.name === 'Dashboard' || item.name === 'Clients')
    : filteredNavigation;

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => dispatch(setSidebarOpen(false))}
        >
          <div className="fixed inset-0 bg-secondary-600 bg-opacity-75" />
        </div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-secondary-200 transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-secondary-200">
          <span className="text-lg font-semibold text-secondary-900">MicroBank</span>
          <button
            onClick={() => dispatch(setSidebarOpen(false))}
            className="lg:hidden text-secondary-500 hover:text-secondary-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          <ul className="space-y-1">
            {navToRender.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <li key={item.name}>
                  <NavLink
                    to={item.href}
                    className={`
                      group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                      ${isActive
                        ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-500'
                        : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50'
                      }
                    `}
                    onClick={() => dispatch(setSidebarOpen(false))}
                  >
                    <item.icon className={`
                      mr-3 h-5 w-5 transition-colors
                      ${isActive ? 'text-primary-500' : 'text-secondary-400 group-hover:text-secondary-500'}
                    `} />
                    {item.name}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
};
