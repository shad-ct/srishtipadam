import React, { useState } from 'react';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../../api/axiosClient';
import { useTranslation } from 'react-i18next';

const AdminCommittee = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);
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

  const columns = [
    { header: t('admin.name'), accessor: 'name' },
    { header: t('admin.roleEn'), accessor: 'role', render: (row: any) => row.role?.en || '' },
    { header: t('admin.displayOrder'), accessor: 'order' },
  ];

  const handleEdit = (member: any) => {
    setEditingMember(member);
    setIsModalOpen(true);
  };

  const handleDelete = (member: any) => {
    if (window.confirm(`${t('admin.deleteConfirm')} "${member.name}"?`)) {
      deleteMutation.mutate(member._id);
    }
  };

  const handleAddNew = () => {
    setEditingMember(null);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newMember = {
      name: formData.get('name'),
      role: { en: formData.get('roleEn'), ml: formData.get('roleMl') },
      order: Number(formData.get('order')),
    };

    if (editingMember) {
      updateMutation.mutate({ ...newMember, _id: editingMember._id });
    } else {
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
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">{t('admin.name')}</label>
            <input name="name" defaultValue={editingMember?.name || ''} className="w-full px-3 py-2 bg-surface border border-border rounded-md text-text" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">{t('admin.roleEn')}</label>
              <input name="roleEn" defaultValue={editingMember?.role?.en || ''} className="w-full px-3 py-2 bg-surface border border-border rounded-md text-text" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">{t('admin.roleMl')}</label>
              <input name="roleMl" defaultValue={editingMember?.role?.ml || ''} className="w-full px-3 py-2 bg-surface border border-border rounded-md text-text" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">{t('admin.displayOrder')}</label>
            <input name="order" type="number" defaultValue={editingMember?.order || 0} className="w-full px-3 py-2 bg-surface border border-border rounded-md text-text" required />
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-border mt-6">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-text-secondary hover:text-text font-medium">{t('admin.cancel')}</button>
            <button type="submit" className="bg-primary hover:bg-primary-hover text-surface-raised px-4 py-2 rounded-md font-medium">{t('admin.save')}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminCommittee;
