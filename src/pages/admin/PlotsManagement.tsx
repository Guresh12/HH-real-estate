import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { Plot, Client } from '../../types/database';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Plus } from 'lucide-react';

export function PlotsManagement() {
  const queryClient = useQueryClient();
  const [selectedPlot, setSelectedPlot] = useState<Plot | null>(null);

  const { data: plots = [] } = useQuery<Plot[]>({
    queryKey: ['admin-plots'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('plots')
        .select('*, client:clients(*)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: clients = [] } = useQuery<Client[]>({
    queryKey: ['admin-clients-list'],
    queryFn: async () => {
      const { data, error } = await supabase.from('clients').select('*');
      if (error) throw error;
      return data;
    },
  });

  const updatePlotMutation = useMutation({
    mutationFn: async ({ id, status, client_id }: { id: string; status?: string; client_id?: string | null }) => {
      const updateData: any = {};
      if (status) updateData.status = status;
      if (client_id !== undefined) updateData.client_id = client_id;

      const { error } = await supabase
        .from('plots')
        .update(updateData)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-plots'] });
      setSelectedPlot(null);
    },
  });

  const handleStatusChange = (plot: Plot, newStatus: string) => {
    updatePlotMutation.mutate({ id: plot.id, status: newStatus });
  };

  const handleAssignClient = (plot: Plot, clientId: string) => {
    updatePlotMutation.mutate({
      id: plot.id,
      client_id: clientId || null,
      status: clientId ? 'Sold' : 'Available'
    });
  };

  return (
    <AdminLayout>
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Plots Management</h2>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Plot No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Client
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {plots.map((plot) => (
                <tr key={plot.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {plot.plot_no}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {plot.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {plot.size} sq ft
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${plot.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={plot.status}
                      onChange={(e) => handleStatusChange(plot, e.target.value)}
                      className="text-sm border rounded px-2 py-1"
                    >
                      <option>Available</option>
                      <option>Booked</option>
                      <option>Sold</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <select
                      value={plot.client_id || ''}
                      onChange={(e) => handleAssignClient(plot, e.target.value)}
                      className="border rounded px-2 py-1"
                    >
                      <option value="">No client</option>
                      {clients.map((client) => (
                        <option key={client.id} value={client.id}>
                          {client.name}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
