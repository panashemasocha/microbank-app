import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/presentation/store/store';
import { MainLayout } from '@/presentation/layout/MainLayout';
import { AuthLayout } from '@/presentation/layout/AuthLayout';
import { APP_ROUTES } from '@/shared/constants/appConstants';
import './index.css';
import { ErrorBoundary } from './presentation/components/common/ErrorBoundary';
import { ProtectedRoute } from './presentation/components/common/ProtectedRoute';
import { AdminClientsPage } from './presentation/pages/AdminClientsPage';
import { DashboardPage } from './presentation/pages/DashboardPage';
import { LoginPage } from './presentation/pages/LoginPage';
import { RegisterPage } from './presentation/pages/RegisterPage';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<AuthLayout />}>
              <Route index element={<Navigate to={APP_ROUTES.LOGIN} replace />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
            </Route>

            {/* Protected Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }>
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="admin/clients" element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AdminClientsPage />
                </ProtectedRoute>
              } />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to={APP_ROUTES.DASHBOARD} replace />} />
          </Routes>
        </Router>
      </ErrorBoundary>
    </Provider>
  );
};

export default App;