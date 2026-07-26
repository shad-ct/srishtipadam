import React, { useState } from 'react';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../../api/axiosClient';
import { useTranslation } from 'react-i18next';

const AdminMagazines = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMag, setEditingMag] = useState<any>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const queryClient = useQueryClient();

  const { data: magazines, isLoading } = useQuery({
    queryKey: ['adminMagazines'],
    queryFn: async () => {
      const { data } = await axiosClient.get('/magazines');
      return data;
    }
  });

  const createMutation = useMutation({
    mutationFn: (newMag: any) => axiosClient.post('/magazines', newMag),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminMagazines'] });
      setIsModalOpen(false);
      setPdfFile(null);
    }
  });

  const updateMutation = useMutation({
    mutationFn: (mag: any) => axiosClient.put(`/magazines/${mag._id}`, mag),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminMagazines'] });
      setIsModalOpen(false);
      setPdfFile(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => axiosClient.delete(`/magazines/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminMagazines'] });
    }
  });

  const columns = [
    { header: t('admin.title'), accessor: 'title', render: (row: any) => row.title?.en || '' },
    { header: t('admin.issueNumber'), accessor: 'issueNumber' },
    { header: t('admin.publishedDate'), accessor: 'publishedDate', render: (row: any) => row.publishedDate ? new Date(row.publishedDate).toLocaleDateString() : '' },
    { header: 'PDF', accessor: 'pdf', render: (row: any) => row.pdf?.url ? <a href={row.pdf.url} target="_blank" rel="noreferrer" className="text-primary hover:underline">View PDF</a> : 'No PDF' }
  ];

  const handleEdit = (mag: any) => {
    setEditingMag(mag);
    setPdfFile(null);
    setIsModalOpen(true);
  };

  const handleDelete = (mag: any) => {
    if (window.confirm(`${t('admin.deleteConfirm')} "${mag.title?.en}"?`)) {
      deleteMutation.mutate(mag._id);
    }
  };

  const handleAddNew = () => {
    setEditingMag(null);
    setPdfFile(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    let pdfData = editingMag?.pdf || null;

    if (pdfFile) {
      setIsUploading(true);
      try {
        const uploadData = new FormData();
        uploadData.append('pdf', pdfFile);
        const uploadRes = await axiosClient.post('/upload/pdf', uploadData, {
          headers: { 'Content-Type': undefined }
        });
        pdfData = uploadRes.data; // { url, publicId }
      } catch (error: any) {
        console.error("Failed to upload PDF", error);
        const errorMsg = error.response?.data?.error || "Failed to upload PDF";
        alert(errorMsg);
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }

    const newMag = {
      title: { en: formData.get('titleEn'), ml: formData.get('titleMl') },
      issueNumber: formData.get('issueNumber'),
      publishedDate: formData.get('publishedDate'),
      pdf: pdfData
    };

    if (editingMag) {
      updateMutation.mutate({ ...newMag, _id: editingMag._id });
    } else {
      createMutation.mutate(newMag);
    }
  };

  if (isLoading) return <div className="p-8">{t('admin.loading')}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-text mb-2">{t('admin.manageMagazines')}</h1>
          <p className="text-text-secondary text-sm">Add, edit, or remove magazines.</p>
        </div>
        <button onClick={handleAddNew} className="bg-primary hover:bg-primary-hover text-surface-raised font-medium px-4 py-2 rounded-md transition-colors">
          {t('admin.addMagazine')}
        </button>
      </div>

      <DataTable columns={columns} data={magazines || []} onEdit={handleEdit} onDelete={handleDelete} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingMag ? t('admin.editMagazine') : t('admin.addMagazine')}>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Title (EN)</label>
              <input name="titleEn" defaultValue={editingMag?.title?.en || ''} className="w-full px-3 py-2 bg-surface border border-border rounded-md text-text" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Title (ML)</label>
              <input name="titleMl" defaultValue={editingMag?.title?.ml || ''} className="w-full px-3 py-2 bg-surface border border-border rounded-md text-text" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">{t('admin.issueNumber')}</label>
              <input name="issueNumber" defaultValue={editingMag?.issueNumber || ''} className="w-full px-3 py-2 bg-surface border border-border rounded-md text-text" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">{t('admin.publishedDate')}</label>
              <input name="publishedDate" type="date" defaultValue={editingMag?.publishedDate ? new Date(editingMag.publishedDate).toISOString().split('T')[0] : ''} className="w-full px-3 py-2 bg-surface border border-border rounded-md text-text" required />
            </div>
          </div>
          
          <div className="border border-border rounded-md p-4 bg-surface">
            <label className="block text-sm font-medium text-text-secondary mb-2">{t('admin.pdfUpload')}</label>
            <input 
              type="file" 
              accept="application/pdf" 
              onChange={(e) => setPdfFile(e.target.files ? e.target.files[0] : null)}
              className="w-full text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-surface-raised hover:file:bg-primary-hover transition-colors"
            />
            {pdfFile && (
              <div className="mt-4">
                <p className="text-sm font-medium text-text mb-2">New PDF Preview:</p>
                <iframe src={URL.createObjectURL(pdfFile)} className="w-full h-48 border border-border rounded-md" title="New PDF Preview" />
              </div>
            )}
            {editingMag?.pdf?.url && !pdfFile && (
              <div className="mt-4">
                <p className="text-sm font-medium text-text mb-2">Current PDF Preview:</p>
                <iframe src={editingMag.pdf.url} className="w-full h-48 border border-border rounded-md" title="PDF Preview" />
              </div>
            )}
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-border mt-6">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-text-secondary hover:text-text font-medium">{t('admin.cancel')}</button>
            <button type="submit" disabled={isUploading} className="bg-primary hover:bg-primary-hover text-surface-raised px-4 py-2 rounded-md font-medium disabled:opacity-50">
              {isUploading ? 'Uploading...' : t('admin.save')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminMagazines;
