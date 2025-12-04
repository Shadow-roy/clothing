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
        <h1 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-slate-100 font-serif">Discover Your Style</h1>
        <p className="mt-3 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Curated collections for the modern woman. Find pieces that tell your story.</p>
      </div>

      <div className="sticky top-[65px] z-30 py-4 bg-gray-50/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-4">
            <div className="w-full sm:w-56 flex-shrink-0">
                <CategoryFilter
                    categories={['All', ...categories]}
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                />
            </div>
            <div className="relative w-full">
                <input
                    type="text"
                    placeholder="Search for dresses, tops, etc..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-800 dark:text-slate-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                />
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
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
            <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300">No items found</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Try adjusting your search or filter.</p>
        </div>
      )}
    </div>
  );
};

export default Storefront;