import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { Client } from '../../types/database';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Mail, Phone, Plus, Edit, Trash2, X, Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';

export function ClientsManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const queryClient = useQueryClient();

  const { data: clients = [] } = useQuery<Client[]>({
    queryKey: ['admin-clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('clients').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-clients'] });
    },
  });

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this client?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const openModal = (client?: Client) => {
    setEditingClient(client || null);
    setIsModalOpen(true);
  };

  return (
    <AdminLayout>
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Clients Management</h2>
          <button
            onClick={() => openModal()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Client</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map((client) => (
            <div key={client.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{client.name}</h3>
                  <div className={`mt-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    client.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {client.is_verified ? (
                      <>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Pending
                      </>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => openModal(client)}
                    className="text-blue-600 hover:text-blue-900 p-1"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(client.id)}
                    className="text-red-600 hover:text-red-900 p-1"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  <span className="text-sm truncate">{client.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  <span className="text-sm">{client.phone}</span>
                </div>
              </div>

              {client.id_number && (
                <div className="text-sm text-gray-600 mb-4">
                  <p className="font-medium">{client.id_type || 'ID'}: {client.id_number}</p>
                </div>
              )}

              <div className="border-t pt-3">
                <p className="text-xs text-gray-500 mb-2">Documents:</p>
                <div className="flex flex-wrap gap-2">
                  {client.agreement_doc_url && (
                    <a href={client.agreement_doc_url} target="_blank" rel="noopener noreferrer" className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs hover:bg-blue-100">
                      <FileText className="h-3 w-3 mr-1" />
                      Agreement
                    </a>
                  )}
                  {client.id_doc_url && (
                    <a href={client.id_doc_url} target="_blank" rel="noopener noreferrer" className="flex items-center bg-green-50 text-green-700 px-2 py-1 rounded text-xs hover:bg-green-100">
                      <FileText className="h-3 w-3 mr-1" />
                      ID
                    </a>
                  )}
                  {client.title_deed_url && (
                    <a href={client.title_deed_url} target="_blank" rel="noopener noreferrer" className="flex items-center bg-purple-50 text-purple-700 px-2 py-1 rounded text-xs hover:bg-purple-100">
                      <FileText className="h-3 w-3 mr-1" />
                      Deed
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {clients.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-600">No clients found. Create your first client to get started.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <ClientModal
          client={editingClient}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            queryClient.invalidateQueries({ queryKey: ['admin-clients'] });
          }}
        />
      )}
    </AdminLayout>
  );
}

function ClientModal({
  client,
  onClose,
  onSuccess,
}: {
  client: Client | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState<Partial<Client>>(
    client || {
      name: '',
      email: '',
      phone: '',
      id_type: 'National ID',
      id_number: '',
      date_of_birth: '',
      physical_address: '',
      kyc_status: 'Not Started',
      is_verified: false,
    }
  );

  const [uploadingFiles, setUploadingFiles] = useState<Record<string, boolean>>({});

  const saveMutation = useMutation({
    mutationFn: async (data: Partial<Client>) => {
      if (client?.id) {
        const { error } = await supabase
          .from('clients')
          .update(data)
          .eq('id', client.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('clients').insert([data]);
        if (error) throw error;
      }
    },
    onSuccess,
  });

  const handleFileUpload = async (field: 'agreement_doc_url' | 'id_doc_url' | 'title_deed_url', file: File) => {
    setUploadingFiles(prev => ({ ...prev, [field]: true }));
    try {
      const fileName = `${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('client-documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('client-documents')
        .getPublicUrl(fileName);

      setFormData(prev => ({
        ...prev,
        [field]: data.publicUrl,
      }));
    } catch (error) {
      alert('Failed to upload file');
      console.error(error);
    } finally {
      setUploadingFiles(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
          <h3 className="text-xl font-bold">
            {client ? 'Edit Client' : 'Add New Client'}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ID Type</label>
              <select
                value={formData.id_type}
                onChange={(e) => setFormData({ ...formData, id_type: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option>National ID</option>
                <option>Passport</option>
                <option>Driving License</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ID Number</label>
              <input
                type="text"
                value={formData.id_number}
                onChange={(e) => setFormData({ ...formData, id_number: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
              <input
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Physical Address</label>
              <input
                type="text"
                value={formData.physical_address}
                onChange={(e) => setFormData({ ...formData, physical_address: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">KYC Status</label>
              <select
                value={formData.kyc_status}
                onChange={(e) => setFormData({ ...formData, kyc_status: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option>Not Started</option>
                <option>Pending</option>
                <option>Verified</option>
                <option>Rejected</option>
              </select>
            </div>

            <div>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_verified}
                  onChange={(e) => setFormData({ ...formData, is_verified: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm font-medium text-gray-700">Mark as Verified</span>
              </label>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-semibold text-gray-900 mb-4">Documents (KYC)</h4>

            <div className="space-y-4">
              <FileUploadField
                label="Agreement Document"
                currentUrl={formData.agreement_doc_url}
                isUploading={uploadingFiles.agreement_doc_url}
                onUpload={(file) => handleFileUpload('agreement_doc_url', file)}
              />

              <FileUploadField
                label="ID Document"
                currentUrl={formData.id_doc_url}
                isUploading={uploadingFiles.id_doc_url}
                onUpload={(file) => handleFileUpload('id_doc_url', file)}
              />

              <FileUploadField
                label="Title Deed"
                currentUrl={formData.title_deed_url}
                isUploading={uploadingFiles.title_deed_url}
                onUpload={(file) => handleFileUpload('title_deed_url', file)}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t sticky bottom-0 bg-white">
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

function FileUploadField({
  label,
  currentUrl,
  isUploading,
  onUpload,
}: {
  label: string;
  currentUrl?: string;
  isUploading: boolean;
  onUpload: (file: File) => void;
}) {
  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="flex items-center space-x-4">
        <label className="flex items-center justify-center px-4 py-2 bg-white border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition">
          <Upload className="h-4 w-4 mr-2 text-gray-600" />
          <span className="text-sm text-gray-600">
            {isUploading ? 'Uploading...' : 'Choose File'}
          </span>
          <input
            type="file"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                onUpload(e.target.files[0]);
              }
            }}
            disabled={isUploading}
          />
        </label>
        {currentUrl && (
          <a
            href={currentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
          >
            <FileText className="h-4 w-4 mr-1" />
            View Document
          </a>
        )}
      </div>
    </div>
  );
}
