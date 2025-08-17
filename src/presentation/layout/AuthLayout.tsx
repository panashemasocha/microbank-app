import React from 'react';
import { Outlet } from 'react-router-dom';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-secondary-900">
            Kenac MicroBank
          </h2>
          <p className="mt-2 text-sm text-secondary-600">
            Your trusted banking partner
          </p>
        </div>
        <div className="bg-white py-8 px-6 shadow rounded-lg">
          <Outlet />
        </div>
      </div>
    </div>
  );
};