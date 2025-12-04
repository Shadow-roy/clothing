// Fix: Created the ItemFormModal component to handle item creation and updates.
import React, { useState, useEffect } from 'react';
import { GlossaryItem } from '../types';
import ImageUpload from './ImageUpload';
import { XMarkIcon } from './icons/XMarkIcon';

interface ItemFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: GlossaryItem | Omit<GlossaryItem, 'id'>) => void;
  item: GlossaryItem | null;
  categories: string[];
}

const ItemFormModal: React.FC<ItemFormModalProps> = ({ isOpen, onClose, onSave, item, categories }) => {
  const [formData, setFormData] = useState<Omit<GlossaryItem, 'id'>>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    imageURL: '',
    category: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (item) {
      setFormData(item);
    } else {
      setFormData({
        name: '',
        description: '',
        price: 0,
        stock: 0,
        imageURL: '',
        category: categories[0] || '',
      });
    }
    setErrors({});
  }, [item, isOpen, categories]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'price' || name === 'stock' ? Number(value) : value }));
  };

  const handleImageChange = (imageURL: string) => {
    setFormData(prev => ({ ...prev, imageURL }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required.';
    if (!formData.description.trim()) newErrors.description = 'Description is required.';
    if (formData.price <= 0) newErrors.price = 'Price must be positive.';
    if (formData.stock < 0) newErrors.stock = 'Stock cannot be negative.';
    if (!formData.category) newErrors.category = 'Category is required.';
    if (!formData.imageURL) newErrors.imageURL = 'Image is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      if (item) {
        onSave({ ...formData, id: item.id });
      } else {
        onSave(formData);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" aria-modal="true" role="dialog">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-slate-800 p-4 sm:p-6 border-b dark:border-gray-700 z-10">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{item ? 'Edit Item' : 'Add New Item'}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              aria-label="Close modal"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <div className="p-4 sm:p-6 space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
              <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className={`mt-1 block w-full border rounded-md shadow-sm p-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white ${errors.name ? 'border-red-500' : ''}`} />
              {errors.name && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
              <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={4} className={`mt-1 block w-full border rounded-md shadow-sm p-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white ${errors.description ? 'border-red-500' : ''}`} />
              {errors.description && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.description}</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price</label>
                <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} min="0" step="0.01" className={`mt-1 block w-full border rounded-md shadow-sm p-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white ${errors.price ? 'border-red-500' : ''}`} />
                {errors.price && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.price}</p>}
              </div>
              <div>
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Stock</label>
                <input type="number" name="stock" id="stock" value={formData.stock} onChange={handleChange} min="0" className={`mt-1 block w-full border rounded-md shadow-sm p-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white ${errors.stock ? 'border-red-500' : ''}`} />
                {errors.stock && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.stock}</p>}
              </div>
            </div>
             <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                <select
                    name="category"
                    id="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`mt-1 block w-full border rounded-md shadow-sm p-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white ${errors.category ? 'border-red-500' : ''}`}
                >
                    <option value="" disabled>Select a category</option>
                    {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
                {errors.category && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.category}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Image</label>
              <div className="mt-1">
                <ImageUpload value={formData.imageURL} onChange={handleImageChange} />
              </div>
              {errors.imageURL && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.imageURL}</p>}
            </div>
          </div>
          <div className="sticky bottom-0 bg-gray-50 dark:bg-slate-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
            <button
              type="submit"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Save
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItemFormModal;