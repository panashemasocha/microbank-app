import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { User } from '@/domain/entities/User';
import { AdminRepositoryImpl } from '@/infrastructure/repositories/AdminRepositoryImpl';
import { getErrorMessage } from '@/shared/utils/errors';

interface AdminState {
  clients: User[];
  loading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  clients: [],
  loading: false,
  error: null,
};

const adminRepository = new AdminRepositoryImpl();

export const getClientsAsync = createAsyncThunk<
  User[],
  void,
  { rejectValue: string }
>(
  'admin/getClients',
  async (_, { rejectWithValue }) => {
    try {
      return await adminRepository.getClients();
    } catch (err: unknown) {
      return rejectWithValue(getErrorMessage(err, 'Failed to get clients'));
    }
  }
);

export const toggleBlacklistAsync = createAsyncThunk<
  { clientId: string; isBlacklisted: boolean },
  { clientId: string; isBlacklisted: boolean },
  { rejectValue: string }
>(
  'admin/toggleBlacklist',
  async (
    { clientId, isBlacklisted }: { clientId: string; isBlacklisted: boolean },
    { rejectWithValue }
  ) => {
    try {
      if (isBlacklisted) {
        await adminRepository.unblacklistClient(clientId);
      } else {
        await adminRepository.blacklistClient(clientId);
      }
      return { clientId, isBlacklisted: !isBlacklisted };
    } catch (err: unknown) {
      return rejectWithValue(
        getErrorMessage(err, 'Failed to update blacklist status')
      );
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Clients
      .addCase(getClientsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getClientsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.clients = action.payload;
      })
      .addCase(getClientsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Toggle Blacklist
      .addCase(toggleBlacklistAsync.fulfilled, (state, action) => {
        const { clientId, isBlacklisted } = action.payload;
        const client = state.clients.find(c => c.id === clientId);
        if (client) {
          client.isBlacklisted = isBlacklisted;
        }
      })
      .addCase(toggleBlacklistAsync.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = adminSlice.actions;
export default adminSlice.reducer;
