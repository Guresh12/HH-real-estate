import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { TrendingUp, Home, MapPin, Calendar, DollarSign } from 'lucide-react';
import { formatKES } from '../../lib/currency';

export function Reports() {
  const { data: stats } = useQuery({
    queryKey: ['admin-reports'],
    queryFn: async () => {
      const [
        { data: properties },
        { data: plots },
        { data: receipts },
        { data: visits }
      ] = await Promise.all([
        supabase.from('properties').select('status, price'),
        supabase.from('plots').select('status, price'),
        supabase.from('receipts').select('amount, date'),
        supabase.from('site_visits').select('status')
      ]);

      const propertySales = properties?.filter(p => p.status === 'Sold').length || 0;
      const propertyRevenue = properties?.filter(p => p.status === 'Sold').reduce((sum, p) => sum + p.price, 0) || 0;

      const plotsSold = plots?.filter(p => p.status === 'Sold').length || 0;
      const plotsRevenue = plots?.filter(p => p.status === 'Sold').reduce((sum, p) => sum + p.price, 0) || 0;

      const totalRevenue = receipts?.reduce((sum, r) => sum + r.amount, 0) || 0;
      const pendingVisits = visits?.filter(v => v.status === 'Pending').length || 0;

      return {
        propertySales,
        propertyRevenue,
        plotsSold,
        plotsRevenue,
        totalRevenue,
        pendingVisits,
        properties: properties || [],
        plots: plots || [],
        receipts: receipts || []
      };
    },
  });

  return (
    <AdminLayout>
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Reports & Analytics</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Home className="h-8 w-8 opacity-80" />
              <span className="text-3xl font-bold">{stats?.propertySales || 0}</span>
            </div>
            <p className="text-blue-100">Properties Sold</p>
            <p className="text-2xl font-bold mt-2">{formatKES(stats?.propertyRevenue || 0)}</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <MapPin className="h-8 w-8 opacity-80" />
              <span className="text-3xl font-bold">{stats?.plotsSold || 0}</span>
            </div>
            <p className="text-green-100">Plots Sold</p>
            <p className="text-2xl font-bold mt-2">{formatKES(stats?.plotsRevenue || 0)}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="h-8 w-8 opacity-80" />
              <TrendingUp className="h-6 w-6 opacity-80" />
            </div>
            <p className="text-purple-100">Total Revenue</p>
            <p className="text-3xl font-bold mt-2">{formatKES(stats?.totalRevenue || 0)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-600" />
              Site Visits Overview
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-gray-600">Pending Visits</span>
                <span className="text-2xl font-bold text-yellow-600">{stats?.pendingVisits || 0}</span>
              </div>
              <p className="text-sm text-gray-500">
                Track and manage upcoming property visits
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Total Properties Sold</span>
                <span className="font-bold">{stats?.propertySales || 0}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Total Plots Sold</span>
                <span className="font-bold">{stats?.plotsSold || 0}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Combined Revenue</span>
                <span className="font-bold text-green-600">
                  {formatKES((stats?.propertyRevenue || 0) + (stats?.plotsRevenue || 0))}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
