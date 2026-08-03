import { useState } from 'react';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../../api/axiosClient';
import { useTranslation } from 'react-i18next';

const AdminCommittee = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const queryClient = useQueryClient();

  const { data: members, isLoading } = useQuery({
    queryKey: ['adminCommittee'],
    queryFn: async () => {
      const { data } = await axiosClient.get('/committee');
      return data;
    }
  });

  const createMutation = useMutation({
    mutationFn: (newMember: any) => axiosClient.post('/committee', newMember),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCommittee'] });
      setIsModalOpen(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: (member: any) => axiosClient.put(`/committee/${member._id}`, member),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCommittee'] });
      setIsModalOpen(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => axiosClient.delete(`/committee/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCommittee'] });
    }
  });

  const handleMoveOrder = async (member: any, direction: 'up' | 'down') => {
    if (!members) return;
    const currentIndex = members.findIndex((m: any) => m._id === member._id);
    if (currentIndex === -1) return;

    if (direction === 'up' && currentIndex > 0) {
      const prevMember = members[currentIndex - 1];
      const myOrder   = member.order     ?? currentIndex;
      const prevOrder = prevMember.order ?? (currentIndex - 1);
      await Promise.all([
        axiosClient.put(`/committee/${member._id}`,     { order: prevOrder }),
        axiosClient.put(`/committee/${prevMember._id}`, { order: myOrder }),
      ]);
      queryClient.invalidateQueries({ queryKey: ['adminCommittee'] });
    } else if (direction === 'down' && currentIndex < members.length - 1) {
      const nextMember = members[currentIndex + 1];
      const myOrder   = member.order     ?? currentIndex;
      const nextOrder = nextMember.order ?? (currentIndex + 1);
      await Promise.all([
        axiosClient.put(`/committee/${member._id}`,     { order: nextOrder }),
        axiosClient.put(`/committee/${nextMember._id}`, { order: myOrder }),
      ]);
      queryClient.invalidateQueries({ queryKey: ['adminCommittee'] });
    }
  };

  const columns = [
    { header: 'Image', accessor: 'image', render: (row: any) => {
        const imgUrl = row.image || row.photo?.url;
        return imgUrl ? <img src={imgUrl} alt="Profile" className="w-10 h-10 object-cover rounded-full shadow-sm" /> : null;
    }},
    { header: t('admin.name'), accessor: 'name', render: (row: any) => row.name?.en || row.name || '' },
    { header: t('admin.roleEn'), accessor: 'role', render: (row: any) => row.role?.en || '' },
    { header: t('admin.displayOrder'), accessor: 'order', render: (row: any) => (
        <div className="flex items-center gap-2">
            <button onClick={() => handleMoveOrder(row, 'up')} className="p-1 bg-surface-raised rounded border border-border hover:bg-border transition-colors text-xs font-bold w-6 h-6 flex items-center justify-center">↑</button>
            <button onClick={() => handleMoveOrder(row, 'down')} className="p-1 bg-surface-raised rounded border border-border hover:bg-border transition-colors text-xs font-bold w-6 h-6 flex items-center justify-center">↓</button>
        </div>
    ) },
  ];

  const handleEdit = (member: any) => {
    setEditingMember(member);
    setImageUrl(member.image || member.photo?.url || '');
    setIsModalOpen(true);
  };

  const handleDelete = (member: any) => {
    if (window.confirm(`${t('admin.deleteConfirm')} "${member.name?.en || member.name?.ml || 'Unknown Member'}"?`)) {
      deleteMutation.mutate(member._id);
    }
  };

  const handleAddNew = () => {
    setEditingMember(null);
    setImageUrl('');
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploadingImage(true);
    try {
      const { data } = await axiosClient.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setImageUrl(data.url);
    } catch (error) {
      console.error('Failed to upload image', error);
      alert('Image upload failed.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newMember: any = {
      name: { en: formData.get('nameEn'), ml: formData.get('nameMl') },
      role: { en: formData.get('roleEn'), ml: formData.get('roleMl') },
      image: imageUrl,
      facebook: formData.get('facebook'),
      whatsapp: formData.get('whatsapp'),
      phoneNumber: formData.get('phoneNumber'),
    };

    if (editingMember) {
      updateMutation.mutate({ ...newMember, _id: editingMember._id, order: editingMember.order });
    } else {
      newMember.order = members?.length || 0;
      createMutation.mutate(newMember);
    }
  };

  if (isLoading) return <div className="p-8">{t('admin.loading')}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-text mb-2">{t('admin.manageCommittee')}</h1>
          <p className="text-text-secondary text-sm">Add, edit, or remove committee members.</p>
        </div>
        <button onClick={handleAddNew} className="bg-primary hover:bg-primary-hover text-surface-raised font-medium px-4 py-2 rounded-md transition-colors">
          {t('admin.addMember')}
        </button>
      </div>

      <DataTable columns={columns} data={members || []} onEdit={handleEdit} onDelete={handleDelete} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingMember ? t('admin.editMember') : t('admin.addMember')}>
        <form onSubmit={handleSave} className="space-y-4 max-h-[70vh] overflow-y-auto px-2">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Profile Image</label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {imageUrl && (
                <img src={imageUrl} alt="Preview" className="w-16 h-16 object-cover rounded-full border border-border" />
              )}
              <div className="flex-1">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  disabled={uploadingImage}
                  className="w-full text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-surface file:text-text hover:file:bg-border transition-colors dark:file:bg-gray-800 dark:file:text-white"
                />
                {uploadingImage && <p className="text-xs text-primary mt-1">Uploading...</p>}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">{t('admin.name')} (EN)</label>
              <input name="nameEn" defaultValue={editingMember?.name?.en || (typeof editingMember?.name === 'string' ? editingMember?.name : '') || ''} className="w-full px-3 py-2 bg-surface border border-border rounded-md text-text dark:bg-gray-800 dark:text-white" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">{t('admin.name')} (ML)</label>
              <input name="nameMl" defaultValue={editingMember?.name?.ml || ''} className="w-full px-3 py-2 bg-surface border border-border rounded-md text-text dark:bg-gray-800 dark:text-white" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">{t('admin.roleEn')}</label>
              <input name="roleEn" defaultValue={editingMember?.role?.en || ''} className="w-full px-3 py-2 bg-surface border border-border rounded-md text-text dark:bg-gray-800 dark:text-white" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">{t('admin.roleMl')}</label>
              <input name="roleMl" defaultValue={editingMember?.role?.ml || ''} className="w-full px-3 py-2 bg-surface border border-border rounded-md text-text dark:bg-gray-800 dark:text-white" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Phone Number</label>
              <input name="phoneNumber" type="tel" maxLength={10} defaultValue={editingMember?.phoneNumber || ''} className="w-full px-3 py-2 bg-surface border border-border rounded-md text-text dark:bg-gray-800 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">WhatsApp</label>
              <input name="whatsapp" type="tel" maxLength={10} defaultValue={editingMember?.whatsapp || ''} className="w-full px-3 py-2 bg-surface border border-border rounded-md text-text dark:bg-gray-800 dark:text-white" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Facebook Profile URL</label>
            <input name="facebook" type="url" defaultValue={editingMember?.facebook || ''} className="w-full px-3 py-2 bg-surface border border-border rounded-md text-text dark:bg-gray-800 dark:text-white" />
          </div>


          <div className="pt-4 flex justify-end gap-3 border-t border-border mt-6">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-text-secondary hover:text-text font-medium">{t('admin.cancel')}</button>
            <button type="submit" className="bg-primary hover:bg-primary-hover text-surface-raised px-4 py-2 rounded-md font-medium" disabled={uploadingImage}>{t('admin.save')}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminCommittee;

