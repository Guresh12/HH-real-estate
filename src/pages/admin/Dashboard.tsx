import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { Building, Users, Map, Receipt, TrendingUp, Calendar } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { formatKES } from '../../lib/currency';

interface Stats {
  properties: number;
  clients: number;
  plots: number;
  receipts: number;
  siteVisits: number;
  totalRevenue: number;
}

export function Dashboard() {
  const { data: stats } = useQuery<Stats>({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [
        { count: properties },
        { count: clients },
        { count: plots },
        { count: receipts },
        { count: siteVisits },
        { data: receiptsData }
      ] = await Promise.all([
        supabase.from('properties').select('*', { count: 'exact', head: true }),
        supabase.from('clients').select('*', { count: 'exact', head: true }),
        supabase.from('plots').select('*', { count: 'exact', head: true }),
        supabase.from('receipts').select('*', { count: 'exact', head: true }),
        supabase.from('site_visits').select('*', { count: 'exact', head: true }),
        supabase.from('receipts').select('amount')
      ]);

      const totalRevenue = receiptsData?.reduce((sum, r) => sum + (r.amount || 0), 0) || 0;

      return {
        properties: properties || 0,
        clients: clients || 0,
        plots: plots || 0,
        receipts: receipts || 0,
        siteVisits: siteVisits || 0,
        totalRevenue,
      };
    },
  });

  const statCards = [
    {
      name: 'Total Properties',
      value: stats?.properties || 0,
      icon: Building,
      color: 'bg-blue-500',
    },
    {
      name: 'Total Clients',
      value: stats?.clients || 0,
      icon: Users,
      color: 'bg-green-500',
    },
    {
      name: 'Total Plots',
      value: stats?.plots || 0,
      icon: Map,
      color: 'bg-yellow-500',
    },
    {
      name: 'Site Visits',
      value: stats?.siteVisits || 0,
      icon: Calendar,
      color: 'bg-purple-500',
    },
    {
      name: 'Total Receipts',
      value: stats?.receipts || 0,
      icon: Receipt,
      color: 'bg-pink-500',
    },
    {
      name: 'Total Revenue',
      value: formatKES(stats?.totalRevenue || 0),
      icon: TrendingUp,
      color: 'bg-red-500',
    },
  ];

  return (
    <AdminLayout>
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Overview</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.name}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-1">{stat.name}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-4 rounded-lg`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <a
                href="/admin/properties"
                className="block w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
              >
                <p className="font-medium text-blue-900">Manage Properties</p>
                <p className="text-sm text-blue-700">Add, edit, or remove property listings</p>
              </a>
              <a
                href="/admin/clients"
                className="block w-full text-left px-4 py-3 bg-green-50 hover:bg-green-100 rounded-lg transition"
              >
                <p className="font-medium text-green-900">Manage Clients</p>
                <p className="text-sm text-green-700">View and manage client information</p>
              </a>
              <a
                href="/admin/plots"
                className="block w-full text-left px-4 py-3 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition"
              >
                <p className="font-medium text-yellow-900">Manage Plots</p>
                <p className="text-sm text-yellow-700">Update plot status and assignments</p>
              </a>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">System Info</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-gray-600">Active Properties</span>
                <span className="font-bold text-gray-900">{stats?.properties || 0}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-gray-600">Pending Site Visits</span>
                <span className="font-bold text-gray-900">{stats?.siteVisits || 0}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-600">Total Revenue</span>
                <span className="font-bold text-green-600">
                  {formatKES(stats?.totalRevenue || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
