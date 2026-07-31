import React, { useState, useEffect } from 'react';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../../api/axiosClient';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

const AdminBooks = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<any>(null);
  const [coverImageUrl, setCoverImageUrl] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const queryClient = useQueryClient();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.openAddModal) {
      handleAddNew();
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const { data: books, isLoading } = useQuery({
    queryKey: ['adminBooks'],
    queryFn: async () => {
      const { data } = await axiosClient.get('/books');
      return data;
    }
  });

  const createMutation = useMutation({
    mutationFn: (newBook: any) => axiosClient.post('/books', newBook),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBooks'] });
      setIsModalOpen(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: (book: any) => axiosClient.put(`/books/${book._id}`, book),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBooks'] });
      setIsModalOpen(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => axiosClient.delete(`/books/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBooks'] });
    }
  });

  const columns = [
    { header: 'Cover', accessor: 'coverImage', render: (row: any) => row.coverImage ? <img src={typeof row.coverImage === 'string' ? row.coverImage : row.coverImage.url} alt="Cover" className="w-10 h-14 object-cover rounded shadow-sm" /> : null },
    { header: t('admin.title'), accessor: 'name', render: (row: any) => row.name?.en || row.name || '' },
    { header: t('admin.author'), accessor: 'writer', render: (row: any) => row.writer?.en || row.writer || '' },
    { header: t('admin.category'), accessor: 'category' },
    { header: t('admin.price'), accessor: 'price' },
    { header: 'Featured', accessor: 'featured', render: (row: any) => row.featured ? 'Yes' : 'No' },
  ];

  const handleEdit = (book: any) => {
    setEditingBook(book);
    setCoverImageUrl(typeof book.coverImage === 'string' ? book.coverImage : book.coverImage?.url || '');
    setIsModalOpen(true);
  };

  const handleDelete = (book: any) => {
    if (window.confirm(`${t('admin.deleteConfirm')} "${book.name?.en || book.name?.ml || 'Unknown Title'}"?`)) {
      deleteMutation.mutate(book._id);
    }
  };

  const handleAddNew = () => {
    setEditingBook(null);
    setCoverImageUrl('');
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
      setCoverImageUrl(data.url);
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
    const newBook = {
      name: { en: formData.get('nameEn'), ml: formData.get('nameMl') },
      writer: { en: formData.get('writerEn'), ml: formData.get('writerMl') },
      category: formData.get('category'),
      price: Number(formData.get('price')),
      featured: formData.get('featured') === 'on',
      coverImage: coverImageUrl,
    };

    if (editingBook) {
      updateMutation.mutate({ ...newBook, _id: editingBook._id });
    } else {
      createMutation.mutate(newBook);
    }
  };

  if (isLoading) return <div className="p-8">{t('admin.loading')}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-text mb-2">{t('admin.manageBooks')}</h1>
          <p className="text-text-secondary text-sm">Add, edit, or remove books from the catalogue.</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="bg-primary hover:bg-primary-hover text-surface-raised font-medium px-4 py-2 rounded-md transition-colors"
        >
          {t('admin.addBook')}
        </button>
      </div>

      <DataTable 
        columns={columns} 
        data={books || []} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
      />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingBook ? t('admin.editBook') : t('admin.addNewBook')}
      >
        <form onSubmit={handleSave} className="space-y-4 max-h-[70vh] overflow-y-auto px-2">
          {/* Cover Image Upload */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Cover Image</label>
            <div className="flex items-center gap-4">
              {coverImageUrl && (
                <img src={coverImageUrl} alt="Cover Preview" className="w-16 h-24 object-cover rounded-md border border-border" />
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">{t('admin.title')} (EN)</label>
              <input 
                name="nameEn" 
                defaultValue={editingBook?.name?.en || (typeof editingBook?.name === 'string' ? editingBook?.name : '') || ''} 
                className="w-full px-3 py-2 bg-surface border border-border rounded-md focus:border-primary focus:outline-none text-text dark:bg-gray-800 dark:text-white" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">{t('admin.title')} (ML)</label>
              <input 
                name="nameMl" 
                defaultValue={editingBook?.name?.ml || ''} 
                className="w-full px-3 py-2 bg-surface border border-border rounded-md focus:border-primary focus:outline-none text-text dark:bg-gray-800 dark:text-white" 
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">{t('admin.author')} (EN)</label>
              <input 
                name="writerEn" 
                defaultValue={editingBook?.writer?.en || (typeof editingBook?.writer === 'string' ? editingBook?.writer : '') || ''} 
                className="w-full px-3 py-2 bg-surface border border-border rounded-md focus:border-primary focus:outline-none text-text dark:bg-gray-800 dark:text-white" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">{t('admin.author')} (ML)</label>
              <input 
                name="writerMl" 
                defaultValue={editingBook?.writer?.ml || ''} 
                className="w-full px-3 py-2 bg-surface border border-border rounded-md focus:border-primary focus:outline-none text-text dark:bg-gray-800 dark:text-white" 
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">{t('admin.category')}</label>
            <input 
              name="category" 
              list="book-categories"
              defaultValue={editingBook?.category || ''} 
              className="w-full px-3 py-2 bg-surface border border-border rounded-md focus:border-primary focus:outline-none text-text dark:bg-gray-800 dark:text-white" 
            />
            <datalist id="book-categories">
              <option value="നോവൽ (Novel)" />
              <option value="കവിത (Poetry)" />
              <option value="ലേഖനം (Article)" />
              <option value="കഥ (Story)" />
              <option value="ആത്മകഥ (Autobiography)" />
              <option value="യാത്രാവിവരണം (Travelogue)" />
            </datalist>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">{t('admin.price')}</label>
            <input 
              name="price" 
              type="number" 
              min="0"
              defaultValue={editingBook?.price || ''} 
              className="w-full px-3 py-2 bg-surface border border-border rounded-md focus:border-primary focus:outline-none text-text dark:bg-gray-800 dark:text-white" 
              required 
            />
          </div>
          <div className="flex items-center gap-2 mt-2">
            <input type="checkbox" name="featured" id="featured" defaultChecked={editingBook?.featured} className="w-4 h-4" />
            <label htmlFor="featured" className="text-sm font-medium text-text-secondary">Mark as Featured</label>
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-border mt-6">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-text-secondary hover:text-text font-medium transition-colors"
            >
              {t('admin.cancel')}
            </button>
            <button 
              type="submit"
              disabled={uploadingImage}
              className="bg-primary hover:bg-primary-hover text-surface-raised px-4 py-2 rounded-md font-medium transition-colors"
            >
              {t('admin.save')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminBooks;
