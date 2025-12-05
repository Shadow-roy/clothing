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
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <div className="text-center pt-16 pb-8">
        <h1 className="text-6xl md:text-7xl font-serif font-bold text-stone-800 dark:text-stone-50 mb-6 tracking-tight drop-shadow-sm">
            Discover Your <span className="text-rose-600 dark:text-rose-400 italic">Style</span>
        </h1>
        <p className="text-xl text-stone-600 dark:text-stone-300 max-w-2xl mx-auto font-light leading-relaxed">
            Curated collections for the modern woman. Find pieces that tell your unique story.
        </p>
      </div>

      {/* Filter & Search Bar - Floating Glass */}
      <div className="sticky top-[75px] z-30 py-4 -mx-4 px-4 transition-all duration-300">
        <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-white/70 dark:bg-stone-800/60 backdrop-blur-xl p-2 rounded-2xl shadow-lg border border-white/40 dark:border-stone-700/40 ring-1 ring-black/5">
                <div className="w-full sm:w-64 flex-shrink-0">
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
                        className="w-full pl-12 pr-4 py-3 bg-transparent text-stone-800 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 rounded-xl focus:outline-none focus:bg-white/50 dark:focus:bg-stone-700/50 transition-colors"
                    />
                    <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400 dark:text-stone-500" />
                </div>
            </div>
        </div>
      </div>

      {/* Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
          {filteredItems.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white/50 dark:bg-stone-800/40 rounded-3xl border border-dashed border-stone-300 dark:border-stone-700 backdrop-blur-sm">
            <h2 className="text-2xl font-serif font-medium text-stone-700 dark:text-stone-300">No items found</h2>
            <p className="text-stone-500 dark:text-stone-400 mt-2">Try adjusting your search or filter options.</p>
        </div>
      )}
    </div>
  );
};

export default Storefront;