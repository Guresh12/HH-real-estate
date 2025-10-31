import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { WebsiteContent as WebsiteContentType } from '../../types/database';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Save } from 'lucide-react';
import { useState } from 'react';

export function WebsiteContent() {
  const queryClient = useQueryClient();
  const [editingContent, setEditingContent] = useState<Record<string, Partial<WebsiteContentType>>>({});

  const { data: contents = [] } = useQuery<WebsiteContentType[]>({
    queryKey: ['admin-website-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('website_content')
        .select('*')
        .order('display_order');
      if (error) throw error;
      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (content: Partial<WebsiteContentType> & { id: string }) => {
      const { error } = await supabase
        .from('website_content')
        .update({
          title: content.title,
          content: content.content,
          image_url: content.image_url,
          is_active: content.is_active,
        })
        .eq('id', content.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-website-content'] });
      queryClient.invalidateQueries({ queryKey: ['website-content'] });
      setEditingContent({});
    },
  });

  const handleChange = (id: string, field: string, value: any) => {
    setEditingContent((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleSave = (content: WebsiteContentType) => {
    const updates = editingContent[content.id] || {};
    updateMutation.mutate({
      id: content.id,
      ...content,
      ...updates,
    });
  };

  return (
    <AdminLayout>
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Website Content Management</h2>

        <div className="space-y-6">
          {contents.map((content) => {
            const editedValues = editingContent[content.id] || {};
            const currentTitle = editedValues.title ?? content.title;
            const currentContent = editedValues.content ?? content.content;
            const currentImageUrl = editedValues.image_url ?? content.image_url;
            const currentIsActive = editedValues.is_active ?? content.is_active;

            return (
              <div key={content.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 uppercase">{content.section}</h3>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={currentIsActive}
                      onChange={(e) => handleChange(content.id, 'is_active', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-600">Active</span>
                  </label>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={currentTitle}
                      onChange={(e) => handleChange(content.id, 'title', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                    <textarea
                      value={currentContent}
                      onChange={(e) => handleChange(content.id, 'content', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                    <input
                      type="url"
                      value={currentImageUrl}
                      onChange={(e) => handleChange(content.id, 'image_url', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  {Object.keys(editingContent[content.id] || {}).length > 0 && (
                    <button
                      onClick={() => handleSave(content)}
                      disabled={updateMutation.isPending}
                      className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      <Save className="h-4 w-4" />
                      <span>{updateMutation.isPending ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
}
