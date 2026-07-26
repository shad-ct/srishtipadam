import React, { useState } from 'react';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../../api/axiosClient';
import { useTranslation } from 'react-i18next';

const AdminBooks = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<any>(null);
  const queryClient = useQueryClient();

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
    { header: t('admin.title'), accessor: 'name' },
    { header: t('admin.author'), accessor: 'writer' },
    { header: t('admin.category'), accessor: 'category' },
    { header: t('admin.price'), accessor: 'price' },
  ];

  const handleEdit = (book: any) => {
    setEditingBook(book);
    setIsModalOpen(true);
  };

  const handleDelete = (book: any) => {
    if (window.confirm(`${t('admin.deleteConfirm')} "${book.name}"?`)) {
      deleteMutation.mutate(book._id);
    }
  };

  const handleAddNew = () => {
    setEditingBook(null);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newBook = {
      name: formData.get('name'),
      writer: formData.get('writer'),
      category: formData.get('category'),
      price: Number(formData.get('price')),
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
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">{t('admin.title')}</label>
            <input 
              name="name" 
              defaultValue={editingBook?.name || ''} 
              className="w-full px-3 py-2 bg-surface border border-border rounded-md focus:border-primary focus:outline-none text-text" 
              required 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">{t('admin.author')}</label>
              <input 
                name="writer" 
                defaultValue={editingBook?.writer || ''} 
                className="w-full px-3 py-2 bg-surface border border-border rounded-md focus:border-primary focus:outline-none text-text" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">{t('admin.category')}</label>
              <input 
                name="category" 
                defaultValue={editingBook?.category || ''} 
                className="w-full px-3 py-2 bg-surface border border-border rounded-md focus:border-primary focus:outline-none text-text" 
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">{t('admin.price')}</label>
            <input 
              name="price" 
              type="number" 
              defaultValue={editingBook?.price || ''} 
              className="w-full px-3 py-2 bg-surface border border-border rounded-md focus:border-primary focus:outline-none text-text" 
              required 
            />
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
