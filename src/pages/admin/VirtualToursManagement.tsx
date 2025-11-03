import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { VirtualTour, Property, Plot } from '../../types/database';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Plus, Edit, Trash2, X, Eye, Video } from 'lucide-react';

export function VirtualToursManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTour, setEditingTour] = useState<VirtualTour | null>(null);
  const [previewTour, setPreviewTour] = useState<VirtualTour | null>(null);
  const queryClient = useQueryClient();

  const { data: tours = [] } = useQuery<(VirtualTour & { property?: Property; plot?: Plot })[]>({
    queryKey: ['admin-virtual-tours'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('virtual_tours')
        .select('*, property:properties(*), plot:plots(*)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('virtual_tours').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-virtual-tours'] });
    },
  });

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this virtual tour?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const openModal = (tour?: VirtualTour) => {
    setEditingTour(tour || null);
    setIsModalOpen(true);
  };

  return (
    <AdminLayout>
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Virtual Tours Management</h2>
          <button
            onClick={() => openModal()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Virtual Tour</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tours.map((tour) => (
            <div key={tour.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
              <div className="relative h-48 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                {tour.thumbnail_url ? (
                  <img src={tour.thumbnail_url} alt={tour.title} className="w-full h-full object-cover" />
                ) : (
                  <Video className="h-20 w-20 text-white opacity-80" />
                )}
                <div className={`absolute top-4 right-4 ${tour.is_active ? 'bg-green-500' : 'bg-gray-500'} text-white px-3 py-1 rounded-full text-sm font-medium`}>
                  {tour.is_active ? 'Active' : 'Inactive'}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{tour.title}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{tour.description}</p>

                <div className="mb-4">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {tour.tour_type}
                  </span>
                </div>

                {tour.property && (
                  <div className="text-sm text-gray-600 mb-2">
                    Property: {tour.property.title}
                  </div>
                )}
                {tour.plot && (
                  <div className="text-sm text-gray-600 mb-2">
                    Plot: {tour.plot.plot_no}
                  </div>
                )}

                <div className="flex items-center space-x-3 pt-4 border-t">
                  <button
                    onClick={() => setPreviewTour(tour)}
                    className="flex-1 text-blue-600 hover:text-blue-900 py-2 px-3 border border-blue-600 rounded-lg hover:bg-blue-50 transition flex items-center justify-center space-x-2"
                  >
                    <Eye className="h-4 w-4" />
                    <span>Preview</span>
                  </button>
                  <button
                    onClick={() => openModal(tour)}
                    className="text-blue-600 hover:text-blue-900 p-2"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(tour.id)}
                    className="text-red-600 hover:text-red-900 p-2"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {tours.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg">
            <Video className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No virtual tours found. Create your first virtual tour to get started.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <VirtualTourModal
          tour={editingTour}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            queryClient.invalidateQueries({ queryKey: ['admin-virtual-tours'] });
          }}
        />
      )}

      {previewTour && (
        <VirtualTourPreview
          tour={previewTour}
          onClose={() => setPreviewTour(null)}
        />
      )}
    </AdminLayout>
  );
}

function VirtualTourModal({
  tour,
  onClose,
  onSuccess,
}: {
  tour: VirtualTour | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState<Partial<VirtualTour>>(
    tour || {
      title: '',
      description: '',
      tour_type: 'Kuula',
      tour_url: '',
      thumbnail_url: '',
      property_id: null,
      plot_id: null,
      is_active: true,
    }
  );

  const { data: properties = [] } = useQuery<Property[]>({
    queryKey: ['properties-list'],
    queryFn: async () => {
      const { data, error } = await supabase.from('properties').select('*');
      if (error) throw error;
      return data;
    },
  });

  const { data: plots = [] } = useQuery<Plot[]>({
    queryKey: ['plots-list'],
    queryFn: async () => {
      const { data, error } = await supabase.from('plots').select('*');
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: Partial<VirtualTour>) => {
      if (tour?.id) {
        const { error } = await supabase
          .from('virtual_tours')
          .update(data)
          .eq('id', tour.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('virtual_tours').insert([data]);
        if (error) throw error;
      }
    },
    onSuccess,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.property_id && !formData.plot_id) {
      alert('Please select either a property or a plot');
      return;
    }
    if (formData.property_id && formData.plot_id) {
      alert('Please select only one - either a property or a plot, not both');
      return;
    }
    saveMutation.mutate(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
          <h3 className="text-xl font-bold">
            {tour ? 'Edit Virtual Tour' : 'Add New Virtual Tour'}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 3-Bedroom Apartment Virtual Tour"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Brief description of the virtual tour"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tour Type *</label>
              <select
                value={formData.tour_type}
                onChange={(e) => setFormData({ ...formData, tour_type: e.target.value as VirtualTour['tour_type'] })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="Kuula">Kuula</option>
                <option value="Matterport">Matterport</option>
                <option value="Embed">Embed Code</option>
                <option value="External">External Link</option>
              </select>
            </div>

            <div>
              <label className="flex items-center space-x-2 cursor-pointer mt-6">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm font-medium text-gray-700">Active</span>
              </label>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tour URL or Embed Code *</label>
              <textarea
                required
                value={formData.tour_url}
                onChange={(e) => setFormData({ ...formData, tour_url: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                placeholder="https://kuula.co/share/... or <iframe>...</iframe>"
              />
              <p className="mt-1 text-xs text-gray-500">
                Paste the full URL or embed code from Kuula, Matterport, or other services
              </p>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail URL</label>
              <input
                type="url"
                value={formData.thumbnail_url}
                onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/thumbnail.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Link to Property</label>
              <select
                value={formData.property_id || ''}
                onChange={(e) => setFormData({ ...formData, property_id: e.target.value || null, plot_id: null })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">No property</option>
                {properties.map((property) => (
                  <option key={property.id} value={property.id}>
                    {property.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Link to Plot</label>
              <select
                value={formData.plot_id || ''}
                onChange={(e) => setFormData({ ...formData, plot_id: e.target.value || null, property_id: null })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">No plot</option>
                {plots.map((plot) => (
                  <option key={plot.id} value={plot.id}>
                    Plot {plot.plot_no} - {plot.location}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saveMutation.isPending}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saveMutation.isPending ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function VirtualTourPreview({
  tour,
  onClose,
}: {
  tour: VirtualTour;
  onClose: () => void;
}) {
  const getEmbedCode = () => {
    if (tour.tour_url.includes('<iframe')) {
      return tour.tour_url;
    }

    if (tour.tour_url.includes('kuula.co')) {
      return `<iframe src="${tour.tour_url}" width="100%" height="600" frameborder="0" allow="xr-spatial-tracking; gyroscope; accelerometer" allowfullscreen scrolling="no"></iframe>`;
    }

    if (tour.tour_url.includes('matterport.com')) {
      return `<iframe src="${tour.tour_url}" width="100%" height="600" frameborder="0" allow="vr" allowfullscreen></iframe>`;
    }

    return `<iframe src="${tour.tour_url}" width="100%" height="600" frameborder="0" allowfullscreen></iframe>`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-xl font-bold">{tour.title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div
            className="w-full"
            dangerouslySetInnerHTML={{ __html: getEmbedCode() }}
          />
        </div>
      </div>
    </div>
  );
}
