import React, { useEffect } from 'react';
import { Users, Shield, ShieldOff } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/presentation/store/hooks';
import { getClientsAsync, toggleBlacklistAsync } from '@/presentation/store/slices/adminSlice';
import { User } from '@/domain/entities/User';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const AdminClientsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { clients, loading, error } = useAppSelector((state) => state.admin);

  useEffect(() => {
    dispatch(getClientsAsync());
  }, [dispatch]);

  const handleToggleBlacklist = async (client: User) => {
    await dispatch(toggleBlacklistAsync({ 
      clientId: client.id, 
      isBlacklisted: client.isBlacklisted 
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Users className="w-8 h-8 text-primary-600" />
          <h1 className="text-2xl font-bold text-secondary-900">Client Management</h1>
        </div>
        <Button onClick={() => dispatch(getClientsAsync())}>
          Refresh
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <Card>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : (
            <table className="min-w-full divide-y divide-secondary-200">
              <thead className="bg-secondary-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Join Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-secondary-200">
                {clients.filter(client => client.role === 'CLIENT').map((client) => (
                  <tr key={client.id} className="hover:bg-secondary-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-700 font-medium">
                            {client.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-secondary-900">
                            {client.username}
                          </div>
                          <div className="text-sm text-secondary-500">
                            ID: {client.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                      {client.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                      {formatDate(client.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        client.isBlacklisted
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {client.isBlacklisted ? 'Blacklisted' : 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button
                        size="sm"
                        variant={client.isBlacklisted ? 'secondary' : 'danger'}
                        icon={client.isBlacklisted ? Shield : ShieldOff}
                        onClick={() => handleToggleBlacklist(client)}
                      >
                        {client.isBlacklisted ? 'Unblacklist' : 'Blacklist'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {!loading && clients.filter(client => client.role === 'CLIENT').length === 0 && (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
            <p className="text-secondary-500">No clients found</p>
          </div>
        )}
      </Card>
    </div>
  );
};