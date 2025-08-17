import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { User } from '@/domain/entities/User';
import { AuthRepositoryImpl } from '@/infrastructure/repositories/AuthRepositoryImpl';
import { LoginCredentials, RegisterData, AuthResponse } from '@/domain/repositories/AuthRepository';
import { StorageService } from '@/shared/services/storageService';
import { getErrorMessage } from '@/shared/utils/errors';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: StorageService.getUser(),
  token: StorageService.getToken(),
  isAuthenticated: StorageService.isAuthenticated(),
  loading: false,
  error: null,
};

const authRepository = new AuthRepositoryImpl();

export const loginAsync = createAsyncThunk<
  AuthResponse,
  LoginCredentials,
  { rejectValue: string }
>('auth/login', async (credentials: LoginCredentials, { rejectWithValue }) => {
  try {
    const response = await authRepository.login(credentials);
    StorageService.setToken(response.token);
    StorageService.setUser(response.user);
    if (response.refreshToken) {
      StorageService.setRefreshToken(response.refreshToken);
    }
    return response;
  } catch (err: unknown) {
    return rejectWithValue(getErrorMessage(err, 'Login failed'));
  }
});

export const registerAsync = createAsyncThunk<
  AuthResponse,
  RegisterData,
  { rejectValue: string }
>('auth/register', async (data: RegisterData, { rejectWithValue }) => {
  try {
    const response = await authRepository.register(data);
    StorageService.setToken(response.token);
    StorageService.setUser(response.user);
    if (response.refreshToken) {
      StorageService.setRefreshToken(response.refreshToken);
    }
    return response;
  } catch (err: unknown) {
    return rejectWithValue(getErrorMessage(err, 'Registration failed'));
  }
});

export const getProfileAsync = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>('auth/getProfile', async (_, { rejectWithValue }) => {
  try {
    const user = await authRepository.getProfile();
    StorageService.setUser(user);
    return user;
  } catch (err: unknown) {
    return rejectWithValue(getErrorMessage(err, 'Failed to get profile'));
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      StorageService.clearAuth();
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Register
      .addCase(registerAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get Profile
      .addCase(getProfileAsync.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;