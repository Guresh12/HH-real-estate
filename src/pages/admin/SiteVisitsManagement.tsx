import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { SiteVisit } from '../../types/database';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Calendar, Mail, Phone } from 'lucide-react';

export function SiteVisitsManagement() {
  const queryClient = useQueryClient();

  const { data: visits = [] } = useQuery<SiteVisit[]>({
    queryKey: ['admin-site-visits'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_visits')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('site_visits')
        .update({ status })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-site-visits'] });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout>
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Site Visits Management</h2>

        <div className="space-y-4">
          {visits.map((visit) => (
            <div key={visit.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{visit.client_name}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600">
                        <Mail className="h-4 w-4 mr-2" />
                        <span className="text-sm">{visit.email}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        <span className="text-sm">{visit.phone}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span className="text-sm">
                          {new Date(visit.preferred_date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    {visit.notes && (
                      <div>
                        <p className="text-sm text-gray-600">{visit.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="ml-4">
                  <select
                    value={visit.status}
                    onChange={(e) =>
                      updateStatusMutation.mutate({ id: visit.id, status: e.target.value })
                    }
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(visit.status)}`}
                  >
                    <option>Pending</option>
                    <option>Scheduled</option>
                    <option>Completed</option>
                    <option>Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>

        {visits.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-600">No site visit requests</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
