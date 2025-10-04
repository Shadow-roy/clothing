import React, { useState, useMemo } from 'react';
import ItemCard from './ItemCard';
import { MagnifyingGlassIcon } from './icons/MagnifyingGlassIcon';
import CategoryFilter from './CategoryFilter';
import { useItems } from '../contexts/ItemsContext';

const Storefront: React.FC = () => {
  const { items, categories } = useItems();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [items, searchTerm, selectedCategory]);

  return (
    <div className="space-y-8">
      <div className="text-center pt-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Welcome to Our Store</h1>
        <p className="mt-2 text-lg text-gray-600">Your one-stop shop for all your daily needs.</p>
      </div>

      <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="flex flex-col gap-4">
             <CategoryFilter
                categories={['All', ...categories]}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
            />
            <div className="relative w-full">
                <input
                    type="text"
                    placeholder="Search for items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
                />
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
        </div>
      </div>

      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredItems.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
            <h2 className="text-xl font-semibold text-gray-700">No items found</h2>
            <p className="text-gray-500 mt-2">Try adjusting your search or filter.</p>
        </div>
      )}
    </div>
  );
};

export default Storefront;
