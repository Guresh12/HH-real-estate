import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Plot } from '../types/database';
import { MapPin, Maximize, DollarSign, CheckCircle, XCircle } from 'lucide-react';

export function Plots() {
  const { data: plots = [] } = useQuery<Plot[]>({
    queryKey: ['plots'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('plots')
        .select('*, client:clients(*)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return 'bg-green-500';
      case 'booked':
        return 'bg-yellow-500';
      case 'sold':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    return status.toLowerCase() === 'sold' ? (
      <XCircle className="h-5 w-5" />
    ) : (
      <CheckCircle className="h-5 w-5" />
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Available Plots</h1>
          <p className="text-xl">
            Invest in prime land locations with clear titles and documentation
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plots.map((plot) => (
            <div
              key={plot.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition"
            >
              <div className="relative h-48 bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
                <MapPin className="h-20 w-20 text-white opacity-80" />
                <div
                  className={`absolute top-4 right-4 ${getStatusColor(plot.status)} text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1`}
                >
                  {getStatusIcon(plot.status)}
                  <span>{plot.status}</span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Plot #{plot.plot_no}
                </h3>
                <p className="text-2xl font-bold text-green-600 mb-3">
                  ${plot.price.toLocaleString()}
                </p>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="text-sm">{plot.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Maximize className="h-4 w-4 mr-2" />
                    <span className="text-sm">{plot.size} sq ft</span>
                  </div>
                  {plot.dimensions && (
                    <div className="flex items-center text-gray-600">
                      <DollarSign className="h-4 w-4 mr-2" />
                      <span className="text-sm">Dimensions: {plot.dimensions}</span>
                    </div>
                  )}
                </div>

                {plot.status.toLowerCase() === 'sold' && plot.client && (
                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-500">Sold to:</p>
                    <p className="text-sm font-medium text-gray-900">{plot.client.name}</p>
                  </div>
                )}

                {plot.status.toLowerCase() === 'available' && (
                  <button className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-medium">
                    Inquire Now
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {plots.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No plots available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
