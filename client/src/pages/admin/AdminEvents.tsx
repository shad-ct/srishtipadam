import React, { useState } from 'react';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../../api/axiosClient';
import { useTranslation } from 'react-i18next';

const AdminEvents = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [previewImages, setPreviewImages] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const queryClient = useQueryClient();

  const { data: events, isLoading } = useQuery({
    queryKey: ['adminEvents'],
    queryFn: async () => {
      const { data } = await axiosClient.get('/events');
      return data;
    }
  });

  const createMutation = useMutation({
    mutationFn: (newEvent: any) => axiosClient.post('/events', newEvent),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminEvents'] });
      setIsModalOpen(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: (event: any) => axiosClient.put(`/events/${event._id}`, event),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminEvents'] });
      setIsModalOpen(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => axiosClient.delete(`/events/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminEvents'] });
    }
  });

  const columns = [
    { header: t('admin.eventNameEn'), accessor: 'name', render: (row: any) => row.name?.en || '' },
    { header: t('admin.locationEn'), accessor: 'place', render: (row: any) => row.place?.en || '' },
    { header: t('admin.date'), accessor: 'date', render: (row: any) => new Date(row.date).toLocaleDateString() },
    { header: t('admin.time'), accessor: 'time' },
    { header: t('admin.markUpcoming'), accessor: 'isUpcoming', render: (row: any) => row.isUpcoming ? 'Yes' : 'No' },
  ];

  const handleEdit = (event: any) => {
    setEditingEvent(event);
    setPreviewImages(
      event.images ? event.images.map((img: any, i: number) => ({
        id: `existing-${i}-${Date.now()}`,
        type: 'existing',
        url: img.url,
        publicId: img.publicId
      })) : []
    );
    setIsModalOpen(true);
  };

  const handleDelete = (event: any) => {
    if (window.confirm(`${t('admin.deleteConfirm')} "${event.name?.en}"?`)) {
      deleteMutation.mutate(event._id);
    }
  };

  const handleAddNew = () => {
    setEditingEvent(null);
    setPreviewImages([]);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    setIsUploading(true);
    let finalImages: any[] = [];

    try {
      for (const img of previewImages) {
        if (img.type === 'existing') {
          finalImages.push({ url: img.url, publicId: img.publicId });
        } else if (img.type === 'new') {
          const uploadData = new FormData();
          uploadData.append('files', img.file);
          const uploadRes = await axiosClient.post('/upload/multiple', uploadData, {
            headers: { 'Content-Type': undefined }
          });
          finalImages.push(uploadRes.data[0]); // It returns an array, we upload 1 by 1 here or bulk. Bulk is better, but this preserves order easily.
        }
      }
    } catch (error: any) {
      console.error("Failed to upload images", error);
      alert(error.response?.data?.message || error.response?.data?.error || "Failed to upload images");
      setIsUploading(false);
      return;
    }
    setIsUploading(false);

    const newEvent = {
      name: { en: formData.get('nameEn'), ml: formData.get('nameMl') },
      place: { en: formData.get('placeEn'), ml: formData.get('placeMl') },
      date: formData.get('date'),
      time: formData.get('time'),
      description: { en: formData.get('descriptionEn'), ml: formData.get('descriptionMl') },
      isUpcoming: formData.get('isUpcoming') === 'on',
      images: finalImages
    };

    if (editingEvent) {
      updateMutation.mutate({ ...newEvent, _id: editingEvent._id });
    } else {
      createMutation.mutate(newEvent);
    }
  };

  if (isLoading) return <div className="p-8">{t('admin.loading')}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-text mb-2">{t('admin.manageEvents')}</h1>
          <p className="text-text-secondary text-sm">Add, edit, or remove events.</p>
        </div>
        <button
          onClick={handleAddNew}
          className="bg-primary hover:bg-primary-hover text-surface-raised font-medium px-4 py-2 rounded-md transition-colors"
        >
          {t('admin.addEvent')}
        </button>
      </div>

      <DataTable
        columns={columns}
        data={events || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEvent ? t('admin.editEvent') : t('admin.createEvent')}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">{t('admin.eventNameEn')}</label>
              <input name="nameEn" defaultValue={editingEvent?.name?.en || ''} className="w-full px-3 py-2 bg-surface border border-border rounded-md text-text" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">{t('admin.eventNameMl')}</label>
              <input name="nameMl" defaultValue={editingEvent?.name?.ml || ''} className="w-full px-3 py-2 bg-surface border border-border rounded-md text-text" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">{t('admin.locationEn')}</label>
              <input name="placeEn" defaultValue={editingEvent?.place?.en || ''} className="w-full px-3 py-2 bg-surface border border-border rounded-md text-text" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">{t('admin.locationMl')}</label>
              <input name="placeMl" defaultValue={editingEvent?.place?.ml || ''} className="w-full px-3 py-2 bg-surface border border-border rounded-md text-text" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Description (EN)</label>
              <textarea name="descriptionEn" defaultValue={editingEvent?.description?.en || ''} className="w-full px-3 py-2 bg-surface border border-border rounded-md text-text h-24 resize-y" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Description (ML)</label>
              <textarea name="descriptionMl" defaultValue={editingEvent?.description?.ml || ''} className="w-full px-3 py-2 bg-surface border border-border rounded-md text-text h-24 resize-y" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">{t('admin.date')}</label>
              <input name="date" type="date" defaultValue={editingEvent?.date ? new Date(editingEvent.date).toISOString().split('T')[0] : ''} className="w-full px-3 py-2 bg-surface border border-border rounded-md text-text" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">{t('admin.time')}</label>
              <input name="time" type="time" defaultValue={editingEvent?.time || ''} className="w-full px-3 py-2 bg-surface border border-border rounded-md text-text" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <input type="checkbox" name="isUpcoming" id="isUpcoming" defaultChecked={editingEvent?.isUpcoming} className="w-4 h-4" />
            <label htmlFor="isUpcoming" className="text-sm font-medium text-text-secondary">{t('admin.markUpcoming')}</label>
          </div>

          <div className="border border-border rounded-md p-4 bg-surface mt-4">
            <label className="block text-sm font-medium text-text-secondary mb-2"> Poster Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                if (e.target.files) {
                  const newPreviews = Array.from(e.target.files).map((file, i) => ({
                    id: `new-${Date.now()}-${i}`,
                    type: 'new',
                    file,
                    url: URL.createObjectURL(file)
                  }));
                  setPreviewImages(prev => [...prev, ...newPreviews]);
                }
                // Reset input so the same files can be selected again if needed
                e.target.value = '';
              }}
              className="w-full text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-surface-raised hover:file:bg-primary-hover transition-colors"
            />
            {previewImages.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-text mb-2">Images (Drag or use arrows to reorder):</p>
                <div className="flex gap-4 flex-wrap">
                  {previewImages.map((img: any, idx: number) => (
                    <div key={img.id} className="relative group border border-border rounded-md p-2 bg-background flex flex-col items-center">
                      <img src={img.url} alt={`Preview ${idx + 1}`} className="w-32 h-32 object-cover rounded-md mb-2" />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (idx > 0) {
                              const newImgs = [...previewImages];
                              [newImgs[idx - 1], newImgs[idx]] = [newImgs[idx], newImgs[idx - 1]];
                              setPreviewImages(newImgs);
                            }
                          }}
                          disabled={idx === 0}
                          className="px-2 py-1 bg-surface-raised border border-border rounded text-xs disabled:opacity-30"
                        >&lt;</button>
                        <button
                          type="button"
                          onClick={() => setPreviewImages(prev => prev.filter(p => p.id !== img.id))}
                          className="px-2 py-1 bg-error/10 text-error rounded text-xs"
                        >Remove</button>
                        <button
                          type="button"
                          onClick={() => {
                            if (idx < previewImages.length - 1) {
                              const newImgs = [...previewImages];
                              [newImgs[idx + 1], newImgs[idx]] = [newImgs[idx], newImgs[idx + 1]];
                              setPreviewImages(newImgs);
                            }
                          }}
                          disabled={idx === previewImages.length - 1}
                          className="px-2 py-1 bg-surface-raised border border-border rounded text-xs disabled:opacity-30"
                        >&gt;</button>
                      </div>
                      {img.type === 'new' && <span className="absolute top-0 right-0 bg-accent text-accent-content text-[10px] font-bold px-1 rounded-bl">NEW</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-border mt-6">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-text-secondary hover:text-text font-medium">{t('admin.cancel')}</button>
            <button type="submit" disabled={isUploading} className="bg-primary hover:bg-primary-hover text-surface-raised px-4 py-2 rounded-md font-medium disabled:opacity-50">
              {isUploading ? 'Uploading...' : t('admin.saveEvent')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminEvents;
