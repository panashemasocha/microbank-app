import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@/presentation/store/hooks';
import { loginAsync, clearError } from '@/presentation/store/slices/authSlice';
import { APP_ROUTES } from '@/shared/constants/appConstants';
import { LoginForm, LoginFormData } from '@/presentation/forms/LoginForm';

export const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, error, isAuthenticated, user } = useAppSelector((state) => state.auth);

  const from = (
    (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ??
    APP_ROUTES.DASHBOARD
  );

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === 'ADMIN') {
        // Force admins to dashboard regardless of where they came from
        navigate(APP_ROUTES.DASHBOARD, { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    }
  }, [isAuthenticated, user?.role, navigate, from]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = async (data: LoginFormData) => {
    const result = await dispatch(loginAsync(data));
    if (loginAsync.fulfilled.match(result)) {
      const role = result.payload.user.role;
      if (role === 'ADMIN') {
        navigate(APP_ROUTES.DASHBOARD, { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-center text-secondary-900 mb-6">
        Sign in to your account
      </h2>
      <LoginForm onSubmit={handleSubmit} loading={loading} error={error || undefined} />
      <div className="mt-6 text-center">
        <span className="text-sm text-secondary-600">
          Don't have an account?{' '}
          <Link
            to={APP_ROUTES.REGISTER}
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            Create one here
          </Link>
        </span>
      </div>
    </>
  );
};