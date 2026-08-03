import { useState } from 'react';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../../api/axiosClient';

const AdminAbout = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: groups, isLoading } = useQuery({
    queryKey: ['adminDistrictGroups'],
    queryFn: async () => {
      const { data } = await axiosClient.get('/district-groups');
      return data;
    }
  });

  const createMutation = useMutation({
    mutationFn: (newGroup: any) => axiosClient.post('/district-groups', newGroup),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminDistrictGroups'] });
      setIsModalOpen(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: (group: any) => axiosClient.put(`/district-groups/${group._id}`, group),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminDistrictGroups'] });
      setIsModalOpen(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => axiosClient.delete(`/district-groups/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminDistrictGroups'] });
    }
  });

  const handleMoveOrder = async (group: any, direction: 'up' | 'down') => {
    if (!groups) return;
    const currentIndex = groups.findIndex((g: any) => g._id === group._id);
    if (currentIndex === -1) return;

    if (direction === 'up' && currentIndex > 0) {
      const prev = groups[currentIndex - 1];
      const myOrder = group.order ?? currentIndex;
      const prevOrder = prev.order ?? (currentIndex - 1);
      await Promise.all([
        axiosClient.put(`/district-groups/${group._id}`, { order: prevOrder }),
        axiosClient.put(`/district-groups/${prev._id}`, { order: myOrder }),
      ]);
      queryClient.invalidateQueries({ queryKey: ['adminDistrictGroups'] });
    } else if (direction === 'down' && currentIndex < groups.length - 1) {
      const next = groups[currentIndex + 1];
      const myOrder = group.order ?? currentIndex;
      const nextOrder = next.order ?? (currentIndex + 1);
      await Promise.all([
        axiosClient.put(`/district-groups/${group._id}`, { order: nextOrder }),
        axiosClient.put(`/district-groups/${next._id}`, { order: myOrder }),
      ]);
      queryClient.invalidateQueries({ queryKey: ['adminDistrictGroups'] });
    }
  };

  const columns = [
    {
      header: 'District',
      accessor: 'district',
      render: (row: any) => (
        <span className="font-semibold text-text">{row.district}</span>
      )
    },
    {
      header: 'WhatsApp Number',
      accessor: 'whatsappNumber',
      render: (row: any) => row.whatsappNumber
        ? (
          <a
            href={`https://wa.me/91${row.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-mono"
          >
            +91 {row.whatsappNumber}
          </a>
        )
        : <span className="text-text-secondary italic text-xs">Not set</span>
    },
    {
      header: 'Display Order',
      accessor: 'order',
      render: (row: any) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleMoveOrder(row, 'up')}
            className="p-1 bg-surface-raised rounded border border-border hover:bg-border transition-colors text-xs font-bold w-6 h-6 flex items-center justify-center"
          >↑</button>
          <button
            onClick={() => handleMoveOrder(row, 'down')}
            className="p-1 bg-surface-raised rounded border border-border hover:bg-border transition-colors text-xs font-bold w-6 h-6 flex items-center justify-center"
          >↓</button>
        </div>
      )
    },
  ];

  const handleEdit = (group: any) => {
    setEditingGroup(group);
    setIsModalOpen(true);
  };

  const handleDelete = (group: any) => {
    if (window.confirm(`Delete district group "${group.district}"? This action cannot be undone.`)) {
      deleteMutation.mutate(group._id);
    }
  };

  const handleAddNew = () => {
    setEditingGroup(null);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const payload: any = {
      district: formData.get('district') as string,
      whatsappNumber: (formData.get('whatsappNumber') as string).replace(/\D/g, '').slice(-10),
    };

    if (editingGroup) {
      updateMutation.mutate({ ...payload, _id: editingGroup._id, order: editingGroup.order });
    } else {
      payload.order = groups?.length || 0;
      createMutation.mutate(payload);
    }
  };

  if (isLoading) return <div className="p-8 text-text-secondary">Loading...</div>;

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text mb-2">About Section</h1>
          <p className="text-text-secondary text-sm">
            Manage district WhatsApp community groups displayed on the About page.
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="bg-primary hover:bg-primary-hover text-surface-raised font-medium px-4 py-2 rounded-md transition-colors whitespace-nowrap self-start"
        >
          + Add District
        </button>
      </div>

      {/* Info Banner */}
      <div className="mb-6 p-4 rounded-xl border border-[#3DB86B]/20 bg-[#3DB86B]/05 flex items-start gap-3">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-[#3DB86B] mt-0.5 shrink-0 hidden sm:block">
          <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.333 4.993L2 22l5.13-1.347a9.96 9.96 0 0 0 4.887 1.277h.005c5.505 0 9.988-4.478 9.99-9.985A9.99 9.99 0 0 0 12.012 2zm4.957 14.238c-.273.767-1.561 1.405-2.146 1.483-.518.069-1.196.128-3.418-.79-2.842-1.173-4.673-4.057-4.814-4.244-.143-.186-1.144-1.52-1.144-2.9 0-1.38.718-2.06 1.023-2.358.304-.298.665-.373.886-.373.22 0 .443.003.638.012.2.01.472-.075.738.566.27.653.924 2.257 1.003 2.418.08.162.133.35.025.567-.108.217-.162.35-.325.538-.162.186-.34.417-.487.56-.162.155-.33.324-.14.653.19.324.843 1.393 1.807 2.253.963.86 1.77 1.127 2.09 1.286.32.16.507.133.696-.084.19-.217.81-.94.945-1.263.136-.324.27-.27.457-.2.187.072 1.186.56 1.39.66.204.1.34.15.39.233.05.084.05.483-.223 1.25z"/>
        </svg>
        <div>
          <p className="text-sm font-semibold text-[#3DB86B]">WhatsApp Community Groups</p>
          <p className="text-xs text-text-secondary mt-0.5">
            Each district listed here gets a card on the public About page. When a visitor clicks a card, they see a modal with a "Contact Admin" button that opens WhatsApp with the admin's number.
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={groups || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingGroup ? 'Edit District Group' : 'Add District Group'}
      >
        <form onSubmit={handleSave} className="space-y-5 px-1">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              District Name <span className="text-red-500">*</span>
            </label>
            <input
              name="district"
              defaultValue={editingGroup?.district || ''}
              placeholder="e.g. Kannur"
              className="w-full px-3 py-2 bg-surface border border-border rounded-md text-text dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Admin WhatsApp Number
            </label>
            <div className="flex items-center">
              <span className="px-3 py-2 bg-surface-raised border border-r-0 border-border rounded-l-md text-text-secondary text-sm font-mono">+91</span>
              <input
                name="whatsappNumber"
                type="tel"
                maxLength={10}
                defaultValue={editingGroup?.whatsappNumber || ''}
                placeholder="9446771277"
                className="flex-1 px-3 py-2 bg-surface border border-border rounded-r-md text-text dark:bg-gray-800 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <p className="text-xs text-text-secondary mt-1">Enter 10-digit number without country code. Leave blank if not assigned yet.</p>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-border mt-6">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-text-secondary hover:text-text font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-primary hover:bg-primary-hover text-surface-raised px-4 py-2 rounded-md font-medium"
            >
              {editingGroup ? 'Save Changes' : 'Add District'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminAbout;
