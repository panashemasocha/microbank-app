import React from 'react';
import { Menu, LogOut, Settings } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/presentation/store/hooks';
import { logout } from '@/presentation/store/slices/authSlice';
import { toggleSidebar } from '@/presentation/store/slices/uiSlice';
import { Button } from '../components/Button';

export const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="bg-white border-b border-secondary-200 h-16 flex items-center justify-between px-6">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="sm"
          icon={Menu}
          onClick={() => dispatch(toggleSidebar())}
          className="lg:hidden"
        />
        <h1 className="text-xl font-semibold text-secondary-900 ml-4">
          Kenac MicroBank
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        <div className="text-sm text-secondary-600">
          Welcome, <span className="font-medium">{user?.username}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" icon={Settings} />
          <Button variant="ghost" size="sm" icon={LogOut} onClick={handleLogout} />
        </div>
      </div>
    </header>
  );
};