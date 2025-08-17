import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/presentation/store/hooks';
import { registerAsync, clearError } from '@/presentation/store/slices/authSlice';
import { APP_ROUTES } from '@/shared/constants/appConstants';
import { RegisterForm, RegisterFormData } from '@/presentation/forms/RegisterForm';

export const RegisterPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(APP_ROUTES.DASHBOARD, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = async (data: Omit<RegisterFormData, 'confirmPassword'>) => {
    const payload = { fullName: data.name, email: data.email, password: data.password };
    const result = await dispatch(registerAsync(payload));
    if (registerAsync.fulfilled.match(result)) {
      navigate(APP_ROUTES.DASHBOARD, { replace: true });
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-center text-secondary-900 mb-6">
        Create your account
      </h2>
      <RegisterForm onSubmit={handleSubmit} loading={loading} error={error || undefined} />
      <div className="mt-6 text-center">
        <span className="text-sm text-secondary-600">
          Already have an account?{' '}
          <Link
            to={APP_ROUTES.LOGIN}
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            Sign in here
          </Link>
        </span>
      </div>
    </>
  );
};